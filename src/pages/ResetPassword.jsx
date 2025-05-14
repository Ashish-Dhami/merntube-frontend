import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container as ContainerMUI,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Collapse,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Container, BackGround } from '../components';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { resetPassword, verifyResetToken } from '../store/Slices/userSlice';

export default function ResetPassword() {
  const { token } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({
    1: false,
    2: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    const verifyToken = () => {
      if (!token) {
        setError('Invalid or missing token');
        setLoading(false);
        return;
      }
      dispatch(verifyResetToken(token))
        .then((res) => {
          res.type === 'verifyResetToken/fulfilled'
            ? setIsTokenValid(true)
            : setError('Invalid or expired token');
        })
        .finally(() => setLoading(false));
    };

    verifyToken();
  }, [token]);

  const changePassword = ({ newPassword, confirmNewPassword }) => {
    setError('');
    setLoading(true);
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    dispatch(resetPassword({ token, newPassword }))
      .then((res) => {
        if (res.type === 'resetPassword/fulfilled') {
          reset();
          setSuccess('Password reset successful');
          setTimeout(() => navigate('/signin'), 2000);
        } else {
          setError(res.payload || 'Failed to reset password');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <BackGround />
      <ContainerMUI
        maxWidth="sm"
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 1,
          mt: 8,
          boxShadow: 4,
          overflowY: 'auto',
        }}
      >
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {loading ? 'Loading...' : 'Reset Your Password'}
          </Typography>
          <Collapse in={error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>
          <Collapse in={success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          </Collapse>
          {isTokenValid && !success && (
            <form onSubmit={handleSubmit(changePassword)}>
              <TextField
                label="Enter new password"
                fullWidth
                margin="normal"
                error={errors.newPassword}
                helperText={errors.newPassword?.message}
                type={showPassword[1] ? 'text' : 'password'}
                color={errors.newPassword ? 'error' : 'primary'}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, 1: !prev[1] }))
                        }
                        edge="end"
                        size="small"
                      >
                        {showPassword[1] ? (
                          <VisibilityOff fontSize="inherit" />
                        ) : (
                          <Visibility fontSize="inherit" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  style: {
                    position: 'initial',
                  },
                }}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Password cannot exceed 50 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    message:
                      'Password must include uppercase, lowercase, number, and special character',
                  },
                  validate: (value) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue.length === 0)
                      return 'Password is required';
                    setValue('newPassword', trimmedValue, {
                      shouldValidate: false,
                    });
                    return true;
                  },
                })}
              />
              <TextField
                label="Confirm new password"
                fullWidth
                margin="normal"
                error={errors.confirmNewPassword}
                helperText={errors.confirmNewPassword?.message}
                type={showPassword[2] ? 'text' : 'password'}
                color={errors.confirmNewPassword ? 'error' : 'primary'}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, 2: !prev[2] }))
                        }
                        edge="end"
                        size="small"
                      >
                        {showPassword[2] ? (
                          <VisibilityOff fontSize="inherit" />
                        ) : (
                          <Visibility fontSize="inherit" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  style: {
                    position: 'initial',
                  },
                }}
                {...register('confirmNewPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Password cannot exceed 50 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    message:
                      'Password must include uppercase, lowercase, number, and special character',
                  },
                  validate: (value) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue.length === 0)
                      return 'Password is required';
                    setValue('confirmNewPassword', trimmedValue, {
                      shouldValidate: false,
                    });
                    return true;
                  },
                })}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 3 }}
              >
                Reset Password
              </Button>
              <Button
                color="secondary"
                fullWidth
                onClick={() => navigate('/signin')}
                sx={{
                  my: 2,
                  textTransform: 'none',
                }}
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </Box>
      </ContainerMUI>
    </Container>
  );
}
