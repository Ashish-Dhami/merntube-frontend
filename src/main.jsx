import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Layout from './Layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/ui/theme';
import {
  HomePage,
  UserChannelPage,
  VideoPage,
  LikedVideosPaginated,
  History,
  MyContent,
  ErrorPage,
  ProfileDashboard,
  VideoCreate,
  TweetCreate,
} from './pages';
import {
  Login,
  Signup,
  OnPageRefresh,
  AuthChecker,
  ChannelVideos,
  ChannelPlaylists,
  ChannelTweets,
} from './components';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'watch/:videoId',
        element: (
          <AuthChecker>
            <VideoPage />
          </AuthChecker>
        ),
      },
      {
        path: 'liked-videos',
        element: (
          <AuthChecker>
            <LikedVideosPaginated />
          </AuthChecker>
        ),
      },
      {
        path: 'history',
        element: (
          <AuthChecker>
            <History />
          </AuthChecker>
        ),
      },
      {
        path: 'my-content',
        element: (
          <AuthChecker>
            <MyContent />
          </AuthChecker>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="videos" replace />,
          },
          {
            path: 'videos',
            element: <ChannelVideos current />,
          },
          {
            path: 'tweets',
            element: <ChannelTweets current />,
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <AuthChecker>
            <ProfileDashboard />
          </AuthChecker>
        ),
      },
      {
        path: 'videos/new',
        element: (
          <AuthChecker>
            <VideoCreate />
          </AuthChecker>
        ),
      },
      {
        path: 'playlists/new',
        element: <AuthChecker>{/* <PlaylistCreate /> */}</AuthChecker>,
      },
      {
        path: 'tweets/new',
        element: (
          <AuthChecker>
            <TweetCreate />
          </AuthChecker>
        ),
      },
      {
        path: ':username',
        element: (
          <AuthChecker>
            <UserChannelPage />
          </AuthChecker>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="videos" replace />,
          },
          {
            path: 'videos',
            element: <ChannelVideos />,
          },
          {
            path: 'playlists',
            element: <ChannelPlaylists />,
          },
          {
            path: 'tweets',
            element: <ChannelTweets />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <OnPageRefresh>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </OnPageRefresh>
    <ToastContainer
      autoClose={1500}
      hideProgressBar
      stacked
      theme={'dark'}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
    />
  </Provider>
);
