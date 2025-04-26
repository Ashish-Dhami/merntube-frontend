import ReactTimeAgo from 'react-time-ago';
import { Button, ReadMore, VideoShareModal } from './';
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  HiDotsHorizontal,
  CiShare2,
  GoReport,
  MdOutlinePlaylistAdd,
} from '../icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleSubscription } from '../store/Slices/subscriptionSlice';
import { useState } from 'react';
import { toggleVideoLike } from '../store/Slices/likeSlice';
import { formatNumber } from '../helpers/formatNumber';

export default function Description({
  title,
  owner,
  description,
  views,
  createdAt,
  isLiked,
  likesCount,
  videoId,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localIsSubscribed, setLocalIsSubscribed] = useState(
    owner?.isSubscribed
  );
  const [localSubscribersCount, setLocalSubscribersCount] = useState(
    owner?.totalSubscribers
  );
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoShareLink =
    typeof window !== 'undefined' ? window.location.href : '';

  const toggleSubscribe = () => {
    dispatch(toggleSubscription(owner?._id))
      .then((res) => {
        if (res.type === 'toggleSubscription/fulfilled') {
          setLocalIsSubscribed((prev) => !prev);
          setLocalSubscribersCount((prev) =>
            localIsSubscribed ? prev - 1 : prev + 1
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const likeHandler = () => {
    dispatch(toggleVideoLike(videoId))
      .then((res) => {
        if (res.type === 'toggleVideoLike/fulfilled') {
          setLocalIsLiked((prev) => !prev);
          setLocalLikesCount((prev) => (localIsLiked ? prev - 1 : prev + 1));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <h1
        id="title"
        className="m-2 text-2xl font-bold tracking-wide break-normal whitespace-pre-wrap md:break-all"
      >
        {title}
      </h1>
      <div id="details" className="font-roboto flex justify-between">
        <div id="owner" className="flex items-center gap-x-3">
          <div id="publisher-image">
            <img
              src={owner?.avatar}
              alt={owner?.username.charAt(0).toUpperCase()}
              className="h-10 w-10 cursor-pointer rounded-full object-cover text-center leading-10 outline-1 outline-gray-600"
              onClick={() => navigate(`/@${owner?.username}`)}
            />
          </div>
          <div>
            <p
              className="tooltip tooltip-info cursor-pointer"
              data-tip={owner?.username}
              onClick={() => navigate(`/@${owner?.username}`)}
            >
              {owner?.username}
            </p>
            <p className="text-sm text-[#aaa]">
              {formatNumber(localSubscribersCount)} subscribers
            </p>
          </div>
          <Button
            text={localIsSubscribed ? 'Subscribed' : 'Subscribe'}
            className={`h-9 rounded-3xl ${localIsSubscribed ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-100 hover:bg-gray-400'} text-black`}
            clickHandler={toggleSubscribe}
            overwriteStyle={true}
          />
        </div>
        <div id="actions" className="flex items-center gap-x-2">
          <div className="join">
            <div
              className="tooltip tooltip-accent join-item"
              data-tip="I like this"
            >
              <Button
                text={
                  <>
                    {formatNumber(localLikesCount)}
                    {localIsLiked ? <AiFillLike /> : <AiOutlineLike />}
                  </>
                }
                className="h-9 rounded-l-full"
                overwriteStyle={true}
                clickHandler={likeHandler}
              />
            </div>
            <div
              className="tooltip tooltip-warning join-item"
              data-tip="I dislike this"
            >
              <Button
                text={<AiOutlineDislike />}
                className="h-9 rounded-r-full border-l-gray-500"
                overwriteStyle={true}
              />
            </div>
          </div>
          <div className="tooltip tooltip-accent" data-tip="Share">
            <Button
              text={
                <>
                  <CiShare2 />
                  Share
                </>
              }
              className="h-9 rounded-full"
              overwriteStyle={true}
              clickHandler={() => setIsModalOpen(true)}
            />
          </div>
          <div className="dropdown dropdown-end font-roboto">
            <Button
              text={<HiDotsHorizontal tabIndex={0} />}
              className="join-item h-9 rounded-full"
              overwriteStyle={true}
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-1 w-33 bg-[#282828] p-1 shadow-sm"
            >
              <li>
                <a>
                  <MdOutlinePlaylistAdd className="text-lg" />
                  Save
                </a>
              </li>
              <li>
                <a>
                  <GoReport />
                  Report
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        id="description"
        className="font-roboto border-base-300 bg-neutral text-neutral-content mt-2 min-h-20 rounded-lg border px-3 py-2"
      >
        <span className="mr-2 font-medium">{`${formatNumber(views)} views`}</span>
        <span className="mr-2 font-extrabold">&#xB7;</span>
        <span className="font-medium">
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </span>
        <ReadMore
          id="read-more-description"
          text={description}
          className="text-sm break-normal md:break-all"
        />
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
