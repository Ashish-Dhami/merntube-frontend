import { CommentList, Loader, NewComment } from './';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  cleanupComments,
  getVideoComments,
} from '../store/Slices/commentSlice';
import { memo } from 'react';
import { useEffect, useState } from 'react';
import { MdOutlineSort } from '../icons';
import { formatNumber } from '../helpers/formatNumber';

const CommentsSection = memo(({ videoId }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('updatedAt');
  const query = { page, limit: 5, sortBy };
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.user.userData);
  const comments = useSelector((state) => state.comment.comments);
  const hasMoreComments = useSelector((state) => state.comment.hasMoreComments);
  const totalComments = useSelector((state) => state.comment.totalComments);
  const [totalCommentsLocal, setTotalCommentsLocal] = useState(totalComments);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getVideoComments({ videoId, query: { ...query, page: 1 } }))
      .then((res) => {
        if (res.type === 'getVideoComments/fulfilled') setPage(1);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    return () => {
      dispatch(cleanupComments());
    };
  }, [videoId, sortBy]);

  useEffect(() => {
    setTotalCommentsLocal(totalComments);
  }, [totalComments]);

  const fetchMoreComments = () => {
    dispatch(
      getVideoComments({
        videoId,
        query: { ...query, page: page + 1 },
      })
    )
      .then((res) => {
        if (res.type === 'getVideoComments/fulfilled') setPage(page + 1);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div id="comments" className="relative mt-3 px-3">
      <h2 className="inline-block text-2xl font-medium">
        {formatNumber(totalCommentsLocal)} Comments
      </h2>
      {!!totalCommentsLocal && (
        <div className="dropdown dropdown-end absolute right-0">
          <div
            tabIndex={0}
            role="button"
            className="cursor-pointer rounded-md bg-transparent px-3 py-1.5 text-sm font-semibold transition-colors duration-300 ease-in-out select-none hover:text-gray-500 focus:outline-none active:bg-gray-700"
          >
            <MdOutlineSort className="mr-2 inline text-lg" />
            Sort by
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-1 w-37 bg-[#282828] p-2 shadow-sm"
          >
            <li>
              <a
                className={sortBy === 'updatedAt' ? 'bg-gray-600' : ''}
                onClick={() => {
                  setSortBy('updatedAt');
                  document.activeElement?.blur();
                }}
              >
                Newest first
              </a>
            </li>
            <li>
              <a
                className={sortBy === 'likesCount' ? 'bg-gray-600' : ''}
                onClick={() => {
                  setSortBy('likesCount');
                  document.activeElement?.blur();
                }}
              >
                Top comments
              </a>
            </li>
          </ul>
        </div>
      )}
      <NewComment videoId={videoId} setSortBy={setSortBy} />
      {loading && comments?.length === 0 ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={comments?.length || 0}
          next={fetchMoreComments}
          hasMore={hasMoreComments}
          loader={<Loader />}
          scrollableTarget="outlet-div"
          endMessage={
            !!totalComments && (
              <p className="masked-text mt-4 text-center">
                Yay! You have seen it all
              </p>
            )
          }
        >
          {comments.map((comment) => (
            <CommentList
              key={comment?._id}
              id={comment?._id}
              username={comment?.commentedBy?.username}
              fullName={comment?.commentedBy?.fullName}
              avatar={comment?.commentedBy?.avatar}
              comment={comment?.comment}
              createdAt={comment?.createdAt}
              updatedAt={comment?.updatedAt}
              isLiked={comment?.isLiked}
              likesCount={comment?.likesCount}
              canEditDelete={userData?._id === comment?.commentedBy?._id}
              setTotalCommentsLocal={setTotalCommentsLocal}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
});

export default CommentsSection;
