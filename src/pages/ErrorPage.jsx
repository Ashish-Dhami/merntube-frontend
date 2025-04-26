import { memo } from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <main className="fixed inset-0 z-1000 flex h-screen w-full flex-col items-center justify-center bg-[#1A2238] select-none">
      <h1 className="text-9xl font-extrabold tracking-widest text-white">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-[#FF6A3D] px-2 text-sm text-slate-900">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          to="/"
          className="group relative inline-block text-sm font-medium text-[#FF6A3D] focus:ring focus:outline-none active:text-orange-500"
        >
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

          <span className="relative block border border-current bg-[#1A2238] px-8 py-3">
            Go Home
          </span>
        </Link>
      </button>
    </main>
  );
}

export default memo(ErrorPage);
