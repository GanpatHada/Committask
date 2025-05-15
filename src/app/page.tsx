'use client';
import Dialog from "@/components/dialog/Dialog";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TaskLoading from "@/components/TaskLoading";
import TodoCard from "@/components/TodoCard";
import { fetchTodos } from "@/store/slices/todoSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getEndOfMonthDate, getFirstDateOfNextMonth, getTodayDate, getTomorrowDate, getUpcomingMonday, getUpcomingSunday, getYesterdayDate, isNotWeekend } from "@/utils/dateHelper";
import { filterTodosByDeadline } from "@/utils/filterHelper";
import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Todo } from "../../types/todo";
import { saveUser } from "@/store/slices/userSlice";




const TodoSection: React.FC<{ heading: string, helperDates: string, todos: Todo[] }> = ({ heading, helperDates, todos }) => {
  const { view } = useSelector((state: RootState) => state.todos)
  return (
    <div>
      <header className="my-4">
        <h1 className="text-xl text-gray-600 dark:text-zinc-200">{heading} </h1>
        <span className="text-sm font-normal text-gray-400 dark:text-zinc-400">{helperDates}</span>
      </header>
      {
        todos.length === 0 ?
          <div className="text-gray-300 dark:text-zinc-600">{`! No task for ${heading}`}</div> :
          <div className={`grid ${view === 'ROWS' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} auto-rows-fr h-fit gap-3`}>
          {todos.map(todo =><TodoCard key={todo.id} todo={todo} />)}
          </div>
      }
    </div>
  )
}


function Todos() {
  const { todos, todoFetching, view, filter } = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTodos())
  }, [])
  const { today, thisWeek, thisMonth, later, missed } = filterTodosByDeadline(todos, filter)
  return (
    <div id="todos-wrapper" className="flex-1 flex overflow-auto bg-white dark:bg-zinc-800">
      <div className="max-w-7xl w-full mx-auto p-4 h-fit">
        {todoFetching ? <TaskLoading view={view} /> :
          <div id="todos" className="flex flex-col gap-4">
            {(filter.date === 'UPCOMMING' || filter.date === 'TODAY') && <TodoSection heading={"Today"} helperDates={getTodayDate()} todos={today} />}
            {(filter.date === 'UPCOMMING' || filter.date === 'THIS_WEEK') && isNotWeekend() && <TodoSection heading={"This Week"} helperDates={`${getTomorrowDate()} - ${getUpcomingSunday()}`} todos={thisWeek} />}
            {(filter.date === 'UPCOMMING' || filter.date === 'THIS_MONTH') && <TodoSection heading={"This Month"} helperDates={`${getUpcomingMonday()} - ${getEndOfMonthDate()}`} todos={thisMonth} />}
            {filter.date === 'UPCOMMING' && <TodoSection heading={"After Month"} helperDates={`${getFirstDateOfNextMonth()} - later`} todos={later} />}
            {filter.date === 'MISSED' && <TodoSection heading={"Past Tasks"} helperDates={`${getYesterdayDate()} - before`} todos={missed} />}
          </div>}
      </div>
    </div>
  )
}










function HomeContent() {
  return (
    <div className={`flex h-screen absoult top-0 right-0 flex-col flex-1 w-full`}>
      <Navbar />
      <Todos />
    </div>
  );
}

function HomeWrapper() {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (session?.user) {
      dispatch(saveUser({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || undefined,
        theme: session.user.theme || "SYSTEM"
      }));
    }
  }, [session, dispatch]);

  if (status === "loading")
    return <Loading />;
  if (status === 'unauthenticated')
    return redirect('/login')
  return <div className="flex justify-end flex-1 dark:bg-zinc-800">
    <div id="sidebar-wrapper" className={`transition-all duration-300 ease-in-out h-full ${isOpen ? 'sm:w-[250px] ' : 'sm:w-0'}`}>
      <Sidebar />
    </div>
    <HomeContent />
  </div>
}


export default function Home() {
  const isOpen = useSelector((state: RootState) => state.dialog.isOpen);
  return <div className="flex">
    <SessionProvider>
      {isOpen && <Dialog />}
      <HomeWrapper />
    </SessionProvider>
  </div>;
}
