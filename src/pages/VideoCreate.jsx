import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { MuiFileInput } from 'mui-file-input';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { publishAVideo, resetStateOnUnmount } from '../store/Slices/videoSlice';
import { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiHappyBeaming } from '../icons';

const VideoCreate = () => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      video: null,
      thumbnail: null,
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploading = useSelector((state) => state.video.uploading);
  const uploaded = useSelector((state) => state.video.uploaded);
  const timeoutRef = useRef(null);
  const title = watch('title', '');
  const description = watch('description', '');

  const upload = (formData) => {
    dispatch(publishAVideo(formData))
      .then((res) => {
        if (res.type === 'publishAVideo/fulfilled') {
          timeoutRef.current = setTimeout(() => {
            navigate(`/watch/${res.payload._id}`);
          }, 5000);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => reset());
  };

  useEffect(() => {
    setFocus('title');

    return () => {
      dispatch(resetStateOnUnmount());
      clearTimeout(timeoutRef.current);
    };
  }, [setFocus]);

  return (
    <Container maxWidth="md" className="h-fit py-10">
      {uploading && (
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
      <Box className="glass h-full rounded-lg bg-purple-800/50 p-8 shadow-lg">
        <Typography
          variant="h4"
          className="text-center text-gray-900"
          sx={{ marginBottom: '24px', fontWeight: '700' }}
        >
          Create New Video
        </Typography>
        <form onSubmit={handleSubmit(upload)} className="!space-y-6">
          <TextField
            label="Video Title"
            variant="filled"
            fullWidth
            required
            disabled={uploading}
            {...register('title', {
              required: 'Title is required',
              validate: (value) =>
                value.trim().length > 0 || 'Title cannot be only whitespace',
            })}
            error={!!errors.title}
            helperText={
              errors.title ? errors.title.message : `${title.length}/50`
            }
            inputProps={{ maxLength: 50 }}
            FormHelperTextProps={
              !errors.title && {
                style: {
                  color:
                    title.length >= 50
                      ? '#d32f2f'
                      : title.length >= 30
                        ? '#ff9800'
                        : undefined,
                },
              }
            }
          />
          <TextField
            label="Description"
            variant="filled"
            multiline
            rows={4}
            fullWidth
            required
            disabled={uploading}
            {...register('description', {
              required: 'Description is required',
              validate: (value) =>
                value.trim().length > 0 ||
                'Description cannot be only whitespace',
            })}
            error={!!errors.description}
            helperText={
              errors.description
                ? errors.description.message
                : `${description.length}/200`
            }
            inputProps={{ maxLength: 200 }}
            FormHelperTextProps={
              !errors.description && {
                style: {
                  color:
                    description.length >= 200
                      ? '#d32f2f'
                      : description.length >= 180
                        ? '#ff9800'
                        : undefined,
                },
              }
            }
          />
          <Controller
            name="video"
            control={control}
            render={({ field, fieldState }) => (
              <MuiFileInput
                {...field}
                helperText={fieldState.invalid ? 'File is invalid' : ''}
                error={fieldState.invalid}
                fullWidth
                size="small"
                variant="filled"
                required
                disabled={uploading}
                placeholder="Select video file"
                InputProps={{
                  inputProps: {
                    accept: 'video/*',
                  },
                  startAdornment: <AttachFileIcon className="mb-4" />,
                }}
                clearIconButtonProps={{
                  title: 'Remove',
                  children: (
                    <CloseIcon fontSize="small" className="text-white" />
                  ),
                }}
                sx={{
                  '& .MuiFileInput-placeholder': {
                    color: 'inherit !important',
                  },
                }}
              />
            )}
          />
          <Controller
            name="thumbnail"
            control={control}
            render={({ field, fieldState }) => {
              const previewUrl = useMemo(
                () => (field.value ? URL.createObjectURL(field.value) : null),
                [field.value]
              );
              return (
                <>
                  <MuiFileInput
                    {...field}
                    helperText={fieldState.invalid ? 'File is invalid' : ''}
                    error={fieldState.invalid}
                    fullWidth
                    size="small"
                    variant="filled"
                    required
                    disabled={uploading}
                    placeholder="Select thumbnail for your video"
                    InputProps={{
                      inputProps: {
                        accept: 'image/*',
                      },
                      startAdornment: <AttachFileIcon className="mb-4" />,
                    }}
                    clearIconButtonProps={{
                      title: 'Remove',
                      children: (
                        <CloseIcon fontSize="small" className="text-white" />
                      ),
                    }}
                    sx={{
                      '& .MuiFileInput-placeholder': {
                        color: 'inherit !important',
                      },
                    }}
                  />
                  {previewUrl && (
                    <div className="flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="Thumbnail Preview"
                        className="flex aspect-video w-full max-w-90 items-center justify-center rounded-lg bg-black object-cover text-center"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    </div>
                  )}
                </>
              );
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            color={!uploaded ? 'info' : 'success'}
            fullWidth
            className="btn transition-colors duration-300 ease-in"
          >
            {uploading && (
              <CircularProgress
                size={25}
                color="success"
                sx={{ position: 'absolute' }}
              />
            )}
            {uploading ? (
              'Uploading'
            ) : uploaded ? (
              <>
                Uploaded
                <BiHappyBeaming className="mb-1 h-6 w-6" />
              </>
            ) : (
              'Upload Video'
            )}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VideoCreate;
