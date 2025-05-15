import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { useState, useRef } from 'react';
import { Input, ReadMore, Button } from './';
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  HiDotsVertical,
  CiEdit,
  MdOutlineDelete,
  IoCloseOutline,
  MdOutlineCheck,
} from '../icons';
import { toggleCommentLike } from '../store/Slices/likeSlice';
import { useDispatch } from 'react-redux';
import { updateComment, deleteComment } from '../store/Slices/commentSlice';
import { toast } from 'react-toastify';
import '../assets/react-toastify.css';
import { formatNumber } from '../helpers/formatNumber';
import { Avatar, IconButton } from '@mui/material';
import { stringAvatar } from '../helpers/stringAvatar';

export default function CommentList({
  id,
  username,
  fullName,
  avatar,
  comment,
  createdAt,
  updatedAt,
  isLiked,
  likesCount,
  canEditDelete,
  setTotalCommentsLocal,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const [editable, setEditable] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [initialComment, setInitialComment] = useState(comment);
  const [isModified, setIsModified] = useState(createdAt !== updatedAt);
  const [isDeleted, setIsDeleted] = useState(false);
  const [updatedAtLocal, setUpdatedAtLocal] = useState(updatedAt);
  const inputRef = useRef(null);

  const likeHandler = () => {
    if (editable) return; //for handling edge cases
    dispatch(toggleCommentLike(id))
      .then((res) => {
        if (res.type === 'toggleCommentLike/fulfilled') {
          setLocalIsLiked((prev) => !prev);
          setLocalLikesCount((prev) => (localIsLiked ? prev - 1 : prev + 1));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditClick = () => {
    setEditable(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          editedComment.length,
          editedComment.length
        );
      }
    }, 0); // Defer to ensure DOM is updated
  };

  const handleUpdate = () => {
    if (!editedComment.trim()) return;
    dispatch(updateComment({ commentId: id, newContent: editedComment }))
      .then((res) => {
        if (res.type === 'updateComment/fulfilled') {
          setUpdatedAtLocal(new Date().toISOString());
          setEditable(false);
          setIsModified(true);
          setInitialComment(editedComment);
        }
      })
      .catch((error) => console.error(error));
  };

  const manualDismissRef = useRef(false);
  const handleDeletion = () => {
    manualDismissRef.current = false;
    setIsDeleted(true);
    setTotalCommentsLocal((prev) => prev - 1);

    // Store the toast ID so we can close it later
    let toastId = null;

    const handleUndo = () => {
      manualDismissRef.current = true;
      setIsDeleted(false);
      setTotalCommentsLocal((prev) => prev + 1);
      toast.dismiss(toastId); // Dismiss the toast
    };

    // Show toast with undo button
    toastId = toast.success(
      <div className="flex w-full items-center justify-around">
        <span className="font-poppins text-sm font-semibold text-[#003333]">
          Comment has been deleted
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
            dispatch(deleteComment(id));
          }
        },
      }
    );
  };

  const handleClose = () => {
    setEditable(false);
    setEditedComment(initialComment);
  };

  return (
    !isDeleted && (
      <div className="font-roboto my-4 flex gap-x-3 p-1 pb-4">
        <IconButton
          size="small"
          color="info"
          onClick={() => navigate(`/@${username}`)}
          sx={{ alignSelf: 'flex-start', flexShrink: 0 }}
        >
          <Avatar
            src={avatar}
            {...stringAvatar(fullName)}
            sx={{
              ...stringAvatar(fullName).sx,
              height: '2.5rem',
              width: '2.5rem',
            }}
          />
        </IconButton>
        <div id="comment" className="flex grow-1 flex-col">
          <p className="shrink-0">
            @
            <span
              className="mr-2 cursor-pointer text-sm font-bold"
              onClick={() => navigate(`/@${username}`)}
            >
              {username}
            </span>
            <span className="cursor-pointer text-xs text-[#aaa] hover:text-inherit">
              <ReactTimeAgo date={new Date(updatedAtLocal)} locale="en-US" />
              {isModified && <>&nbsp;(edited)</>}
            </span>
          </p>
          {editable ? (
            <div className="flex items-center gap-x-2">
              <Input
                className="grow rounded-none border-b border-gray-700 py-1 text-sm shadow-none focus:shadow-none focus:outline-none"
                value={editedComment}
                required
                onChange={() => setEditedComment(inputRef.current.value)}
                ref={inputRef}
              />
              <span
                className="tooltip tooltip-accent tooltip-bottom"
                data-tip="Save"
                onClick={handleUpdate}
              >
                <MdOutlineCheck className="cursor-pointer text-xl text-gray-300 transition-colors hover:text-white" />
              </span>
              <span
                className="tooltip tooltip-warning tooltip-bottom"
                data-tip="Close"
                onClick={handleClose}
              >
                <IoCloseOutline className="cursor-pointer text-2xl text-gray-300 transition-colors hover:text-white" />
              </span>
            </div>
          ) : (
            <ReadMore
              id={`read-more-comment-${id}`}
              text={editedComment}
              className="grow-1 text-sm break-normal md:break-all"
              amountOfWords={30}
            />
          )}
          <div className="mt-1.5 flex shrink-0 gap-x-6">
            <div
              className={`flex items-center ${editable ? 'cursor-not-allowed' : ''}`}
            >
              <span
                className={`tooltip tooltip-info tooltip-bottom flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl hover:bg-gray-700 ${editable ? 'pointer-events-none' : ''}`}
                data-tip="Like"
                onClick={likeHandler}
              >
                {localIsLiked ? <AiFillLike /> : <AiOutlineLike />}
              </span>
              <span className="cursor-auto text-xs text-[#aaa]">
                {formatNumber(localLikesCount)}
              </span>
            </div>
            <div className={editable ? 'cursor-not-allowed' : ''}>
              <span
                className={`tooltip tooltip-info tooltip-bottom flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl hover:bg-gray-700 ${editable ? 'pointer-events-none' : ''}`}
                data-tip="Dislike"
              >
                <AiOutlineDislike />
              </span>
            </div>
          </div>
        </div>
        <div className="w-5 shrink-0 self-start">
          {canEditDelete && (
            <div className="dropdown dropdown-end">
              <HiDotsVertical
                tabIndex={0}
                className="origin-top-left cursor-pointer hover:scale-110 hover:text-blue-300"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box z-1 w-36 bg-[#282828] p-1 shadow-sm"
              >
                <li>
                  <a onClick={handleEditClick}>
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
          )}
        </div>
      </div>
    )
  );
}
