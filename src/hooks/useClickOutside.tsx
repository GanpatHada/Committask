import { useEffect } from 'react';

function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void,ref2?: React.RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(ref2?.current?.contains(event.target as Node))
        return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, ref2,callback]);
}

export default useClickOutside;
