import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTweet } from '../store/Slices/tweetSlice';
import { useEffect, useRef, useState } from 'react';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

const TweetCreate = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '',
    },
  });
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tweet);
  const [uploaded, setUploaded] = useState(false);
  const timeoutRef = useRef(null);
  const content = watch('content', '');

  const create = (formData) => {
    dispatch(createTweet(formData.content))
      .then((res) => {
        if (res.type === 'createTweet/fulfilled') {
          setUploaded(true);
          timeoutRef.current = setTimeout(() => {
            setUploaded(false);
          }, 2000);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => reset());
  };

  useEffect(() => {
    setFocus('content');

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [setFocus]);

  return (
    <Container className="h-fit max-w-200 py-10">
      {loading && (
        <LinearProgress
          color="error"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 101,
            height: '2px',
          }}
        />
      )}
      <Box className="glass h-full rounded-lg bg-red-800/50 p-8 shadow-lg">
        <Typography
          variant="h4"
          className="text-center text-gray-900"
          sx={{ marginBottom: '24px', fontWeight: '700' }}
        >
          Create New Tweet
        </Typography>
        <form onSubmit={handleSubmit(create)} className="!space-y-6">
          <TextField
            label="Post an update to your fans"
            variant="filled"
            multiline
            rows={4}
            fullWidth
            required
            disabled={loading || uploaded}
            {...register('content', {
              required: 'Tweet cannot be empty',
              validate: (value) =>
                value.trim().length > 0 || 'Tweet cannot be only whitespace',
            })}
            error={!!errors.content}
            helperText={
              errors.content ? errors.content.message : `${content.length}/500`
            }
            inputProps={{ maxLength: 500 }}
            FormHelperTextProps={
              !errors.content && {
                style: {
                  color:
                    content.length >= 500
                      ? '#d32f2f'
                      : content.length >= 480
                        ? '#ff9800'
                        : undefined,
                },
              }
            }
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            color={!uploaded ? 'info' : 'success'}
            fullWidth
            className="btn transition-colors duration-300 ease-in"
          >
            {loading && (
              <CircularProgress
                size={25}
                color="info"
                sx={{ position: 'absolute' }}
              />
            )}
            {loading ? (
              'Posting'
            ) : uploaded ? (
              <DoneRoundedIcon fontSize="large" />
            ) : (
              'Post'
            )}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default TweetCreate;
