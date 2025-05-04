import { useState, useEffect } from 'react';
import { Loader, Input, Button } from './';
import { IoCloseOutline, CiWarning } from '../icons';
import { useDispatch } from 'react-redux';
import {
  changePassword,
  forgetMe,
  logoutUser,
} from '../store/Slices/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PasswordModal({
  isOpen,
  onClose,
  setEditable,
  resetFields,
}) {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const [animateLoading, setAnimateLoading] = useState(true);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  });

  // Prevent background scrolling
  // useEffect(() => {
  //   document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  //   return () => {
  //     document.body.style.overflow = 'auto';
  //   };
  // }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    if (currPassword === newPassword) {
      setError('New password cannot be same as current password');
      return;
    }
    dispatch(changePassword({ currPassword, newPassword })).then((res) => {
      if (res.type === 'changePassword/fulfilled') {
        toast.success(
          <div className="flex w-full items-center justify-around select-none">
            <span className="font-roboto text-sm font-medium text-[#003333]">
              SUCCESS !!
              <br /> Logging out... Pls signin with the new password
            </span>
          </div>,
          {
            theme: 'light',
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: false,
            closeButton: false,
            style: {
              width: '365px',
              backgroundColor: '#FAF9F6',
              minHeight: '55px',
            },
            onClose: () => {
              dispatch(logoutUser()).then(() => {
                dispatch(forgetMe());
                navigate('/signin');
              });
            },
          }
        );
      }
      resetFields();
      setEditable(false);
      onClose();
    });
  };

  return (
    <div className="font-roboto pointer-events-auto fixed inset-0 z-101 flex overflow-y-auto bg-black/40 py-8">
      <div
        className={`m-auto flex min-h-64 w-full max-w-md transform flex-col ${animateLoading ? 'justify-center' : 'justify-between'} rounded-xl bg-[#212121] p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {animateLoading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium text-white">
                <h2 className="mr-2 inline">Change Password</h2>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-white"
              >
                <IoCloseOutline className="text-3xl" />
              </button>
            </div>
            <form
              className="text-sm font-medium text-yellow-200"
              onSubmit={handleSubmit}
            >
              <p className="font-poppins mb-5 text-center text-red-600">
                <CiWarning className="mr-2 inline text-3xl" />
                You are about to change your password !!!
              </p>
              <div className="relative mb-4">
                <Input
                  placeholder="Current Password"
                  type="password"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 shadow-none transition duration-500 focus:shadow-none focus:outline-none"
                  required
                  minLength={8}
                  value={currPassword}
                  onChange={(e) => {
                    setError(null);
                    setCurrPassword(e.target.value);
                  }}
                />
              </div>
              <div className="relative mb-4">
                <Input
                  placeholder="New Password"
                  type="password"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 shadow-none transition duration-500 focus:shadow-none focus:outline-none"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => {
                    setError(null);
                    setNewPassword(e.target.value);
                  }}
                />
              </div>
              <div className={`relative ${error ? '' : 'mb-10'}`}>
                <Input
                  placeholder="Confirm New Password"
                  type="password"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 shadow-none transition duration-500 focus:shadow-none focus:outline-none"
                  required
                  minLength={8}
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setError(null);
                    setConfirmNewPassword(e.target.value);
                  }}
                />
              </div>
              {error && (
                <p className="mb-3 p-1 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
              <div className="text-center">
                <Button
                  type="submit"
                  text="Update"
                  className="btn-sm rounded-full bg-yellow-200 text-slate-900"
                  overwriteStyle={true}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
