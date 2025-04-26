import { useState, useEffect } from 'react';
import { IoCloseOutline } from '../icons';
import { Button } from './';
import { TextField, Slide } from '@mui/material';
import { GlowingEffect } from './ui/glowing-effect';
import { MuiFileInput } from 'mui-file-input';
import { useDispatch, useSelector } from 'react-redux';
import { resetStateOnUnmount, updateVideo } from '../store/Slices/videoSlice';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

const VideoEditModal = ({ isOpen, onClose, video }) => {
  // Initialize state with the video's current values
  const [title, setTitle] = useState(video?.title);
  const [description, setDescription] = useState(video?.description);
  const [thumbnail, setThumbnail] = useState(null); // Could be a URL or file
  const [preview, setPreview] = useState(video?.thumbnail); // URL for display
  const [modalAppear, setModalAppear] = useState(true);
  const [error, setError] = useState(null);
  const uploading = useSelector((state) => state.video.uploading);
  const dispatch = useDispatch();

  useEffect(() => {
    setModalAppear(isOpen);
    return () => {
      dispatch(resetStateOnUnmount());
    };
  }, [isOpen]);

  // Handle thumbnail file selection and generate a preview
  const handleThumbnailChange = (imageFile) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview to data URL
        setError(null);
      };
      reader.readAsDataURL(imageFile);
      setThumbnail(imageFile); // Store the file object
    }
  };

  // Handle clearing the thumbnail
  const handleClearThumbnail = () => {
    setThumbnail(null); // Clear the thumbnail data
    setPreview(video?.thumbnail); // Clear the preview
  };

  // Handle form submission
  const update = (e) => {
    e.preventDefault();
    if (
      [title, description].some((value) => {
        if (value.trim().length === 0) {
          setError('Video attributes cannot be only whitespace');
          return true;
        }
        return false;
      })
    ) {
      return;
    }
    const isTitleSame = title.trim() === video.title.trim();
    const isDescriptionSame = description.trim() === video.description.trim();
    const isThumbnailSame = preview.trim() === video.thumbnail.trim();
    if (isTitleSame && isDescriptionSame && isThumbnailSame) {
      setError('Modify atleast one field !!');
      return;
    }
    dispatch(
      updateVideo({
        videoId: video.id,
        data: {
          title: isTitleSame ? null : title,
          description: isDescriptionSame ? null : description,
          thumbnail: isThumbnailSame ? null : thumbnail,
        },
      })
    )
      .then((res) => {
        if (res.type === 'updateVideo/fulfilled') setModalAppear(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="font-roboto pointer-events-auto fixed inset-0 z-101 flex overflow-y-auto bg-black/40 py-8 backdrop-blur-xs">
      <Slide
        in={modalAppear}
        mountOnEnter
        unmountOnExit
        timeout={500}
        onExited={onClose}
      >
        <div className="relative m-auto w-full max-w-md rounded-lg bg-[#101316] p-6 shadow-lg">
          <GlowingEffect
            borderWidth={2}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          {/* Modal Header */}
          {error && (
            <p className="absolute top-4 right-0 left-0 text-center text-xs font-medium text-[#d32f2f]">
              {error}
            </p>
          )}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Video</h2>

            <Button
              text={<IoCloseOutline className="text-3xl" />}
              clickHandler={() => !uploading && setModalAppear(false)}
              overwriteStyle
              className="cursor-pointer border-none !bg-transparent p-1 text-gray-400 shadow-none transition-colors hover:text-white"
              disabled={uploading}
            />
          </div>

          {/* Form */}
          <form onSubmit={update} className="font-medium">
            {/* Title Field */}
            <div className="mb-4">
              <TextField
                required
                disabled={uploading}
                error={error}
                fullWidth
                label="Title"
                value={title}
                size="small"
                variant="filled"
                onChange={(e) => {
                  setError(null);
                  setTitle(e.target.value);
                }}
                helperText={`${title.length}/50`}
                inputProps={{ maxLength: 50 }}
                FormHelperTextProps={{
                  style: {
                    color:
                      title.length >= 50
                        ? '#d32f2f'
                        : title.length >= 30
                          ? '#ff9800'
                          : undefined,
                  },
                }}
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <TextField
                required
                disabled={uploading}
                error={error}
                fullWidth
                label="Description"
                multiline
                inputProps={{ maxLength: 200 }}
                rows={4}
                value={description}
                onChange={(e) => {
                  setError(null);
                  setDescription(e.target.value);
                }}
                variant="filled"
                size="small"
                helperText={`${description.length}/200`}
                FormHelperTextProps={{
                  style: {
                    color:
                      description.length >= 200
                        ? '#d32f2f'
                        : description.length >= 180
                          ? '#ff9800'
                          : undefined,
                  },
                }}
              />
            </div>

            {/* Thumbnail Field with Preview */}
            <div className="mb-6">
              <MuiFileInput
                error={error}
                value={thumbnail}
                onChange={handleThumbnailChange}
                size="small"
                fullWidth
                disabled={uploading}
                variant="filled"
                placeholder="Insert new thumbnail"
                InputProps={{
                  inputProps: {
                    accept: '.png, .jpg',
                  },
                  startAdornment: <AttachFileIcon className="mb-4" />,
                }}
                clearIconButtonProps={{
                  title: 'Remove',
                  children: (
                    <CloseIcon
                      fontSize="small"
                      className="text-white"
                      onClick={handleClearThumbnail}
                    />
                  ),
                }}
                sx={{
                  '& .MuiFileInput-placeholder': {
                    color: 'inherit !important',
                  },
                }}
              />
              {preview && (
                <div className="mt-2 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Thumbnail Preview"
                    className="flex aspect-video w-full max-w-61 items-center justify-center rounded-lg bg-black object-cover text-center"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button
                text={
                  <>
                    <CloseIcon fontSize="small" className="mr-1" />
                    Cancel
                  </>
                }
                clickHandler={() => !uploading && setModalAppear(false)}
                aceternity={true}
                className="mr-2"
                disabled={uploading}
              />
              <Button
                text={
                  uploading ? (
                    <CircularProgress size={20} color="info" />
                  ) : (
                    <>
                      <SaveIcon fontSize="small" className="mr-1" />
                      Save
                    </>
                  )
                }
                type="submit"
                aceternity={true}
                disabled={uploading}
              />
            </div>
          </form>
        </div>
      </Slide>
    </div>
  );
};

export default VideoEditModal;
