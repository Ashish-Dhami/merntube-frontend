import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWatchHistory } from '../store/Slices/userSlice';
import {
  Loader,
  VideoCard,
  VideoShareModal,
  VideoDeleted,
} from '../components';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function History() {
  useDocumentTitle(`Watch History - MERNTube`);
  const dispatch = useDispatch();
  const watchHistoryData = useSelector((state) => state.user.watchHistory);
  const loading = useSelector((state) => state.user.loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoShareLink, setVideoShareLink] = useState('');

  const renderDateText = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    const isSameYearAndMonth =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth();

    if (isSameYearAndMonth) {
      const dayDiff = today.getDate() - date.getDate();
      if (dayDiff === 0) return 'Today';
      if (dayDiff === 1) return 'Yesterday';
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    dispatch(getWatchHistory());
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1 className="p-3 text-2xl font-semibold">Watch History</h1>
      <div className="grid w-full grid-cols-1 gap-y-4">
        {watchHistoryData.map(({ _id, watchHistory }) => (
          <Fragment key={_id}>
            <h2 className="font-roboto mt-8 mb-4 rounded-lg bg-[#0f0f0f] px-3 py-4 text-xl">
              {renderDateText(_id)}
            </h2>
            {watchHistory.map((video, i) =>
              !video ? (
                <VideoDeleted key={i} />
              ) : (
                <VideoCard
                  key={i}
                  id={video._id}
                  title={video.title}
                  description={video.description}
                  thumbnail={video.thumbnail}
                  owner={video.owner}
                  createdAt={video.createdAt}
                  published={video.isPublished}
                  views={video.views}
                  duration={video.duration}
                  setIsModalOpen={setIsModalOpen}
                  setVideoShareLink={setVideoShareLink}
                  layoutChange={true}
                />
              )
            )}
          </Fragment>
        ))}
      </div>
      {isModalOpen && (
        <VideoShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={videoShareLink}
        />
      )}
    </>
  );
}
