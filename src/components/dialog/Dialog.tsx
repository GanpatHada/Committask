import React from 'react';
import AddEditDialog from './AddEditDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ViewDialog from './ViewDialog';


const DialogWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div id="dialog-overlay" className="fixed inset-0 flex pt-[10vh] justify-center items-start bg-black/60 z-40">
      <div id='dialog' className="max-w-xl w-[90vw] bg-white dark:bg-zinc-800 shadow-lg overflow-hidden rounded-md flex flex-col relative">
        {children}
      </div>
    </div>
  );
};


const Dialog: React.FC = () => {
  const dialog = useSelector((state: RootState) => state.dialog);
  const { mode } = dialog;
  if (mode === 'ADD_TODO' || mode === 'EDIT_TODO') {
    return <DialogWrapper><AddEditDialog /></DialogWrapper>;
  }
  if (mode === 'VIEW_TODO') {
    return <DialogWrapper><ViewDialog /></DialogWrapper>;
  }

  return null;
};

export default Dialog;

