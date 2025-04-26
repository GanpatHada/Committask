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
    <nav className='flex items-center bg-white py-4 px-4 dark:bg-zinc-800 justify-between dark:border-b-1 shadow-md dark:shadow-none dark:border-zinc-700'>
         <div className='flex items-center gap-1'><button onClick={()=>dispatch(openSidebar())} className={`text-zinc-400 ${isOpen?'hidden':'inline-block'}`}><PanelLeftOpen /></button><h1 className='text-xl font-bold text-purple-500'>Committask</h1></div> 
         <div className='flex gap-2'>
              <button onClick={handleOpenAddTodoDialog} className='flex gap-1 bg-purple-500 rounded-md text-white px-3 py-2'><span><Plus /></span><span className='sm:inline hidden'>Add Task</span></button>
              <button onClick={()=>dispatch(toggleView())} className='text-gray-600 sm:inline hidden dark:text-zinc-500'>{view==='ROWS'?<LayoutGrid size={18}/>:<Rows3 size={18} />}</button>
         </div>
    </nav>
  )
}

export default Navbar;
