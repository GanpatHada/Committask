'use client';
import Dialog from "@/components/dialog/Dialog";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TodoCard from "@/components/TodoCard";
import { fetchTodos, Todo } from "@/store/slices/todoSlice";
import { AppDispatch, RootState } from "@/store/store";
import { filterTodos } from "@/utils/filterHelper";
import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function Todos() {
  const { todos, loading: { read }, view, filter } = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTodos())
  }, [])

  function getTodos(): Todo[] {
    return filterTodos(todos, filter)
  }

  return (
    <div id="todos-wrapper" className="flex-1 flex overflow-auto p-4">
      {
        read ? <div>Loading</div> : <div id="todos" className={`flex-1 grid ${view === 'ROWS' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} auto-rows-max gap-3 max-w-7xl mx-auto`}>
          {getTodos()?.map(todo => {
            return <TodoCard key={todo.id} todo={todo} />
          })}
        </div>}
    </div>
  )
}





function HomeContent() {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  return (
    <div className={`flex h-screen absoult top-0 right-0 flex-col transition-all duration-300 ease-in-out w-full ${isOpen ? 'sm:w-[calc(100vw-250px)]  ' : 'sm:w-[100vw] '}`}>
      <Navbar />
      <Todos />
    </div>
  );
}

function HomeWrapper() {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const { data: session, status } = useSession();
  if (status === "loading")
    return <Loading />;
  if (status === 'unauthenticated')
    return redirect('/login')
  return <div className="flex justify-end flex-1 dark:bg-zinc-800">
    <div id="sidebar-wrapper" className={`transition-all duration-300 linear h-full ${isOpen ? 'sm:w-[250px] ' : 'sm:w-0'}`}>
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
