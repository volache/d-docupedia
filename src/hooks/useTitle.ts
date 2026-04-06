import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | 公文知識庫 - 數位行政導師`;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
