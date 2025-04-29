import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/Slices/userSlice';

function CustomPopoverContent({ userData, onSignOut, handleClose }) {
  const navigate = useNavigate();

  return (
    <Stack
      direction="column"
      sx={{ bgcolor: 'background.paper', borderRadius: 1.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mx: 2, my: 1 }}>
        <Avatar src={userData.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {userData.fullName}
          </Typography>
          <Typography variant="caption">{userData.email}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: '5px 7px',
        }}
      >
        <Tooltip title="My Account">
          <IconButton
            color="info"
            onClick={() => {
              navigate('/my-account');
              handleClose();
            }}
            sx={{ '&:hover': { color: 'inherit' }, fontSize: 28, p: 0.5 }}
          >
            <AccountCircleIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Button
          variant="outlined"
          size="small"
          onClick={onSignOut}
          startIcon={<LogoutIcon />}
          sx={{ fontWeight: 'normal', textTransform: 'none' }}
        >
          Sign Out
        </Button>
      </Box>
    </Stack>
  );
}

function AccountMenu() {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <Tooltip title={userData.fullName || ''}>
        <IconButton size="small" onClick={handleOpen}>
          <Avatar
            src={userData.avatar}
            alt={userData.fullName}
            sx={{ width: 33, height: 33 }}
          />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: '14px',
              width: '10px',
              height: '10px',
              backgroundColor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
            filter: 'drop-shadow(rgba(255, 255, 255, 0.3) 0px 2px 4px)',
            mt: 1,
            overflow: 'visible',
            borderRadius: 1.5,
          },
        }}
      >
        <CustomPopoverContent
          userData={userData}
          onSignOut={handleSignOut}
          handleClose={handleClose}
        />
      </Popover>
    </>
  );
}

export default AccountMenu;
