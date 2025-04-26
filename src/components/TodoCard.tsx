import { capitalize } from "@/app/globalUtils";
import { openDialog } from "@/store/slices/dialogSlice";
import { deleteTodo, Todo } from "@/store/slices/todoSlice";
import { AppDispatch } from "@/store/store";
import { getDaysRemains } from "@/utils/dateHelper";
import dayjs from "dayjs";
import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type TodoCardProps = {
  todo: Todo;
};
const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { title, dueDate, priority, loading, id, createdAt } = todo;
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteTodo = (e: any) => {
    e.stopPropagation();
    dispatch(deleteTodo(id));
  };

  type Priority = "LOW" | "MEDIUM" | "HIGH";

  const getPriorityColor = (priority: Priority) => {
    if (priority === "LOW") return "bg-green-200 text-green-800";
    if (priority === "MEDIUM") return "bg-yellow-200 text-gray-700";
    if (priority === "HIGH") return "bg-red-200 text-red-800";
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

  const getTaskStatusColor = (status: string): string => {
    if (status === "Completed") return "text-green-400 dark:text-green-200 ";
    if (status === "Missed") return "text-red-400 dark:text-red-200";
    if (status === "Pending") return "text-blue-400 dark:text-blue-200";
    return "text-transparent";
  };

  const getTaskStatus = (): string => {
    if (todo.completed) return "Completed";
    const daysLeft = getDaysRemains(todo.dueDate);
    if (daysLeft < 0) return "Missed";
    return "Pending";
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
      className={`border-1 border-gray-200 cursor-pointer h-fit bg-white dark:bg-transparent rounded-md overflow-clip dark:border-zinc-700 p-3 relative ${
        loading && "opacity-[0.2]"
      }`}
    >
      <div className="flex flex-col">
        <h1 className="font-[500]leading-tight text-gray-800 text-md dark:text-zinc-200">
          {title}{" "}
          <span
            title={capitalize(priority) + " priority"}
            className={`${getPriorityColor(
              priority as Priority
            )} text-xs px-2 py-0.5 font-normal justify-center ml-1 rounded-xl`}
          >
            {priority}
          </span>
        </h1>

        <p className="text-gray-400 text-sm leading-tight dark:text-zinc-500 ">
          <span
            className={`${getTaskStatusColor(
              getTaskStatus()
            )} font-semibold mr-1`}
          >
            {getTaskStatus()}
          </span>
          <span>{getRemainingDays(dueDate)}</span>
        </p>

        <span className="mt-4 text-sm text-gray-400 dark:text-zinc-500">
          {dayjs(createdAt).format("DD MMM YYYY")} |&nbsp;
          {dayjs(createdAt).format("hh:mm A")}
        </span>
        <div className='text-gray-600 rounded-md flex gap-2  dark:text-zinc-300 absolute right-2 bottom-2'>
            <button onClick={handleEditTodo} className="bg-gray-300/40 dark:bg-zinc-600 p-2 rounded-2xl text-gray-500 dark:text-zinc-100" title='Edit task' ><Pencil size={16} /></button>
            <button onClick={handleDeleteTodo} className="bg-gray-300/40 dark:bg-zinc-600 p-2 rounded-2xl text-gray-500 dark:text-zinc-100" title='Delete task'><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
