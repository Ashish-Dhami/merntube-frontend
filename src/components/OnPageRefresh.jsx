import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/Slices/userSlice';

export default function OnPageRefresh({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    dispatch(getCurrentUser()).then(() => {
      setLoading(false);
    });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [dispatch]);
  if (!loading) {
    return children;
  }
}
