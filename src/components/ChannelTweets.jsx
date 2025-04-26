import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTweets } from '../store/Slices/tweetSlice';
import { Tweet, Loader, TweetEditModal } from './';
import { useOutletContext } from 'react-router-dom';
import { debounce } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ChannelTweets({ current = false }) {
  const dispatch = useDispatch();
  const { sortBy } = useOutletContext() || {};
  const userId = useSelector(({ user }) =>
    current ? user.userData?._id : user.userProfileData?._id
  );
  const { tweets, hasNextPage } = useSelector((state) => state.tweet);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const query = {
    page,
    limit: 6,
    sortBy: sortBy?.field,
    sortType: sortBy?.order,
  };

  let timeoutId = useRef(null);

  useEffect(() => {
    if (loading && timeoutId.current) clearTimeout(timeoutId.current);

    setLoading(true);
    timeoutId.current = setTimeout(() => {
      dispatch(getUserTweets({ userId, query: { ...query, page: 1 } })).then(
        (res) => {
          if (res.type === 'getUserTweets/fulfilled') {
            setLoading(false);
            setPage(1);
          }
        }
      );
    }, 700);
  }, [userId, sortBy]);

  const fetchMoreTweets = debounce(() => {
    if (loading) return;
    dispatch(getUserTweets({ userId, query: { ...query, page: page + 1 } }))
      .then((res) => {
        if (res.type === 'getUserTweets/fulfilled') setPage(page + 1);
      })
      .catch((error) => console.error(error));
  }, 300);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tweetToEdit, setTweetToEdit] = useState(null);

  return (
    <div className="relative w-full" aria-busy={loading}>
      <InfiniteScroll
        dataLength={tweets?.allIds?.length || 0}
        next={fetchMoreTweets}
        hasMore={hasNextPage}
        loader={<Loader className="mt-3 max-w-187 pl-4" />}
        scrollableTarget="outlet-div"
        endMessage={
          !!tweets.allIds.length && (
            <p className="masked-text mt-4 max-w-188 pl-4 text-center">
              Yay! You have seen it all
            </p>
          )
        }
      >
        <div
          className={`grid w-full grid-cols-1 pl-4 ${loading ? 'pointer-events-none' : ''} gap-4`}
        >
          {tweets.allIds.map((id) => (
            <Tweet
              key={id}
              tweet={tweets.byId[id]}
              setIsEditModalOpen={setIsEditModalOpen}
              setTweetToEdit={setTweetToEdit}
              allowCRUD={current}
            />
          ))}
        </div>
      </InfiniteScroll>
      {loading && (
        <div className="absolute inset-0 z-50 backdrop-blur-xs"></div>
      )}
      {isEditModalOpen && (
        <TweetEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          tweet={tweetToEdit}
        />
      )}
    </div>
  );
}
