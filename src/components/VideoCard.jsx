import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from 'react-time-ago';
import { useNavigate } from 'react-router-dom';
import { Button, Toggle } from './';
import {
  MdOutlinePlaylistAdd,
  CiShare2,
  HiDotsVertical,
  CiEdit,
  MdOutlineDelete,
  PiSealWarning,
} from '../icons';
import { formatNumber } from '../helpers/formatNumber';
import { useDispatch } from 'react-redux';
import { deleteVideo, togglePublishStatus } from '../store/Slices/videoSlice';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { stringAvatar } from '../helpers/stringAvatar';
import { Avatar, IconButton } from '@mui/material';

export default function VideoCard({
  title,
  description = '',
  id,
  thumbnail,
  owner,
  createdAt,
  published = true,
  views,
  duration,
  setIsModalOpen,
  setVideoShareLink,
  setIsEditModalOpen,
  setVideoToEdit,
  layoutChange = false,
  allowCRUD = false,
}) {
  const dateObj = new Date(duration * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  const durationString =
    (hours !== 0 ? hours.toString().padStart(2, '0') + ':' : '') +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

  const [descLimit, setDescLimit] = useState(170);
  const [isPublished, setIsPublished] = useState(published);
  const [isDeleted, setIsDeleted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleStatus = () => {
    dispatch(togglePublishStatus(id)).then((res) => {
      if (res.type === 'togglePublishStatus/fulfilled')
        setIsPublished((prev) => !prev);
    });
  };

  const interpolateLimit = (width) => {
    const minWidth = 300; // Minimum window width
    const maxWidth = 1200; // Maximum window width
    const minLimit = 100; // Minimum description limit
    const maxLimit = 170; // Maximum description limit

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const percentage = (clampedWidth - minWidth) / (maxWidth - minWidth);
    return Math.round(minLimit + (maxLimit - minLimit) * percentage);
  };

  useEffect(() => {
    const handleResize = () => {
      setDescLimit(interpolateLimit(window.innerWidth));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          Video has been deleted
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
            dispatch(deleteVideo(id));
          }
        },
      }
    );
  };

  const handleEdit = () => {
    const existingVid = { id, title, description, thumbnail };
    setVideoToEdit(existingVid);
    setIsEditModalOpen(true);
    document.activeElement?.blur();
  };

  return (
    !isDeleted && (
      <div
        className={`relative ${layoutChange && 'border-b border-gray-600 pb-4'}`}
      >
        <div
          className={`w-full rounded-lg ${layoutChange && 'flex items-start gap-x-4'} ${!isPublished && 'pointer-events-none bg-black/40 opacity-50'}`}
        >
          <div
            id="video-thumbnail"
            className={`relative aspect-video w-full cursor-pointer p-1 ${layoutChange ? 'max-w-36 shrink-0 md:max-w-64' : ''} `}
            onClick={() => navigate(`/watch/${id}`)}
          >
            {!isPublished ? (
              <div className="h-full w-full rounded-lg bg-black/40 backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 -translate-1/2 leading-0">
                  <p>
                    <PiSealWarning className="mx-auto text-xl md:text-2xl" />
                  </p>
                  <span className="hidden text-[11px] sm:text-xs md:inline">
                    Video not available
                  </span>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={thumbnail}
                  alt={title}
                  id="thumbnail"
                  className="flex h-full w-full items-center justify-center rounded-lg bg-black object-cover text-center"
                  loading="lazy"
                />
                <span className="absolute right-2 bottom-2 rounded-lg bg-black p-1 text-xs">
                  {durationString}
                </span>
              </>
            )}
          </div>
          <div
            id="video-detail"
            className={`${layoutChange ? 'max-w-155 grow' : 'm-2'} flex cursor-pointer gap-x-2`}
            onClick={() => navigate(`/watch/${id}`)}
          >
            {!layoutChange && (
              <IconButton
                size="small"
                color="info"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/@${owner.username}`);
                }}
                sx={{
                  alignSelf: 'flex-start',
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={owner.avatar}
                  {...stringAvatar(owner.fullName)}
                  sx={{
                    ...stringAvatar(owner.fullName).sx,
                    height: '2.5rem',
                    width: '2.5rem',
                  }}
                />
              </IconButton>
            )}
            <div className="relative grow text-sm">
              <p
                id="video-title"
                className={`font-roboto text-[1rem] font-medium break-normal whitespace-pre-wrap md:break-all ${layoutChange ? 'md:text-xl' : ''} ${!isPublished && 'text-slate-400'}`}
              >
                {title}
              </p>
              {!allowCRUD && (
                <p
                  id="channel-name"
                  className="tooltip tooltip-info font-roboto inline-block space-x-1 text-slate-400 hover:text-slate-200"
                  data-tip={owner.fullName}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/@${owner.username}`);
                  }}
                >
                  {owner.fullName}
                  {layoutChange && (
                    <span className="mx-2 font-extrabold">&#xB7;</span>
                  )}
                </p>
              )}
              <p
                id="views"
                className={`space-x-1 text-xs text-slate-400 ${layoutChange ? 'inline-block' : ''}`}
              >
                <span>{formatNumber(views)} Views</span>
                <span className="mr-2 ml-1 font-extrabold">&#xB7;</span>
                <span>
                  <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
                </span>
              </p>
              {layoutChange && (
                <p className="font-roboto mt-2 hidden leading-4 break-normal text-slate-400 md:block md:break-all">
                  {description &&
                    description.substring(
                      0,
                      Math.min(descLimit, description.trim().length)
                    )}
                  {description.trim().length > descLimit && '...'}
                </p>
              )}
              {allowCRUD && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-14 flex cursor-auto justify-center md:top-29"
                >
                  <span
                    className={`tooltip ${isPublished ? 'tooltip-warning' : 'tooltip-primary'} pointer-events-auto`}
                    data-tip={`${isPublished ? 'Unpublish' : 'Publish'} this video`}
                  >
                    <Toggle checked={isPublished} handleChange={toggleStatus} />
                  </span>
                  <span
                    className={`font-roboto ml-2 select-none md:text-[16px] ${isPublished ? 'text-slate-200' : 'text-slate-400'}`}
                  >
                    {isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`dropdown dropdown-end font-roboto ${allowCRUD && 'pointer-events-auto'} pt-1`}
              onClick={(e) => e.stopPropagation()}
            >
              <HiDotsVertical tabIndex={0} className="text-lg hover:text-xl" />
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box z-1 w-37 bg-[#282828] p-1 shadow-sm"
              >
                <li className={!isPublished ? 'hidden' : ''}>
                  <a>
                    <MdOutlinePlaylistAdd className="-ml-[3px] text-lg" />
                    Add to playlist
                  </a>
                </li>
                <li className={!isPublished ? 'hidden' : ''}>
                  <a
                    onClick={() => {
                      const videoShareLink =
                        typeof window !== 'undefined'
                          ? `${window.location.origin}/watch/${id}`
                          : '';

                      setVideoShareLink(videoShareLink);
                      setIsModalOpen(true);
                      document.activeElement?.blur();
                    }}
                  >
                    <CiShare2 className="-ml-0.5" />
                    Share
                  </a>
                </li>
                {allowCRUD && (
                  <>
                    <li className={!isPublished ? 'hidden' : ''}>
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
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
