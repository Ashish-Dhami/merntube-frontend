import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from './';
import { useState } from 'react';
import {
  addComment,
  cleanupComments,
  getVideoComments,
} from '../store/Slices/commentSlice';
import { stringAvatar } from '../helpers/stringAvatar';
import { Avatar } from '@mui/material';

export default function NewComment({ videoId, setSortBy }) {
  const currentUser = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const submitComment = (formData) => {
    const newComment = { videoId, content: formData.content.trim() };

    if (!newComment.content) return;

    dispatch(addComment(newComment)).then(() => {
      dispatch(cleanupComments());
      dispatch(
        getVideoComments({
          videoId,
          query: { page: 1, limit: 5, sortBy: 'updatedAt' },
        })
      ).then(() => {
        setSortBy('updatedAt');
      });
    });
    reset();
    setShowBtn(false);
  };
  const [showBtn, setShowBtn] = useState(false);
  return (
    <form onSubmit={handleSubmit(submitComment)}>
      <div className="font-roboto my-5 flex items-center gap-x-3">
        <Avatar
          src={currentUser.avatar}
          {...stringAvatar(currentUser.fullName)}
          sx={{
            ...stringAvatar(currentUser.fullName).sx,
            height: '2.5rem',
            width: '2.5rem',
            flexShrink: 0,
          }}
        />
        <Input
          placeholder="Add a comment..."
          className="grow-1 rounded-none border-b border-gray-700 shadow-none focus:shadow-none focus:outline-none"
          onInput={(e) => setShowBtn(e.target.value.trim() !== '')}
          {...register('content', { required: 'Comment cannot be empty' })}
        />
        {showBtn && (
          <Button
            type="submit"
            text="Add"
            overwriteStyle={true}
            className="h-8 shrink-0 rounded-md"
          />
        )}
      </div>
    </form>
  );
}
