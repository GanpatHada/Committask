import { capitalize } from "@/app/globalUtils";
import { openDialog } from "@/store/slices/dialogSlice";
import { deleteTodo, updateTodoStatus } from "@/store/slices/todoSlice";
import { AppDispatch } from "@/store/store";
import { getDaysRemains } from "@/utils/dateHelper";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { RiFlag2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Todo } from "../../types/todo";
import { IoCheckmarkSharp } from "react-icons/io5";


type CompletedStatusProps = {
  todoId: string;
  completed: boolean;
};
const CompletedStatus: React.FC<CompletedStatusProps> = ({ todoId, completed }) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleTaskStatus = (e: any) => {
    e.stopPropagation()
    dispatch(updateTodoStatus({ todoId, completed: !completed }))
  }


  return (
    <button onClick={handleTaskStatus} className={`h-4 w-4 border-1 mr-3 ${completed ? "bg-purple-500 border-purple-500" : "border-gray-400 dark:border-zinc-600  bg-transparent"} group-hover:border-white  w-4 rounded-sm`}>
      {completed && <span className="text-white text-sm"><IoCheckmarkSharp /></span>}
    </button>
  )


}



type TodoCardProps = {
  todo: Todo;
};
const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { title, dueDate, priority, loading, id, createdAt, completed } = todo;
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteTodo = (e: any) => {
    e.stopPropagation();
    dispatch(deleteTodo(id));
  };

  type Priority = "LOW" | "MEDIUM" | "HIGH";

  const getPriorityColor = (priority: Priority) => {
    if (priority === "LOW") return " text-green-500 ";
    if (priority === "MEDIUM") return "text-yellow-500 ";
    if (priority === "HIGH") return "text-red-500 ";
  };

  const handleEditTodo = (e: any) => {
    e.stopPropagation();
    const daysLeft = getDaysRemains(todo.dueDate);
    if (daysLeft < 0)
      return toast.error(
        "This todo can no longer be edited because the deadline has passed."
      );
    dispatch(openDialog({ id, mode: "EDIT_TODO" }));
  };

  const handleViewTodo = () => {
    dispatch(openDialog({ id, mode: "VIEW_TODO" }));
  };

  const getRemainingDays = (deadline: string): string => {
    if (todo.completed) return `Task has been completed`;
    const daysLeft = getDaysRemains(deadline);
    if (daysLeft < 0) return "Task has been missed";
    if (daysLeft === 0) return "last day to complete";
    return `${daysLeft} day${daysLeft > 1 ? "s" : ""} to complete`;
  };


  return (
    <div
      onClick={handleViewTodo}
      className={`border-1 flex border-gray-200 cursor-pointer bg-white hover:bg-purple-500 hover:border-purple-500 group dark:bg-zinc-500/10 rounded-lg  dark:border-zinc-700 p-3 relative ${loading && "opacity-[0.2]"
        }`}
    >
      <div>
        <CompletedStatus todoId={id} completed={completed} />
      </div>
      <div className="flex flex-col">

        <p className="leading-3 font-semibold text-gray-600 text-md dark:text-zinc-200 group-hover:text-white">
          <span>{title}</span>
          <span
            title={capitalize(priority) + " priority"}
            className={`${getPriorityColor(priority as Priority)} relative top-0.5 inline-flex items-center text-lg rounded-xl ml-1`}
          >
            <RiFlag2Fill />
          </span>
        </p>



        <p className="text-sm leading-tight mt-2">
          <span className={`mr-1 text-gray-400 dark:text-zinc-300 group-hover:text-gray-100`}>
            {dayjs(dueDate).format("DD MMM YYYY")} ,
          </span>
          <span className="text-gray-400/80 dark:text-zinc-400 group-hover:text-gray-100/80">{getRemainingDays(dueDate)}</span>
        </p>
        <div className='text-white rounded-md scale-0 opacity-0 transition-all duration-100 delay-150 ease-out gap-2 group-hover:scale-100 group-hover:opacity-100 flex absolute right-2 bottom-2'>
          <button onClick={handleEditTodo} className="bg-gray-100/20 hover:bg-purple-600 p-2 rounded-2xl" title='Edit task' ><Pencil size={16} /></button>
          <button onClick={handleDeleteTodo} className="bg-gray-100/20 hover:bg-purple-600 p-2 rounded-2xl" title='Delete task'><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};
export default TodoCard;
