export default function Video({ url, thumbnail }) {
  return (
    <video
      src={url}
      controls
      className="aspect-video h-full w-full rounded-lg object-cover"
      poster={thumbnail}
      preload="metadata"
    >
      Your browser does not support the video tag.
    </video>
  );
}
