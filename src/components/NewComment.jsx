import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from './';
import { useState } from 'react';
import {
  addComment,
  cleanupComments,
  getVideoComments,
} from '../store/Slices/commentSlice';

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
        <img
          src={currentUser.avatar}
          alt={currentUser.username.charAt(0).toUpperCase()}
          className="h-10 w-10 shrink-0 rounded-full object-cover text-center leading-10 outline-1 outline-gray-500"
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
