import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BackGround, Button } from './';

const LoginPopup = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-base-200 fixed inset-0 z-50 flex items-center justify-center">
      <BackGround />
      <div className="relative rounded-lg border border-slate-800 bg-black p-5 text-center text-white">
        <p className="mb-2 text-xl font-medium">Login or Signup to continue</p>
        <Link to={`/login?redirect=${pathname}`}>
          <Button
            className="w-full rounded bg-purple-500 px-4 py-2 text-lg font-bold"
            textColor="text-black"
            text="Login"
          />
        </Link>
        <Link to="/">
          <p className="mt-4 text-sm font-normal tracking-wider text-purple-600 transition-[scale] delay-100 duration-300 hover:scale-110 hover:text-purple-800">
            Back to Home
          </p>
        </Link>
      </div>
    </div>
  );
};

export default LoginPopup;
