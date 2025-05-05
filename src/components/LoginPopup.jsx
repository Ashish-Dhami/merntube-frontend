import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Typography,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#ffffff',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  padding: theme.spacing(2),
  textAlign: 'center',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const Backdrop = styled(Box)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: -1,
}));

const LoginPopup = () => {
  const { pathname } = useLocation();

  return (
    <Modal
      open={true}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={true}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            px: 2,
          }}
        >
          <StyledCard>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                color="error"
                sx={{ fontWeight: 'medium' }}
              >
                <ErrorOutlineIcon
                  fontSize="inherit"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
                Not Authorized
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please sign in to continue
              </Typography>
              <Link to={`/signin?redirect=${pathname}`}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: '1.125rem',
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/">
                <Button
                  color="secondary"
                  fullWidth
                  sx={{
                    mt: 2,
                    textTransform: 'none',
                  }}
                >
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </StyledCard>
        </Box>
      </Fade>
    </Modal>
  );
};

export default LoginPopup;
