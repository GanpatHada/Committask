import { capitalize } from '@/app/globalUtils'
import { closeDialog } from '@/store/slices/dialogSlice'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ViewDialog: React.FC = () => {
    const { id } = useSelector((state: RootState) => state.dialog)
    const todos = useSelector((state: RootState) => state.todos.todos)
    const dispatch = useDispatch()
    const currentTodo = todos.find(todo => todo.id === id)
    type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

    const getPriorityColor = (priority: Priority) => {
        if (priority === 'LOW') return 'bg-green-200 text-green-800'
        if (priority === 'MEDIUM') return 'bg-yellow-200 text-gray-700'
        if (priority === 'HIGH') return 'bg-red-200 text-red-800'
    }

    return (
        <div className='relative'>
            <button onClick={() => dispatch(closeDialog())} className="absolute top-2 text-gray-400 dark:text-zinc-500 right-2"><X /></button>
            <h1 className="dark:text-zinc-300 text-gray-700 text-2xl px-6 py-3 border-b-1 border-gray-200 dark:border-zinc-600">Task Details</h1>
            <div className="space-y-2 p-6 pt-6">
                <div className="flex">
                    <h2 className='text-gray-700 font-semibold dark:text-zinc-300 text-md'>{currentTodo?.title}</h2>
                    <span className={`${getPriorityColor(currentTodo?.priority as Priority)} text-xs py-1 ml-1 px-2 rounded-xl`}>{currentTodo?.priority}</span>
                </div>
                <p className='text-gray-500 dark:text-zinc-400 text-md'>{currentTodo?.description}</p>
                <div className='text-sm'>
                    <p className='dark:text-zinc-400 text-gray-500'><span className=' text-gray-700 font-semibold dark:text-zinc-300'>Date : </span>{dayjs(currentTodo?.updatedAt).format('DD MMM YYYY')}</p>
                    <p className='dark:text-zinc-400 text-gray-500'><span className='text-gray-700 font-semibold dark:text-zinc-300'>Time : </span>{dayjs(currentTodo?.updatedAt).format('hh:mm A')}</p>
                </div>
                <div className='text-sm'>
                    <p className='dark:text-zinc-400 text-gray-500'><span className='dark:text-zinc-300 text-gray-700 font-semibold'>Priority : </span>{capitalize(currentTodo?.priority || "")}</p>
                </div>
                <div className='text-sm'>
                    <p className='dark:text-zinc-400 text-gray-500'><span className='dark:text-zinc-300 text-gray-700 font-semibold'>Deadline : </span>{dayjs(currentTodo?.dueDate).format('DD MMM YYYY')}</p>
                </div>
            </div>
        </div>
    )
}

export default ViewDialog
