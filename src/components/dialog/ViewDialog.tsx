
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

    return (
        <div className='relative'>
            <button onClick={()=>dispatch(closeDialog())} className="absolute top-2 text-gray-400 dark:text-zinc-500 right-2"><X/></button>
            <h1 className="dark:text-zinc-300 text-gray-700 text-2xl px-6 py-3 border-b-1 border-gray-200 dark:border-zinc-600">Task Details</h1>
            <div className="space-y-2 p-6 pt-6">
                <h2 className='text-gray-700 font-semibold dark:text-zinc-300 text-md'>{currentTodo?.title}</h2>
                <p className='text-gray-500 dark:text-zinc-400 text-md'>{currentTodo?.description}</p>
                <div>
                    <p className='dark:text-zinc-400 text-gray-500'><span className=' text-gray-700 font-semibold dark:text-zinc-300'>Date : </span>{dayjs(currentTodo?.updatedAt).format('DD MMM YYYY')}</p>
                    <p className='dark:text-zinc-400 text-gray-500'><span className='text-gray-700 font-semibold dark:text-zinc-300'>Time : </span>{dayjs(currentTodo?.updatedAt).format('hh:mm A')}</p>
                </div>
                <div>
                <p className='dark:text-zinc-400 text-gray-500'><span className='dark:text-zinc-300 text-gray-700 font-semibold'>Priority : </span>{currentTodo?.priority}</p>
                </div>
                <div>
                <p className='dark:text-zinc-400 text-gray-500'><span className='dark:text-zinc-300 text-gray-700 font-semibold'>Deadline : </span>{dayjs(currentTodo?.dueDate).format('DD MMM YYYY')}</p>
                </div>
            </div>
        </div>
    )
}

export default ViewDialog
