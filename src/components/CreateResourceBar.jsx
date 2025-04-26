import { Link } from 'react-router-dom';
import { RiVideoUploadLine, TbPlaylist, FaRetweet } from '../icons';

export default function CreateResourceBar({ className = '' }) {
  return (
    <div className={`${className}`}>
      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <Link
            className="tooltip tooltip-info tooltip-bottom"
            data-tip="Upload a video"
            to="videos/new"
          >
            <RiVideoUploadLine className="h-5 w-5" />
          </Link>
        </li>
        <li>
          <Link
            className="tooltip tooltip-accent tooltip-bottom"
            data-tip="Make a playlist"
            to="playlists/new"
          >
            <TbPlaylist className="h-5 w-5" />
          </Link>
        </li>
        <li>
          <Link
            className="tooltip tooltip-warning tooltip-bottom"
            data-tip="Write a tweet"
            to="tweets/new"
          >
            <FaRetweet className="h-5 w-5" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
