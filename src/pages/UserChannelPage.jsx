import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Button, Loader } from '../components';
import { getUserChannelProfile } from '../store/Slices/userSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { toggleSubscription } from '../store/Slices/subscriptionSlice';
import { ErrorPage } from './';
import { createPortal } from 'react-dom';
import { formatNumber } from '../helpers/formatNumber';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SortBy from '../enums/SortBy';
import { makeVideosNull } from '../store/Slices/videoSlice';
import { resetTweets } from '../store/Slices/tweetSlice';
import { stringAvatar } from '../helpers/stringAvatar';

export default function UserChannelPage() {
  const { username: routedUname } = useParams();
  const username = routedUname.substring(1).trim();

  const userProfileData = useSelector((state) => state.user.userProfileData);
  useDocumentTitle(`${userProfileData?.fullName || username} - MERNTube`);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [allowSearch, setAllowSearch] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showErrorPage, setShowErrorPage] = useState(false);

  const [localIsSubscribed, setLocalIsSubscribed] = useState();
  const [localSubscribersCount, setLocalSubscribersCount] = useState();

  const [sortBy, setSortBy] = useState(SortBy.LATEST);

  useEffect(() => {
    setShowErrorPage(false);
    setLoading(true);
    dispatch(getUserChannelProfile(username))
      .then((res) => {
        if (res.type === 'getUserChannelProfile/rejected') {
          setShowErrorPage(true);
        } else {
          setLocalIsSubscribed(res?.payload?.isSubscribed);
          setLocalSubscribersCount(res?.payload?.subscribers);
        }
      })
      .finally(() => setLoading(false));

    document.addEventListener('mousedown', handleWrapperClick);
    return () => {
      dispatch(makeVideosNull());
      dispatch(resetTweets());
      document.removeEventListener('mousedown', handleWrapperClick);
    };
  }, [username]);

  let timeoutId = null;

  const handleWrapperClick = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setShowSearchForm(false);
    }, 200);
  };

  const handleSpanClick = (e) => {
    e.stopPropagation();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const navItems = [
    { header: 'Videos', navLink: `videos` },
    { header: 'Playlists', navLink: `playlists` },
    { header: 'Tweets', navLink: `tweets` },
  ];

  const toggleSubscribe = () => {
    dispatch(toggleSubscription(userProfileData?._id))
      .then((res) => {
        if (res.type === 'toggleSubscription/fulfilled') {
          setLocalIsSubscribed((prev) => !prev);
          setLocalSubscribersCount((prev) =>
            localIsSubscribed ? prev - 1 : prev + 1
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) return <Loader />;

  return showErrorPage ? (
    createPortal(<ErrorPage />, document.body)
  ) : (
    <>
      <div id="channel-info" className="font-roboto flex gap-x-5">
        <Avatar
          src={userProfileData?.avatar}
          {...stringAvatar(userProfileData?.fullName)}
          sx={{
            ...stringAvatar(userProfileData?.fullName).sx,
            height: '10rem',
            width: '10rem',
            fontSize: '3rem',
            border: '1px solid #D4A017',
          }}
        />
        <div className="flex grow flex-col items-start gap-y-1">
          <p className="text-4xl font-bold">{userProfileData?.fullName}</p>
          <p>
            @
            <span className="mr-1 font-medium">
              {userProfileData?.username}
            </span>
            <span className="mr-1 font-extrabold">&#xB7;</span>
            <span className="mr-1 text-sm text-[#aaa]">
              {formatNumber(localSubscribersCount)} subscribers
            </span>
            <span className="mr-1 font-extrabold">&#xB7;</span>
            <span className="text-sm text-[#aaa]">
              {formatNumber(userProfileData?.videosUploaded)}{' '}
              {userProfileData?.videosUploaded > 1 ? 'videos' : 'video'}
            </span>
          </p>
          <Button
            text={localIsSubscribed ? 'Subscribed' : 'Subscribe'}
            className={`mt-auto mb-5 h-9 rounded-3xl ${localIsSubscribed ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-100 hover:bg-gray-400'} text-black`}
            clickHandler={toggleSubscribe}
            overwriteStyle={true}
          />
        </div>
      </div>
      <nav className="glass text-info-content sticky -top-2 z-50 my-3 rounded-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 justify-between">
            <div className="flex">
              <div className="flex space-x-8">
                {navItems.map((navItem, i) => (
                  <NavLink
                    key={i}
                    to={navItem.navLink}
                    className={({ isActive }) =>
                      `inline-flex items-center border-b-2 px-1 pt-1 font-medium transition duration-150 ease-in-out hover:border-red-600 ${isActive ? 'border-white' : 'text-neutral-content border-transparent text-sm'}`
                    }
                  >
                    {navItem.header}
                  </NavLink>
                ))}
                {allowSearch && (
                  <>
                    <span
                      className="inline-flex cursor-pointer items-center gap-x-3 border-b-2 border-transparent px-2 pt-1 text-xl"
                      onMouseDown={handleSpanClick}
                    >
                      <SearchOutlinedIcon
                        onClick={() => setShowSearchForm((prev) => !prev)}
                      />
                      {showSearchForm && (
                        <Input
                          placeholder="Search"
                          inputProps={{
                            autoFocus: true,
                            className: '!max-w-44 !py-1',
                            maxLength: '50',
                            onKeyUp: (e) => {
                              if (e.key === 'Enter')
                                setSearchTerm(e.target.value.trim());
                            },
                          }}
                        />
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Stack
        direction={{ xs: 'column', break1: 'row' }}
        spacing={1}
        useFlexGap
        sx={{
          flexWrap: 'wrap',
          rowGap: '5px',
        }}
        className="mx-auto mb-2 max-w-7xl px-2 sm:px-4 lg:px-6"
      >
        <Chip
          label={SortBy.LATEST.label}
          clickable
          onClick={() => setSortBy(SortBy.LATEST)}
          className={sortBy === SortBy.LATEST ? 'MuiChip-active' : ''}
        />
        <Chip
          label={SortBy.POPULAR.label}
          clickable
          onClick={() => setSortBy(SortBy.POPULAR)}
          className={sortBy === SortBy.POPULAR ? 'MuiChip-active' : ''}
        />
        <Chip
          label={SortBy.OLDEST.label}
          clickable
          onClick={() => setSortBy(SortBy.OLDEST)}
          className={sortBy === SortBy.OLDEST ? 'MuiChip-active' : ''}
        />
        {searchTerm && (
          <>
            <Divider
              orientation="vertical"
              variant="middle"
              className="hidden sm:block"
              flexItem
              sx={{ borderColor: 'white', margin: '0 20px !important' }}
            />
            <Chip
              label={searchTerm}
              color="primary"
              deleteIcon={<DeleteIcon />}
              onDelete={() => setSearchTerm('')}
              className="MuiChip-ignore"
            />
          </>
        )}
      </Stack>
      <Outlet
        context={{
          setAllowSearch,
          setShowSearchForm,
          searchTerm,
          sortBy,
        }}
      />
    </>
  );
}
