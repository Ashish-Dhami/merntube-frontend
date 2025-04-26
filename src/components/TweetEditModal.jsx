import { useState, useEffect } from 'react';
import { IoCloseOutline } from '../icons';
import { Button } from './';
import { TextField, Slide } from '@mui/material';
import { GlowingEffect } from './ui/glowing-effect';
import { useDispatch, useSelector } from 'react-redux';
import { updateTweet } from '../store/Slices/tweetSlice';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

const TweetEditModal = ({ isOpen, onClose, tweet }) => {
  // Initialize state with the tweet's current values
  const [content, setContent] = useState(tweet?.content);
  const [modalAppear, setModalAppear] = useState(true);
  const [error, setError] = useState(null);
  const loading = useSelector((state) => state.tweet.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    setModalAppear(isOpen);
  }, [isOpen]);

  // Handle form submission
  const update = (e) => {
    e.preventDefault();
    if (
      [content].some((value) => {
        if (value.trim().length === 0) {
          setError('Tweet cannot be only whitespace');
          return true;
        }
        return false;
      })
    ) {
      return;
    }
    const isContentSame = content.trim() === tweet.content.trim();
    if (isContentSame) {
      setError('Modify atleast one field !!');
      return;
    }
    dispatch(
      updateTweet({
        tweetId: tweet.id,
        newContent: isContentSame ? null : content,
      })
    )
      .then((res) => {
        if (res.type === 'updateTweet/fulfilled') setModalAppear(false);
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
            <h2 className="text-xl font-bold">Edit Tweet</h2>

            <Button
              text={<IoCloseOutline className="text-3xl" />}
              clickHandler={() => !loading && setModalAppear(false)}
              overwriteStyle
              className="cursor-pointer border-none !bg-transparent p-1 text-gray-400 shadow-none transition-colors hover:text-white"
              disabled={loading}
            />
          </div>

          {/* Form */}
          <form onSubmit={update} className="font-medium">
            {/* Content Field */}
            <div className="mb-4">
              <TextField
                required
                disabled={loading}
                error={error}
                fullWidth
                label="Tweet"
                multiline
                inputProps={{ maxLength: 500 }}
                rows={4}
                value={content}
                onChange={(e) => {
                  setError(null);
                  setContent(e.target.value);
                }}
                variant="filled"
                size="small"
                helperText={`${content.length}/500`}
                FormHelperTextProps={{
                  style: {
                    color:
                      content.length >= 500
                        ? '#d32f2f'
                        : content.length >= 480
                          ? '#ff9800'
                          : undefined,
                  },
                }}
              />
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
                clickHandler={() => !loading && setModalAppear(false)}
                aceternity={true}
                className="mr-2"
                disabled={loading}
              />
              <Button
                text={
                  loading ? (
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
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </Slide>
    </div>
  );
};

export default TweetEditModal;
