import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from '../../icons';

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  files,
  setFiles,
  onChange,
  label = 'Upload file',
  validate,
  ...props
}) => {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    const file = newFiles[0] || null;
    setFiles(newFiles); // Update local state

    // Apply validation
    const validationResult = validate(file);
    if (validationResult !== true) {
      setError(validationResult); // Set local error
    } else {
      setError(null); // Clear error
    }

    if (onChange) {
      onChange(newFiles); // Pass array to parent
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.error(error);
      setError('File rejected');
    },
  });
  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-5"
      >
        <input
          id="file-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            handleFileChange(newFiles); // Custom handler
          }}
          className="hidden"
          ref={fileInputRef} // Only custom ref needed
          {...props}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-300">
            {label}
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400">
            Drag n drop your files here or click to upload
          </p>
          <div className="relative mx-auto mt-5 w-full max-w-xl">
            {files.length > 0 &&
              files.map((file, idx) => (
                <React.Fragment key={'file' + idx}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="mx-auto h-32 w-32 overflow-hidden rounded-full border border-neutral-800 object-cover text-center text-3xl leading-32"
                  />
                  <motion.div
                    layoutId={idx === 0 ? 'file-upload' : 'file-upload-' + idx}
                    className={cn(
                      'relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-neutral-900 p-3',
                      'shadow-sm'
                    )}
                  >
                    <div className="font-roboto flex w-full items-center justify-between gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="max-w-xs truncate text-base text-neutral-300"
                      >
                        {file.name}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="shadow-input w-fit shrink-0 rounded-lg bg-neutral-800 px-2 py-1 text-sm text-white"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>
                    <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-400 md:flex-row md:items-center">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-md bg-neutral-800 px-1 py-0.5"
                      >
                        {file.type}
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                      >
                        modified{' '}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                  </motion.div>
                </React.Fragment>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  'relative z-40 mx-auto mt-2 flex h-24 w-full max-w-24 items-center justify-center rounded-md bg-neutral-900 group-hover/file:shadow-2xl',
                  'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]'
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-neutral-600"
                  >
                    Drop it
                    <FiUpload className="h-4 w-4 text-neutral-400" />
                  </motion.p>
                ) : (
                  <FiUpload className="h-4 w-4 text-neutral-300" />
                )}
              </motion.div>
            )}
            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-24 w-full max-w-24 items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-neutral-950'
                  : 'bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          );
        })
      )}
    </div>
  );
}
