import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormLabel,
  FormControl,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Avatar,
  ButtonBase,
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  forgetMe,
  getSavedUser,
  loginUser,
  refreshAccessToken,
} from '../../../store/Slices/userSlice';
import { useMaskedEmail } from '../../../hooks/useMaskedEmail';
import { toast } from 'react-toastify';
import { SigninSkeleton } from '../../../skeletons';
import { Logo } from '../../';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const redirectURL = searchParams.get('redirect');
  const [savedUser, setSavedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const submit = (formData) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmail = emailPattern.test(formData.identifier);
    dispatch(
      loginUser({
        [isEmail ? 'email' : 'username']: formData.identifier,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
    ).then((res) => {
      if (res.type === 'login/fulfilled') {
        reset();
        navigate(redirectURL || '/', { replace: true });
      } else setFocus('password');
    });
  };

  useEffect(() => {
    setShowSkeleton(true);
    dispatch(getSavedUser())
      .then((res) => {
        if (res.type === 'getSavedUser/fulfilled') {
          setSavedUser(res.payload);
        } else setFocus('identifier');
      })
      .finally(() => setShowSkeleton(false));
  }, [dispatch]);

  const handleSavedLogin = () => {
    dispatch(refreshAccessToken()).then((res) => {
      if (res.type === 'refreshToken/fulfilled') {
        toast.success('Logged in');
        navigate(redirectURL || '/', { replace: true });
      } else {
        toast.error('Failed to log in');
        setSavedUser(null);
      }
    });
  };
  const handleForgetMe = () => {
    setAnchorEl(null);
    dispatch(forgetMe()).then((res) => {
      if (res.type === 'forgetMe/fulfilled') {
        toast.success('Account has been removed');
        setSavedUser(null);
      } else {
        toast.error('Failed to remove account');
      }
    });
  };

  return (
    <Card variant="outlined">
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'flex-end',
          justifyContent: 'center',
          columnGap: '4px',
          marginBottom: '12px',
        }}
      >
        <NavLink to="/">
          <Logo className="mx-auto transition-[scale] duration-200 ease-in hover:scale-110" />
        </NavLink>
        <NavLink to="/">
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#e5e7eb' }}
          >
            MERN
            <Box
              component="span"
              sx={{
                fontSize: '1.25rem',
                lineHeight: '1.625rem',
                color: '#ff0033',
              }}
            >
              Tube
            </Box>
          </Typography>
        </NavLink>
      </Box>
      {showSkeleton ? (
        <SigninSkeleton />
      ) : (
        <>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {savedUser ? 'Welcome Back' : 'Sign in'}
          </Typography>
          {savedUser ? (
            <>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 250ms ease-in',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                {/* User Row - Click to sign in */}
                <ButtonBase
                  onClick={handleSavedLogin}
                  // disabled={loading}
                  sx={{ width: '100%', textAlign: 'inherit' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      width: '100%',
                    }}
                  >
                    <Avatar
                      src={savedUser.avatar}
                      alt={savedUser.fullName}
                      sx={{ width: 44, height: 44, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {savedUser.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {useMaskedEmail(savedUser.email)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                      }}
                      disabled={loading}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </ButtonBase>
                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleForgetMe} disabled={loading}>
                    Forget this account
                  </MenuItem>
                </Menu>
              </Box>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Link
                    onClick={() => navigate('/signup')}
                    variant="body2"
                    sx={{
                      alignSelf: 'center',
                      cursor: 'pointer',
                      color: !loading ? 'cornflowerblue' : 'dimgray',
                      pointerEvents: !loading ? 'auto' : 'none',
                    }}
                  >
                    Sign up
                  </Link>
                </span>
              </Typography>
            </>
          ) : (
            <>
              <Box
                component="form"
                onSubmit={handleSubmit(submit)}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="identifier">Username / Email</FormLabel>
                  <TextField
                    error={errors.identifier}
                    helperText={errors.identifier?.message}
                    id="identifier"
                    type="text"
                    placeholder="tylerdurden12 / your@email.com"
                    autoComplete="username email"
                    autoFocus
                    fullWidth
                    variant="outlined"
                    color={errors.identifier ? 'error' : 'primary'}
                    disabled={loading}
                    {...register('identifier', {
                      required: 'Username or Email is required',
                      pattern: {
                        value:
                          /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9_]{3,})$/,
                        message: 'Invalid username or email address',
                      },
                      maxLength: {
                        value: 100,
                        message: 'Input cannot exceed 100 characters',
                      },
                      validate: (value) => {
                        const trimmedValue = value.trim();
                        if (trimmedValue.length === 0)
                          return 'Username or Email is required';
                        setValue('identifier', trimmedValue, {
                          shouldValidate: false,
                        });
                        // Additional username-specific validation
                        if (!/@/.test(trimmedValue)) {
                          // Apply username rules if not an email
                          if (trimmedValue.length < 3)
                            return 'Username must be at least 3 characters';
                          if (trimmedValue.length > 20)
                            return 'Username cannot exceed 20 characters';
                          if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue))
                            return 'Username can only contain letters, numbers, and underscores';
                        }
                        return true;
                      },
                    })}
                  />
                </FormControl>
                <FormControl>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      component="button"
                      type="button"
                      onClick={handleClickOpen}
                      disabled={loading}
                      variant="body2"
                      sx={{
                        alignSelf: 'baseline',
                        color: 'cornflowerblue',
                        ':disabled': {
                          color: 'dimgray',
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                  <TextField
                    error={errors.password}
                    helperText={errors.password?.message}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    fullWidth
                    variant="outlined"
                    color={errors.password ? 'error' : 'primary'}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="inherit" />
                            ) : (
                              <Visibility fontSize="inherit" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Password cannot exceed 50 characters',
                      },
                      validate: (value) => {
                        const trimmedValue = value.trim();
                        if (trimmedValue.length === 0)
                          return 'Password is required';
                        setValue('password', trimmedValue, {
                          shouldValidate: false,
                        });
                        return true;
                      },
                    })}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={watch('rememberMe')}
                      {...register('rememberMe')}
                    />
                  }
                  label="Remember me"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading && (
                    <CircularProgress
                      size={24}
                      color="info"
                      sx={{ position: 'absolute' }}
                    />
                  )}
                  Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                  Don&apos;t have an account?{' '}
                  <span>
                    <Link
                      onClick={() => navigate('/signup')}
                      variant="body2"
                      sx={{
                        alignSelf: 'center',
                        cursor: 'pointer',
                        color: !loading ? 'cornflowerblue' : 'dimgray',
                        pointerEvents: !loading ? 'auto' : 'none',
                      }}
                    >
                      Sign up
                    </Link>
                  </span>
                </Typography>
              </Box>
              <ForgotPassword open={open} handleClose={handleClose} />
              <Divider>or</Divider>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  onClick={() => alert('Feature will be implemented soon')}
                  startIcon={<GoogleIcon />}
                >
                  Sign in with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  onClick={() => alert('Feature will be implemented soon')}
                  startIcon={<FacebookIcon />}
                >
                  Sign in with Facebook
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Card>
  );
}
