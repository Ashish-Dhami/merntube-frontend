import { useEffect, useId, useState } from 'react';
import { toast } from 'react-toastify';
import { IoCloseOutline, CiShare1 } from '../icons';
import { Loader } from './';

const VideoShareModal = ({ isOpen, onClose, shareLink }) => {
  // if (!isOpen) return null;
  const toastId = useId();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.info('Link copied to clipboard', {
      position: 'top-left',
      toastId,
    });
  };

  const [animateLoading, setAnimateLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  });

  // Prevent background scrolling
  // useEffect(() => {
  //   document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  //   return () => {
  //     document.body.style.overflow = 'auto';
  //   };
  // }, [isOpen]);

  return (
    <div className="font-roboto pointer-events-auto fixed inset-0 z-101 flex overflow-y-auto bg-black/40 py-8">
      <div
        className={`m-auto flex h-50 w-full max-w-md transform flex-col ${animateLoading ? 'justify-center' : 'justify-between'} rounded-xl bg-[#212121] p-6 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {animateLoading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium text-white">
                <h2 className="mr-2 inline">Share</h2>
                <CiShare1 className="mb-1 inline text-2xl font-bold" />
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-white"
              >
                <IoCloseOutline className="text-3xl" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/20 bg-[#0f0f0f] px-2 py-3">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border-none bg-transparent text-sm text-gray-200 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="cursor-pointer rounded-2xl bg-[#3ea6ff] px-3 py-1 text-sm font-medium whitespace-nowrap text-[#0f0f0f] transition-colors duration-200 hover:bg-blue-500"
              >
                Copy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoShareModal;
