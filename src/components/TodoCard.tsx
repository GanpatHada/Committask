import { openDialog } from '@/store/slices/dialogSlice'
import { deleteTodo, Todo } from '@/store/slices/todoSlice'
import { AppDispatch, RootState } from '@/store/store'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

type TodoCardProps = {
  todo: Todo
}
const TodoCard: React.FC<TodoCardProps> = ({ todo}) => {
  const { title, description, dueDate, priority,loading,id}=todo
  const dispatch =useDispatch<AppDispatch>();
  const handleDeleteTodo=()=>{
     dispatch(deleteTodo(id))
  }


  type Priority='LOW' | 'MEDIUM' | 'HIGH'

  const getPriorityColor=(priority:Priority)=>{
    if(priority==='LOW') return 'bg-green-200 text-green-800'
    if(priority==='MEDIUM') return 'bg-yellow-200 text-gray-700'
    if(priority==='HIGH') return 'bg-red-200 text-red-800'
  }

  const handleEditTodo=(e:any)=>{
     e.stopPropagation()
     dispatch(openDialog({ id, mode: "EDIT_TODO" }))
  }

  const handleViewTodo=()=>{
    dispatch(openDialog({ id, mode: "VIEW_TODO" }))
  }

  return (
    <div onClick={handleViewTodo} className={`border-1 border-gray-300 cursor-pointer rounded-md overflow-clip dark:border-zinc-700 p-3 flex flex-col gap-2 relative ${loading&&'opacity-[0.2]'}`}>
      <button onClick={handleEditTodo} title='Edit task' className='text-gray-600 p-2 rounded-md bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 absolute right-1 bottom-1'><Pencil size={16} /></button>
      <button onClick={handleDeleteTodo} title='Edit task' className='text-gray-600 p-2 rounded-md bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 absolute bottom-1 right-10'><Trash2 size={16} /></button>
      <h1 className='font-[500] text-gray-800 text-md dark:text-zinc-200'>{title}<span className={`${getPriorityColor(priority as Priority)} text-xs py-1 ml-1 px-2 rounded-xl`}>{priority}</span></h1>
      <p className='text-gray-500 dark:text-zinc-400 text-sm leading-tight'>{description}</p>
      <div className='flex items-center gap-2 mt-2'>
        <span className="badge bg-purple-200 text-violet-800 text-xs py-1 px-2 rounded-xl">{priority}</span>
        <span className='text-gray-400 text-sm dark:text-zinc-500'>{dayjs(dueDate).format('DD MMM YYYY')}</span>
      </div>

    </div>
  )
}

export default TodoCard
