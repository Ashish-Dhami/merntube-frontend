import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '../store/Slices/videoSlice';
import { Loader, VideoCard, VideoEditModal, VideoShareModal } from './';
import { useOutletContext } from 'react-router-dom';
import debounce from 'lodash/debounce';

export default function ChannelVideos({ current = false }) {
  const dispatch = useDispatch();
  const userProfileData = useSelector((state) => state.user.userProfileData);
  const { _id: userId } = useSelector((state) => state.user.userData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { setAllowSearch, setShowSearchForm, searchTerm, sortBy } =
    useOutletContext() || {};
  const query = {
    page,
    limit: 6,
    userId: current ? userId : userProfileData?._id,
    query: searchTerm || '',
    sortBy: sortBy?.field,
    sortType: sortBy?.order,
    showUnpublishedAlso: current,
  };

  let timeoutId = useRef(null);

  useEffect(() => {
    !current && setAllowSearch(true);

    if (loading && timeoutId.current) clearTimeout(timeoutId.current);

    setLoading(true);
    timeoutId.current = setTimeout(() => {
      dispatch(getAllVideos({ ...query, page: 1 })).then((res) => {
        if (res.type === 'getAllVideos/fulfilled') {
          setLoading(false);
          setPage(1);
        }
      });
    }, 700);

    return () => {
      if (!current) {
        setAllowSearch(false);
        setShowSearchForm(false);
      }
    };
  }, [query.userId, searchTerm, sortBy]);

  const videos = useSelector((state) => state.video.videos);
  const hasNextPage = useSelector((state) => state.video.hasNextPage);

  const fetchMoreVideos = debounce(() => {
    if (loading) return;
    dispatch(getAllVideos({ ...query, page: page + 1 }))
      .then((res) => {
        if (res.type === 'getAllVideos/fulfilled') setPage(page + 1);
      })
      .catch((error) => console.error(error));
  }, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [videoShareLink, setVideoShareLink] = useState('');
  const [videoToEdit, setVideoToEdit] = useState(null);

  return (
    <div className="relative w-full" aria-busy={loading}>
      <InfiniteScroll
        dataLength={videos?.length || 0}
        next={fetchMoreVideos}
        hasMore={hasNextPage}
        loader={<Loader />}
        scrollableTarget="outlet-div"
        endMessage={
          !!videos.length && (
            <p className="masked-text mt-4 text-center">
              Yay! You have seen it all
            </p>
          )
        }
      >
        <div
          className={`grid w-full grid-cols-1 ${loading ? 'pointer-events-none' : ''} ${!current ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}
        >
          {/*min-h-[91vh]*/}
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              id={video._id}
              title={video.title}
              description={current ? video.description : ''}
              thumbnail={video.thumbnail}
              owner={video.owner}
              createdAt={video.createdAt}
              published={video.isPublished}
              views={video.views}
              duration={video.duration}
              setIsModalOpen={setIsModalOpen}
              setVideoShareLink={setVideoShareLink}
              setIsEditModalOpen={setIsEditModalOpen}
              setVideoToEdit={setVideoToEdit}
              layoutChange={current}
              allowCRUD={current}
            />
          ))}
        </div>
      </InfiniteScroll>
      {loading && (
        <div className="absolute inset-0 z-50 backdrop-blur-xs"></div>
      )}
      {isModalOpen && (
        <VideoShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={videoShareLink}
        />
      )}
      {isEditModalOpen && (
        <VideoEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          video={videoToEdit}
        />
      )}
    </div>
  );
}
