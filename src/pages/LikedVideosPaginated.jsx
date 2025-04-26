import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikedVideos } from '../store/Slices/likeSlice';
import { LikedVideos } from '../components';
import { useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from '../icons';

export default function LikedVideosPaginated() {
  const dispatch = useDispatch();
  const { loading, likedVideos, likedVideosTotal } = useSelector(
    (state) => state.like
  );
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    dispatch(getLikedVideos({ page: page + 1, limit }));
  }, [page, limit, dispatch]);

  return (
    <div className="w-full">
      <div
        className={`relative w-full ${loading ? 'pointer-events-none' : ''}`}
      >
        <LikedVideos currentItems={likedVideos} />
        {loading && (
          <div className="absolute inset-0 z-50 backdrop-blur-xs"></div>
        )}
      </div>
      <TablePagination
        component="div"
        disabled={loading}
        count={likedVideosTotal}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Videos per page:"
        showFirstButton
        showLastButton
        sx={{ marginTop: '24px' }}
      />
    </div>
  );
}
