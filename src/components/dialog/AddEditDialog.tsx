import { closeDialog } from '@/store/slices/dialogSlice'
import { addTodo, updateTodo } from '@/store/slices/todoSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DialogLoader from './DialogLoader'
import { AddToDo, EditToDo, Todo } from '../../../types/todo'
import { MdDescription } from 'react-icons/md'

const AddEditDialog: React.FC = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const addloading = useSelector((state: RootState) => state.todos.todoAdding);
  const updateloading = useSelector((state: RootState) => state.todos.todoUpdating);
  const { id: currentTodoId, mode } = useSelector((state: RootState) => state.dialog);
  const todos = useSelector((state: RootState) => state.todos.todos)
  const dispatch = useDispatch<AppDispatch>();

  const priorities = ['low', 'medium', 'high'];

  const initialAddTask: AddToDo = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  }

  const currentTaskDetails: Todo | undefined = todos.find(todo => todo.id === currentTodoId)



  function getDialogMode() {
    if (mode === 'ADD_TODO')
      return 'Add Task'

    if (mode === 'EDIT_TODO')
      return 'Edit Task'

  }

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' })) // Clear error on change
  }

  const handleCloseDialog = () => {
    return dispatch(closeDialog())
  }
  const handleCancelTaskActivity = (e: React.FormEvent, formData: AddToDo | EditToDo) => {
    e.preventDefault()

    if (mode === 'ADD_TODO') {
      if (JSON.stringify(initialAddTask) === JSON.stringify(formData))
        return handleCloseDialog()
    }
    if (mode === 'EDIT_TODO') {
      const { title, priority, description, dueDate } = currentTaskDetails as Todo

      console.log({ title, priority: priority.toLowerCase(), description, dueDate:dueDate.split("T")[0]})
      console.log(formData)
      if (JSON.stringify({ title,description, priority: priority.toLowerCase(),  dueDate:dueDate.split("T")[0]}) === JSON.stringify(formData))
        return handleCloseDialog()
    }

    const confirmed = confirm("Are you sure you want to discard changes?");
    if (confirmed)
      handleCloseDialog()
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) newErrors.title = 'Task title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else if (formData.dueDate < today) {
      newErrors.dueDate = 'Due date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const { title, description, priority, dueDate, } = formData;
    e.preventDefault()
    if (!validate()) return;
    const newTodo = {
      title,
      description,
      priority: priority.toUpperCase(),
      dueDate: new Date(dueDate).toISOString(),
    };
    try {
      if (mode === 'ADD_TODO')
        await dispatch(addTodo(newTodo)).unwrap();
      else
        await dispatch(updateTodo({
          todoId: currentTodoId || "",
          updatedTodo: { ...newTodo }
        })).unwrap();
      setFormData({ title: '', description: '', priority: '', dueDate: '' });
    } catch (err) {
      throw err;
    }
    finally {
      handleCloseDialog();
    }
  }

  const [formData, setFormData] = useState<AddToDo | EditToDo>(initialAddTask);

  useEffect(() => {
    if (mode === 'EDIT_TODO') {
      const currentTask = todos.find(todo => todo.id === currentTodoId);
      if (currentTask) {
        setFormData({
          title: currentTask.title || '',
          description: currentTask.description || '',
          priority: currentTask.priority.toLowerCase() || 'medium',
          dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''
        });
      }
    } else {
      setFormData(initialAddTask);
    }
  }, [mode, currentTodoId, todos]);


  return (
    <div className='flex-1'>
      {(addloading || updateloading) && <DialogLoader />}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-zinc-200">{getDialogMode()}</h2>
        </div>
        {/* Task Title */}
        <div>
          <label htmlFor="title" className="block  text-sm font-medium text-gray-700 dark:text-zinc-200">Task Title</label>
          <input
            type="text"
            maxLength={50}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title "
            className={`mt-1 w-full rounded-md border px-3 py-2 dark:text-zinc-300 focus:border-purple-500 focus:outline-0 ${errors.title ? 'border-red-600 dark:border-red-400' : 'border-gray-200 dark:border-zinc-600'
              }`}
          />
          {errors.title && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>}
        </div>

        {/* Task Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-200">Description</label>
          <textarea
            id="description"
            name="description"
            maxLength={290}
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task"
            className={`mt-1 w-full resize-none rounded-md border dark:text-zinc-300 px-3 py-2 focus:border-purple-500 focus:outline-0 ${errors.description ? 'border-red-600 dark:border-red-400' : 'border-gray-200 dark:border-zinc-600'
              }`}
          ></textarea>
          {errors.description && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>}
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-zinc-200">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 w-full dark:text-zinc-300 rounded-md border px-3 py-2 focus:border-purple-500 focus:outline-0 border-gray-200 dark:border-zinc-600"
          >
            {priorities.map((priority) => (
              <option
                key={priority}
                value={priority}
                className="dark:bg-zinc-600 capitalize"
              >
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-zinc-200">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={today}
            className={`mt-1 w-full dark:text-zinc-300 rounded-md border px-3 py-2 focus:border-purple-500 focus:outline-0 ${errors.dueDate ? 'border-red-600 dark:border-red-400' : 'border-gray-200 dark:border-zinc-600'
              }`}
          />
          {errors.dueDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.dueDate}</p>}
        </div>
        <div className="flex gap-2">
          <button className='flex-1/5 bg-gray-200 text-gray-600 dark:bg-zinc-600 px-4 py-2 rounded-md dark:text-zinc-200' onClick={(e) => handleCancelTaskActivity(e, formData)}>Cancel</button>
          <button
            type="submit"
            className="flex-1/5 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            {mode === 'ADD_TODO' ? 'Add' : 'Update'} Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEditDialog
