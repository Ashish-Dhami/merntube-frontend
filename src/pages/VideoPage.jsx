import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Description, Video, CommentsSection } from '../components';
import { useEffect } from 'react';
import { getVideoById, makeVideoNull } from '../store/Slices/videoSlice';
import { toast } from 'react-toastify';
import { Alert, AlertTitle } from '@mui/material';

export default function VideoPage() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const video = useSelector((state) => state.video.video);
  const loading = useSelector((state) => state.video.loading);

  useEffect(() => {
    dispatch(getVideoById(videoId)).then(({ payload: fetchedVideo }) => {
      if (fetchedVideo && !fetchedVideo?.isPublished) {
        toast(
          <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
            <AlertTitle>Video not available</AlertTitle>
            This video is not published
          </Alert>,
          {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            style: { padding: 0 },
            onClose: () => {
              try {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  console.warn('No history to go back, redirecting to home');
                  navigate('/');
                }
              } catch {
                console.warn('No history to go back, redirecting to home');
                navigate('/');
              }
            },
          }
        );
      }
    });

    return () => {
      dispatch(makeVideoNull());
    };
  }, [videoId]);

  if (loading) {
    return <h1 className="text-4xl">....LOADING</h1>;
  }

  return (
    video &&
    video.isPublished && (
      <div className="max-w-180">
        <Video url={video?.videoFile} thumbnail={video?.thumbnail} />
        <Description
          title={video?.title}
          owner={video?.owner}
          description={video?.description}
          views={video?.views}
          createdAt={video?.createdAt}
          isLiked={video?.isLiked}
          likesCount={video?.likesCount}
          videoId={videoId}
        />
        <CommentsSection videoId={videoId} />
      </div>
    )
  );
}
