import { capitalize } from '@/app/globalUtils'
import { openDialog } from '@/store/slices/dialogSlice'
import { deleteTodo, Todo } from '@/store/slices/todoSlice'
import { AppDispatch} from '@/store/store'
import { getDaysRemains } from '@/utils/dateHelper'
import { CalendarClock, Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { useDispatch} from 'react-redux'

type TodoCardProps = {
  todo: Todo
}
const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { title,dueDate, priority, loading, id } = todo
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteTodo = (e:any) => {
    e.stopPropagation()
    dispatch(deleteTodo(id))
  }


  type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

  const getPriorityColor = (priority: Priority) => {
    if (priority === 'LOW') return 'bg-green-200 text-green-800'
    if (priority === 'MEDIUM') return 'bg-yellow-200 text-gray-700'
    if (priority === 'HIGH') return 'bg-red-200 text-red-800'
  }

  const handleEditTodo = (e: any) => {
    e.stopPropagation()
    dispatch(openDialog({ id, mode: "EDIT_TODO" }))
  }

  const handleViewTodo = () => {
    dispatch(openDialog({ id, mode: "VIEW_TODO" }))
  }

  const getTaskStatusColor=(status:string):string=>{
       if(status==='Completed')
        return 'text-green-400 dark:text-green-200 '
       if(status==='Missed')
        return 'text-red-400 dark:text-red-200'
       if(status==='Pending')
        return 'text-blue-400 dark:text-blue-200'
       return 'text-transparent'
  }

  const getTaskStatus=():string=>{
    if(todo.completed)
      return 'Completed'
    const daysLeft = getDaysRemains(todo.dueDate);
    if (daysLeft < 0)
      return 'Missed'
    return 'Pending'

  }

  const getRemainingDays = (deadline: string): string => {
    if(todo.completed)
      return `Task has been completed`
    const daysLeft = getDaysRemains(deadline);
    if (daysLeft < 0)
      return 'Task has been missed'
    if (daysLeft === 0)
      return 'last day to complete'
    return `${daysLeft} day${daysLeft > 1 ? 's' : ''} to complete`
  }


  return (
    <div onClick={handleViewTodo} className={`border-1 border-gray-300 cursor-pointer rounded-md overflow-clip dark:border-zinc-700 p-3 relative ${loading && 'opacity-[0.2]'}`}>
      <button onClick={handleEditTodo} title='Edit task' className='text-gray-600 p-2 rounded-md bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 absolute right-1 bottom-1'><Pencil size={16} /></button>
      <button onClick={handleDeleteTodo} title='Edit task' className='text-gray-600 p-2 rounded-md bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 absolute bottom-1 right-10'><Trash2 size={16} /></button>
      <div className="flex">
        {/* <input type="checkbox" className="w-4 h-4 text-blue-600 accent-blue-600"></input> */}
        <div>
          <h1 className='font-[500] flex items-center text-gray-800 text-md dark:text-zinc-200'>{title}<span title={capitalize(priority) + " priority"} className={`${getPriorityColor(priority as Priority)} h-5 w-5 text-sm flex items-center justify-center ml-1 rounded-xl`}>{priority.charAt(0)}</span></h1>
          <div className='flex items-center gap-1 text-gray-400 text-sm dark:text-zinc-500'>
            <span><CalendarClock size={16} /></span><span>{getRemainingDays(dueDate)}</span>
          </div>
          <p className={`${getTaskStatusColor(getTaskStatus())} mt-4 text-sm`}>{getTaskStatus()}</p>
        </div>
      </div>

    </div>
  )
}

export default TodoCard
