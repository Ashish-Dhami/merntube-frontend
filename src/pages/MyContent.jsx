import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import SortBy from '../enums/SortBy';
import { makeVideosNull } from '../store/Slices/videoSlice';
import { resetTweets } from '../store/Slices/tweetSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function MyContent() {
  useDocumentTitle(`My Content - MERNTube`);
  const totalVideos = useSelector((state) => state.video.totalVideos);
  const totalTweets = useSelector((state) => state.tweet.totalTweets);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(makeVideosNull());
      dispatch(resetTweets());
    };
  }, [dispatch]);

  return (
    <>
      <div
        role="tablist"
        className="tabs tabs-box sticky -top-2 z-50 mb-2 w-full"
      >
        <NavLink
          role="tab"
          to={'videos'}
          className={({ isActive }) =>
            `tab grow font-medium ${isActive && 'tab-active'}`
          }
        >
          My Videos ({totalVideos})
        </NavLink>
        <NavLink
          role="tab"
          to={'tweets'}
          className={({ isActive }) =>
            `tab grow font-medium ${isActive && 'tab-active'}`
          }
        >
          My Tweets ({totalTweets})
        </NavLink>
      </div>
      <Outlet
        context={{
          sortBy: SortBy.LATEST,
        }}
      />
    </>
  );
}
