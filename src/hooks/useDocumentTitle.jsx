import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;

    return () => {
      document.title = 'MERNTube';
    };
  }, [title]);
};

export default useDocumentTitle;
