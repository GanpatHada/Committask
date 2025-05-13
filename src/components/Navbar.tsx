import { openDialog } from '@/store/slices/dialogSlice';
import {openSidebar} from '@/store/slices/sidebarSlice';
import { toggleView } from '@/store/slices/todoSlice';
import { AppDispatch, RootState } from '@/store/store';
import { LayoutGrid, PanelLeftOpen, Plus, Rows3, SlidersHorizontal } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import FilterPopup from './popup/FilterPopup';


const Navbar:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {view } = useSelector((state: RootState) => state.todos)
  const isOpen = useSelector((state:RootState)=>state.sidebar.isOpen);
  const [popup,setPopup]=useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const togglePopup=(e:any)=>{
    e.stopPropagation()
    setPopup(!popup)
  };
  const closePopup=()=>setPopup(false);

const handleOpenAddTodoDialog=(e:any)=>{
     return dispatch(openDialog({mode:'ADD_TODO'}))
}

  return (
    <nav className='flex items-center bg-white py-3 px-4 dark:bg-zinc-800 justify-between border-b-1 border-gray-200 dark:border-zinc-700'>
         <div className='flex items-center gap-1'><button onClick={()=>dispatch(openSidebar())} className={`text-zinc-400 ${isOpen?'hidden':'inline-block'}`}><PanelLeftOpen /></button><h1 className='text-xl font-bold text-purple-500'>Committask</h1></div> 
         <div className='flex gap-3 sm:gap-5 relative'>
              <button  onClick={handleOpenAddTodoDialog} className='flex items-center gap-2 bg-purple-600 sm:hover:bg-purple-700 rounded-4xl text-white text-sm px-2 sm:px-3 py-2'><span className='bg-purple-500 aspect-square w-6 flex items-center justify-center rounded-xl'><Plus size={18} /></span><span className='sm:inline hidden'>Add Task</span></button>
              <button title='toggle view' onClick={()=>dispatch(toggleView())} className='text-gray-600 sm:inline hidden dark:text-zinc-400'>{view==='ROWS'?<LayoutGrid size={18}/>:<Rows3 size={18} />}</button>
              <button ref={filterButtonRef} onClick={togglePopup} title='Filters' className='text-gray-600 inline dark:text-zinc-400'><SlidersHorizontal size={18} /></button>
              <FilterPopup filterButtonRef={filterButtonRef} closePopup={closePopup} popup={popup}/>
         </div>
    </nav>
  )
}

export default Navbar;
