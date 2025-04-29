import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/Slices/userSlice';

export default function OnPageRefresh({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const currTheme = useSelector((state) => state.theme.value.value);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currTheme);
  }, [currTheme]);

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
