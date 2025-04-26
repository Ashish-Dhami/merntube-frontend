import { useState } from 'react';
import { VideoShareModal, VideoCard } from '../components';

export default function LikedVideos({ currentItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoShareLink, setVideoShareLink] = useState('');

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-y-4">
        {currentItems.map(({ video }) => (
          <VideoCard
            key={video._id}
            id={video._id}
            title={video.title}
            description={video.description}
            thumbnail={video.thumbnail}
            owner={video.owner}
            createdAt={video.createdAt}
            published={video.isPublished}
            views={video.views}
            duration={video.duration}
            setIsModalOpen={setIsModalOpen}
            setVideoShareLink={setVideoShareLink}
            layoutChange={true}
          />
        ))}
      </div>
      {isModalOpen && (
        <VideoShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareLink={videoShareLink}
        />
      )}
    </>
  );
}
