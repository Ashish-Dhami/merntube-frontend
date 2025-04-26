import { Fireworks, Loader, VideoShareModal } from '../components';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos, makeVideosNull } from '../store/Slices/videoSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { HoverEffect } from '../components/ui/card-hover-effect';

export default function HomePage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { searchTerm } = useOutletContext();
  const query = { page, limit: 9, query: searchTerm };

  useEffect(() => {
    dispatch(getAllVideos({ ...query, page: 1 })).then((res) => {
      if (res.type === 'getAllVideos/fulfilled') setPage(1);
    });

    return () => {
      dispatch(makeVideosNull());
    };
  }, [query.query]);

  const videos = useSelector((state) => state.video.videos);
  const hasNextPage = useSelector((state) => state.video.hasNextPage);

  const fetchMoreVideos = useCallback(() => {
    if (hasNextPage) {
      dispatch(getAllVideos({ ...query, page: page + 1 }))
        .then((res) => {
          if (res.type === 'getAllVideos/fulfilled') setPage(page + 1);
        })
        .catch((error) => console.error(error));
    }
  }, [page, hasNextPage]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoShareLink, setVideoShareLink] = useState('');

  return (
    <>
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
              <Fireworks />
            </p>
          )
        }
      >
        <HoverEffect
          videos={videos}
          setIsModalOpen={setIsModalOpen}
          setVideoShareLink={setVideoShareLink}
          className="min-h-[91vh]"
        />
      </InfiniteScroll>
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
