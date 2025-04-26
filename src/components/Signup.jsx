'use client';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Container, BackGround, Logo } from './';
import { FileUpload } from './ui/file-upload';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/Slices/userSlice';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinearProgress, CircularProgress } from '@mui/material';

export default function Signup() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: null,
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const { loading } = useSelector((state) => state.user);
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const signup = (formData) => {
    const fullName = capitalizeFirstLetter(formData.firstname)
      .concat(` ${capitalizeFirstLetter(formData.lastname)}`)
      .trim();

    dispatch(registerUser({ ...formData, fullName }))
      .then((res) => {
        console.log(res);

        if (res.type === 'register/fulfilled') {
          reset();
          setFiles([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(
        () => (timeoutRef.current = setTimeout(() => navigate('/login'), 2000))
      );
  };

  const validateAvatar = (file) => {
    if (!file) return 'Avatar is required';
    return ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      ? true
      : 'Only JPEG, PNG, or GIF images are allowed';
  };

  const handleFileChange = async (files) => {
    const file = files[0] || null;
    setValue('avatar', file, { shouldValidate: true }); // Update form state
    await trigger('avatar'); // Trigger validation
  };

  register('avatar', {
    required: 'Avatar is required',
    validate: validateAvatar,
  });

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const [files, setFiles] = useState([]);

  return (
    <Container>
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
      <div className="relative flex flex-1 overflow-y-auto py-8">
        <div className="shadow-input m-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8">
          <Logo className="mx-auto h-12 w-12" />
          <h2 className="font-roboto mt-2 text-2xl font-bold text-neutral-200">
            Welcome to MERN
            <span className="font-roboto text-xl leading-6.5 text-[#ff0033]">
              Tube
            </span>
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300">
            Create an account for yourself and BINGE videos all night.
          </p>
          <form className="my-8" onSubmit={handleSubmit(signup)}>
            <div
              className={`mx-auto mb-4 w-full max-w-4xl rounded-lg border border-dashed ${errors?.avatar ? 'border-red-500' : 'border-neutral-800'} bg-black`}
            >
              <FileUpload
                files={files}
                setFiles={setFiles}
                label="Avatar"
                onChange={handleFileChange}
                validate={validateAvatar} // Pass validation for immediate feedback
              />
              {errors.avatar && (
                <ErrorMessage
                  message={errors.avatar.message}
                  className="mb-1.5 block text-center"
                />
              )}
            </div>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  placeholder="Tyler"
                  type="text"
                  disabled={loading}
                  {...register('firstname', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'First name cannot exceed 50 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: 'First name can only contain letters',
                    },
                    validate: (value) => {
                      const trimmedValue = value.trim();
                      if (trimmedValue.length === 0)
                        return 'First name is required';
                      setValue('firstname', trimmedValue, {
                        shouldValidate: false,
                      });
                      return true;
                    },
                  })}
                />
                {errors.firstname && (
                  <ErrorMessage message={errors.firstname.message} />
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  placeholder="Durden"
                  type="text"
                  disabled={loading}
                  {...register('lastname', {
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Last name cannot exceed 50 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z]*$/,
                      message: 'Last name can only contain letters',
                    },
                    validate: (value) => {
                      const trimmedValue = value ? value.trim() : '';
                      if (trimmedValue.length > 0) {
                        setValue('lastname', trimmedValue, {
                          shouldValidate: false,
                        });
                      }
                      return true;
                    },
                  })}
                />
                {errors.lastname && (
                  <ErrorMessage message={errors.lastname.message} />
                )}
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="projectmayhem@fc.com"
                type="email"
                disabled={loading}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Email cannot exceed 100 characters',
                  },
                  validate: (value) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue.length === 0) return 'Email is required';
                    setValue('email', trimmedValue, {
                      shouldValidate: false,
                    });
                    return true;
                  },
                })}
              />
              {errors.email && <ErrorMessage message={errors.email.message} />}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="tylerdurden12"
                type="text"
                disabled={loading}
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username cannot exceed 20 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      'Username can only contain letters, numbers, and underscores',
                  },
                  validate: (value) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue.length === 0)
                      return 'Username is required';
                    setValue('username', trimmedValue, {
                      shouldValidate: false,
                    });
                    return true;
                  },
                })}
              />
              {errors.username && (
                <ErrorMessage message={errors.username.message} />
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                disabled={loading}
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
                    setValue('password', trimmedValue, {
                      shouldValidate: false,
                    });
                    return true;
                  },
                })}
              />
              {errors.password && (
                <ErrorMessage message={errors.password.message} />
              )}
            </LabelInputContainer>

            <button
              className="group/btn relative inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-zinc-800 from-zinc-900 to-zinc-900 font-medium text-white shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={25} color="info" />
              ) : (
                <>Sign up &rarr;</>
              )}
              <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
          </form>
        </div>
      </div>
    </Container>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

const ErrorMessage = ({ message = 'Invalid value', className = '' }) => {
  return (
    <span
      className={`text-error font-roboto -mt-1.5 px-1 text-xs ${className}`}
    >
      {message}
    </span>
  );
};
