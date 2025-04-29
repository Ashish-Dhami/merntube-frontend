import { Container, Input, Button, BackGround } from './';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/Slices/userSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SignInSide from './sign-in-side/SignInSide';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [searchParams] = useSearchParams();
  const redirectURL = searchParams.get('redirect');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.user.authStatus);
  const error = useSelector((state) => state.user.error);
  const submit = (formData) => {
    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    const isEmail = emailPattern.test(formData.username);
    dispatch(
      loginUser(
        isEmail
          ? { email: formData.username, password: formData.password }
          : formData
      )
    ).then((res) => {
      if (res.type === 'login/fulfilled') {
        if (!redirectURL) navigate('/', { replace: true });
        else navigate(redirectURL, { replace: true });
      }
    });
  };

  useEffect(() => {
    if (authStatus) {
      toast.info('user already logged in');
      navigate('/');
    }
    if (error) reset();
  }, [error]);

  return (
    // <Container>
    //   <BackGround />
    //   {/* <form onSubmit={handleSubmit(submit)}>
    //     <fieldset className="fieldset bg-base-200 border-base-300 rounded-box absolute top-1/2 left-1/2 w-xs -translate-1/2 gap-y-3 border p-4">
    //       <legend className="fieldset-legend text-lg">Sign In</legend>
    //       <div>
    //         <Input
    //           placeholder="user123 / example@gmail.com"
    //           label="Username / Email"
    //           {...register('username')}
    //         />
    //       </div>
    //       <div className="relative">
    //         <Input
    //           type="password"
    //           placeholder="1fr5w#2^d19"
    //           label="Password"
    //           // iconClassName="top-9 text-gray-400 scale-90"
    //           {...register('password')}
    //         />
    //       </div>

    //       <Button className="btn-neutral mt-4" text="Sign In" type="submit" />
    //       <p className="my-2 text-center">
    //         Don't have an account?{' '}
    //         <Link className="cursor-pointer text-purple-700" to="/signup">
    //           Sign Up
    //         </Link>
    //       </p>
    //     </fieldset>
    //   </form> */}
    // </Container>
    <SignInSide />
  );
}
