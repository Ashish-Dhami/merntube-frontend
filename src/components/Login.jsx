import { Container, BackGround } from './';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SignInSide from './sign-in-side/SignInSide';
import { Backdrop, LinearProgress } from '@mui/material';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle(`Sign in - MERNTube`);
  const navigate = useNavigate();
  const { loading, authStatus } = useSelector((state) => state.user);

  useEffect(() => {
    if (authStatus) {
      toast.info('User is already logged in');
      navigate('/');
    }
  }, []);

  return (
    <Container>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      />
      {loading && (
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
      <BackGround />
      <SignInSide />
    </Container>
  );
}
