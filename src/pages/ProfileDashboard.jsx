import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelStats } from '../store/Slices/dashboardSlice';
import { Tooltip } from 'react-tooltip';
import {
  PiYoutubeLogoDuotone,
  IoPeopleOutline,
  RiImageEditLine,
  MdLockReset,
} from '../icons';
import { formatNumber } from '../helpers/formatNumber';
import { Input, Button, PasswordModal } from '../components';
import {
  updateAccountDetails,
  updateUserAvatar,
} from '../store/Slices/userSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Avatar } from '@mui/material';
import { stringAvatar } from '../helpers/stringAvatar';

export default function ProfileDashboard() {
  useDocumentTitle(`My Account - MERNTube`);
  const dispatch = useDispatch();

  const channelStats = useSelector((state) => state.dashboard.channelStats);
  const userData = useSelector((state) => state.user.userData);

  const [editable, setEditable] = useState(false);
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [email, setEmail] = useState(userData?.email || '');

  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getChannelStats());
  }, [dispatch]);

  const handleIconClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateUserAvatar(file));
      setEditable(false);
    }
  };

  const handleUpdate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editable) {
      if (!fullName.trim().length) {
        setError({ fullName: 'Full Name is required !' });
        return;
      }
      if (!email.trim().length) {
        setError({ email: 'Email is required !' });
        return;
      }
      if (!emailRegex.test(email)) {
        setError({ email: 'Invalid email !' });
        return;
      }
      dispatch(updateAccountDetails({ fullName, email })).then((res) => {
        if (res.error) resetFields();
      });
    }
    setEditable((prev) => !prev);
  };

  const resetFields = () => {
    setFullName(userData?.fullName || '');
    setEmail(userData?.email || '');
    setError(null);
  };

  return (
    <div className="font-roboto flex">
      <div className="flex-1 p-2">
        {/* Profile Section */}
        <div className="flex min-h-[85vh] flex-col rounded-lg bg-[#100c08] p-6 shadow-lg shadow-neutral-300/50">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="glow-text text-4xl font-bold text-white">
                {userData?.fullName}
              </h2>
              <p>{userData?.email}</p>
            </div>
            <div>
              {editable && (
                <Button
                  text="Cancel"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                  overwriteStyle={true}
                  clickHandler={() => {
                    setEditable(false);
                    resetFields();
                  }}
                />
              )}
              <Button
                text={editable ? 'Save' : 'Edit'}
                className="ml-3 rounded-lg bg-blue-500 px-4 py-2 text-white"
                overwriteStyle={true}
                clickHandler={handleUpdate}
              />
            </div>
          </div>
          <div className="flex grow items-center space-x-8">
            {/* Left Column */}
            <div className="flex-1">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <Avatar
                    src={userData?.avatar}
                    {...stringAvatar(userData?.fullName)}
                    sx={{
                      ...stringAvatar(userData?.fullName).sx,
                      height: '9rem',
                      width: '9rem',
                      fontSize: '2.25rem',
                      border: '1px solid #D4A017',
                      ':hover': {
                        borderColor: 'white',
                      },
                    }}
                  />
                  <RiImageEditLine
                    data-tooltip-id="change-avatar"
                    data-tooltip-content="Change Avatar"
                    data-tooltip-place="bottom"
                    className={`absolute right-0 bottom-0 ${editable ? 'scale-100 opacity-100 shadow-xl shadow-cyan-500/50' : 'pointer-events-none scale-0 opacity-0'} cursor-pointer text-2xl text-yellow-200 transition-opacity duration-500 hover:scale-105 hover:text-white`}
                    onClick={handleIconClick}
                  />
                  <Tooltip id="change-avatar" />
                  <Input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="mb-1 min-h-24">
                <Input
                  placeholder="Your Full Name"
                  label="Full Name"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 shadow-none transition duration-500 focus:shadow-none focus:outline-none disabled:bg-transparent"
                  value={fullName}
                  onChange={(e) => {
                    if (!editable) return;
                    setError((err) => ({ ...err, fullName: null }));
                    setFullName(e.target.value);
                  }}
                  disabled={!editable}
                />
                {error?.fullName && (
                  <p className="p-1 text-sm font-medium text-red-600">
                    {error?.fullName}
                  </p>
                )}
              </div>
              <div className="mb-1 min-h-24">
                <Input
                  placeholder="Your Email"
                  label="Email"
                  type="email"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 shadow-none transition duration-500 focus:shadow-none focus:outline-none disabled:bg-transparent"
                  value={email}
                  onChange={(e) => {
                    if (!editable) return;
                    setError((err) => ({ ...err, email: null }));
                    setEmail(e.target.value);
                  }}
                  disabled={!editable}
                />
                {error?.email && (
                  <p className="p-1 text-sm font-medium text-red-600">
                    {error?.email}
                  </p>
                )}
              </div>
              <div className="relative mb-4">
                <Input
                  placeholder="Password"
                  label="Password"
                  className="w-full rounded-none border-b border-gray-700 bg-transparent p-1 text-lg shadow-none transition duration-500 focus:shadow-none focus:outline-none disabled:bg-transparent"
                  value="********"
                  disabled={!editable}
                />
                <MdLockReset
                  data-tooltip-id="change-pswd"
                  data-tooltip-content="Change Password"
                  data-tooltip-variant="warning"
                  className={`absolute right-5 bottom-3 ${editable ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'} cursor-pointer text-3xl text-yellow-200 transition-opacity duration-500 hover:scale-105 hover:text-white`}
                  onClick={() => setIsModalOpen(true)}
                />
                <Tooltip
                  id="change-pswd"
                  className="font-medium !text-slate-900"
                />
              </div>
            </div>
            {/* Right Column */}
            <div>
              <div className="stats stats-vertical shadow-lg shadow-cyan-500/50">
                <div className="stat">
                  <div className="stat-figure">
                    <IoPeopleOutline className="h-8 w-8 stroke-current text-red-500" />
                  </div>
                  <div className="stat-title">Total Subscribers</div>
                  <div className="stat-value text-red-500">
                    {formatNumber(channelStats?.totalSubscribers)}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <PiYoutubeLogoDuotone className="h-8 w-8 stroke-current" />
                  </div>
                  <div className="stat-title">Total Videos</div>
                  <div className="stat-value text-primary">
                    {formatNumber(channelStats?.totalVideos)}
                  </div>
                  <div className="stat-desc">Videos uploaded by me</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-8 w-8 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div className="stat-title">Video Views</div>
                  <div className="stat-value text-secondary">
                    {formatNumber(channelStats?.totalVideoViews)}
                  </div>
                  <div className="stat-desc">
                    Combined views on all of my videos
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-figure">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-8 w-8 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="stat-title">Total Likes</div>
                  <div className="stat-value">
                    {formatNumber(channelStats?.totalLikes)}
                  </div>
                  <div className="stat-desc">
                    Total likes on my videos, comments, tweets
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setEditable={setEditable}
        resetFields={resetFields}
      />
    </div>
  );
}
