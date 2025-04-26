import { openDialog } from '@/store/slices/dialogSlice'
import { AppDispatch } from '@/store/store'
import { Plus } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'

const NoTask:React.FC = () => {
  const dispatch=useDispatch<AppDispatch>();

  return (
    <div className='flex flex-col items-center justify-center pt-[20vh]'>
         <button onClick={()=>dispatch(openDialog({mode:"ADD_TODO"}))} className='bg-purple-500 ring-5 ring-purple-100 dark:ring-purple-50/10 rounded-4xl mb-4 text-white p-2'><Plus size={34}/></button>
         <span className='text-lg font-semibold text-gray-500 dark:text-zinc-400'>Click to add new task</span>
         <span className='text-gray-300 dark:text-zinc-500'>No taks available</span>
    </div>
  )
}

export default NoTask
