import { openDialog } from '@/store/slices/dialogSlice';
import { closeSidebar,openSidebar} from '@/store/slices/sidebarSlice';
import { toggleView } from '@/store/slices/todoSlice';
import { AppDispatch, RootState } from '@/store/store';
import { LayoutGrid, PanelLeftOpen, Plus, Rows3 } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector} from 'react-redux';


const Navbar:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {view } = useSelector((state: RootState) => state.todos)
  const isOpen = useSelector((state:RootState)=>state.sidebar.isOpen)

const handleOpenAddTodoDialog=()=>{
  return dispatch(openDialog({mode:'ADD_TODO'}))
}

  return (
    <nav className='flex items-center bg-white py-6 px-5 dark:bg-zinc-800 justify-between dark:border-b-1 shadow-md dark:border-zinc-700'>
         <div className='flex items-center gap-2'><button onClick={()=>dispatch(openSidebar())} className={`text-zinc-400 ${isOpen?'hidden':'inline-block'}`}><PanelLeftOpen /></button><h1 className='text-2xl font-bold text-zinc-700 dark:text-zinc-300'>All Tasks</h1></div> 
         <div className='flex gap-2'>
              <button onClick={handleOpenAddTodoDialog} className='flex gap-1 bg-violet-500 rounded-md text-white px-3 py-2'><span><Plus /></span>Add Task</button>
              <button onClick={()=>dispatch(toggleView())} className='text-gray-600 dark:text-zinc-500'>{view==='ROWS'?<LayoutGrid size={18}/>:<Rows3 size={18} />}</button>
         </div>
    </nav>
  )
}

export default Navbar;
