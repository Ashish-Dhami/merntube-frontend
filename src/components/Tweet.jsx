import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactTimeAgo from 'react-time-ago';
import { formatNumber } from '../helpers/formatNumber';
import {
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
  CiEdit,
  MdOutlineDelete,
} from '../icons';
import { useNavigate } from 'react-router-dom';
import { Button, ReadMore } from './';
import { useDispatch } from 'react-redux';
import { toggleTweetLike } from '../store/Slices/likeSlice';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteTweet } from '../store/Slices/tweetSlice';

const Tweet = ({ tweet, setIsEditModalOpen, setTweetToEdit, allowCRUD }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);

  const likeHandler = () => {
    dispatch(toggleTweetLike(tweet._id));
  };
  const handleEdit = () => {
    const existingTweet = { id: tweet._id, content: tweet.content };
    setTweetToEdit(existingTweet);
    setIsEditModalOpen(true);
    document.activeElement?.blur();
  };

  const manualDismissRef = useRef(false);
  const handleDeletion = () => {
    manualDismissRef.current = false;
    setIsDeleted(true);

    // Store the toast ID so we can close it later
    let toastId = null;

    const handleUndo = () => {
      manualDismissRef.current = true;
      setIsDeleted(false);
      toast.dismiss(toastId); // Dismiss the toast
    };

    // Show toast with undo button
    toastId = toast.success(
      <div className="flex w-full items-center justify-around">
        <span className="font-poppins text-sm font-semibold text-[#003333]">
          Tweet has been deleted
        </span>
        <Button
          text="Undo"
          className="font-roboto h-8 rounded-2xl bg-[#003333] text-[#FAF9F6]"
          clickHandler={handleUndo}
          overwriteStyle={true}
        />
      </div>,
      {
        theme: 'light',
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        style: {
          width: '365px',
          backgroundColor: '#FAF9F6',
          minHeight: '55px',
          maxHeight: '55px',
        },
        onClose: () => {
          if (!manualDismissRef.current) {
            dispatch(deleteTweet(tweet._id));
          }
        },
      }
    );
  };

  return (
    !isDeleted && (
      <Card
        raised
        variant="elevation"
        sx={{ maxWidth: 750, borderRadius: '0.8rem' }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={tweet.owner.avatar}
              alt={tweet.owner.username.charAt(0).toUpperCase()}
              className="cursor-pointer !bg-red-500 outline-1 outline-gray-500"
              onClick={() =>
                navigate(`/@${tweet.owner.username}`, { replace: true })
              }
            />
          }
          action={
            allowCRUD && (
              <div className="dropdown dropdown-end font-roboto">
                <IconButton aria-label="settings">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box z-1 w-30 bg-[#282828] p-1 shadow-sm"
                >
                  <li>
                    <a onClick={handleEdit}>
                      <CiEdit />
                      Edit
                    </a>
                  </li>
                  <li>
                    <a onClick={handleDeletion}>
                      <MdOutlineDelete />
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            )
          }
          title={
            <span
              className="mr-2 cursor-pointer text-sm font-medium"
              onClick={() => navigate(`/@${tweet.owner.username}`)}
            >
              {tweet.owner.fullName}
            </span>
          }
          subheader={
            <span className="cursor-pointer text-xs text-[#aaa] hover:text-inherit">
              <ReactTimeAgo date={new Date(tweet.createdAt)} locale="en-US" />
            </span>
          }
        />
        <CardContent sx={{ marginX: '55px' }}>
          <ReadMore
            id={`read-more-tweet-${tweet._id}`}
            text={tweet.content}
            className="font-roboto text-sm break-normal md:break-all"
            amountOfWords={30}
          />
        </CardContent>
        <CardActions sx={{ marginX: '55px' }} disableSpacing>
          <IconButton
            size="small"
            aria-label="like this tweet"
            className="tooltip tooltip-info"
            data-tip="Like"
            onClick={likeHandler}
          >
            {tweet.isLiked ? <AiFillLike /> : <AiOutlineLike />}
          </IconButton>
          <span className="cursor-auto text-xs text-[#aaa]">
            {formatNumber(tweet.likesCount)}
          </span>
          <IconButton
            size="small"
            aria-label="dislike this tweet"
            className="tooltip tooltip-info"
            data-tip="Dislike"
            sx={{ marginLeft: '20px' }}
          >
            <AiOutlineDislike />
          </IconButton>
        </CardActions>
      </Card>
    )
  );
};

export default Tweet;
