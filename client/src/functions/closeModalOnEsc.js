// useCloseModalOnEsc.js

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoginIsOpen } from '../store/loginSlice';

export const useCloseModalOnEsc = () => {
  const dispatch = useDispatch();
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      dispatch(setLoginIsOpen(false));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [dispatch]); // Add dispatch to the dependency array

  // Custom hooks must return something
  return null;
};
