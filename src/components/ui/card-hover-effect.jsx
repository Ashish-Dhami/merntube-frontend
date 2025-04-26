import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { VideoCard } from '../';

export const HoverEffect = ({
  videos,
  className = '',
  setIsModalOpen,
  setVideoShareLink,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {videos.map((video, idx) => (
        <div
          key={video?._id}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-2xl bg-neutral-200 dark:bg-black/30"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          {/* use VideoCard here */}
          <VideoCard
            key={video._id}
            id={video._id}
            title={video.title}
            thumbnail={video.thumbnail}
            owner={video.owner}
            createdAt={video.createdAt}
            views={video.views}
            duration={video.duration}
            setIsModalOpen={setIsModalOpen}
            setVideoShareLink={setVideoShareLink}
          />
        </div>
      ))}
    </div>
  );
};
