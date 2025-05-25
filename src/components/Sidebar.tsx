'use client';
import {
  ListTodo,
  Calendar1,
  PanelLeftClose,
  LogOut,
  Palette,
  ChevronDown,
  CalendarDays,
  CalendarClock,
  CircleAlert
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar, openSidebar } from '@/store/slices/sidebarSlice';
import { AppDispatch, RootState } from '@/store/store';
import { ReactNode, useEffect, useState } from 'react';
import { applyDateFilter } from '@/store/slices/todoSlice';
import { TodoFilterByDateType } from '../../types/todo';
import { capitalize } from '@/app/globalUtils';
import { updateTheme } from '@/store/slices/userSlice';
import { isNotWeekend } from '@/utils/dateHelper';



const ThemeSelector = () => {
  const { theme, themeUpdating } = useSelector((state: RootState) => state.user)
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const [currentTheme, setCurrentTheme] = useState<"SYSTEM" | "DARK" | "LIGHT">(theme);

  function applySystemTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function applyTheme(theme: "SYSTEM" | "DARK" | "LIGHT") {
    switch (theme) {
      case "LIGHT":
        document.documentElement.classList.remove("dark");
        break;
      case "DARK":
        document.documentElement.classList.add("dark");
        break;
      default:
        applySystemTheme();
        break;
    }
  }




  useEffect(() => {
    setCurrentTheme(theme);
    applyTheme(theme)
  }, [theme]);

  const handleSelect = async (value: string) => {
    setIsOpen(false);
    const normalized = value.toUpperCase() as "SYSTEM" | "DARK" | "LIGHT";
    if (normalized !== currentTheme) {
      try {
        await dispatch(updateTheme(normalized)).unwrap();
        setCurrentTheme(normalized);
        applyTheme(normalized)
      } catch (error) {
        throw error
      }
    }

  };


  return (
    <div className={`${themeUpdating ? "opacity-50" : "opacity-100"} relative w-full`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-white dark:hover:bg-zinc-700 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Palette size={18} /> {capitalize(currentTheme)}
        </div>
        <span className={`text-sm transform transition duration-500 ${!isOpen && 'rotate-180'}`}><ChevronDown size={18} /></span>
      </button>
      {isOpen && (
        <div className="absolute bottom-2 z-10 mt-2 w-full bg-white dark:bg-zinc-800  rounded-md shadow mb-8 overflow-hidden">
          {["LIGHT", "DARK", "SYSTEM"].map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 ${currentTheme === opt ? "font-semibold text-black dark:text-white" : ""
                }`}
            >
              {capitalize(opt)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};




export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const currentFilter = useSelector((state: RootState) => state.todos.filter.date);
  const { name, image } = useSelector((state: RootState) => state.user)

  type TodoFilters = {
    value: TodoFilterByDateType;
    icon: ReactNode;
    label: string;
  };

  const baseFilters: TodoFilters[] = [
    { value: 'UPCOMMING', icon: <ListTodo size={18} />, label: "Upcomming" },
    { value: 'TODAY', icon: <CalendarClock size={18} />, label: "Today" },
    { value: 'THIS_WEEK', icon: <Calendar1 size={18} />, label: "This Week" },
    { value: 'THIS_MONTH', icon: <CalendarDays size={18} />, label: "This Month" },
    { value: 'MISSED', icon: <CircleAlert size={18} />, label: "Past tasks" },
  ]

  const todoFilters: TodoFilters[] = baseFilters.reduce<TodoFilters[]>((acc, filter) => {
    if (filter.value === 'THIS_WEEK' && !isNotWeekend()) return acc;
    return [...acc, filter];
  }, []);




  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 639) {
      dispatch(openSidebar());
    }
  }, []);

  return (
    <aside id='sidebar'
      className={`w-[250px] h-full dark:bg-[#202020]
     bg-gray-100 px-4 py-6 fixed top-0 left-0 z-20 flex flex-col
     transition-transform duration-300 ease-in-out
     overflow-auto  text-gray-600  text-sm ${isOpen ? 'translate-x-[0px]' :
          'translate-x-[-250px]'}`}>


      <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-700 rounded-xl shadow mb-8  justify-between">

        <div className='flex items-center gap-1.5'>
          {image ? <img
            src={image}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
            : <div className='h-[40px] aspect-square rounded-[40px] bg-purple-500 text-white flex items-center justify-center text-xl'>
              {name.charAt(0).toUpperCase()}
            </div>}
          <div className="font-medium text-sm dark:text-white">{name.slice(0, 20)}</div>
        </div>
        <button onClick={() => dispatch(closeSidebar())} className='cursor-pointer'><PanelLeftClose color='gray' /></button>

      </div>
      <div className="mb-6">
        <p className="uppercase text-xs text-gray-400 px-3 mb-2 dark:text-zinc-500">General</p>
        <nav className="space-y-2 dark:text-zinc-400 text-gray-500">
          {
            todoFilters.map((filter, index) => {
              return <SidebarItem key={index} icon={filter.icon} value={filter.value} label={filter.label} active={currentFilter === filter.value} />
            })
          }
        </nav>
      </div>

      <div className="mb-6">
        <p className="uppercase text-xs text-gray-400 px-3 mb-2 dark:text-zinc-500">Todo Tags</p>
      </div>
      <div className="mt-auto pt-6 dark:text-zinc-400">
        <p className="uppercase text-xs text-gray-400 px-3 mb-2 dark:text-zinc-500">More</p>
        <ThemeSelector />
        <button onClick={() => signOut()} className={` w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white dark:hover:bg-zinc-700`}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, value }: { icon: ReactNode, label: string, active: boolean, value: TodoFilterByDateType }) {
  const dispatch = useDispatch<AppDispatch>();
  const handleFilterChange = (value: TodoFilterByDateType): void => {
    dispatch(applyDateFilter(value))
  }
  return (
    <div onClick={() => handleFilterChange(value)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white dark:hover:bg-zinc-700 cursor-pointer ${active && 'dark:text-purple-400  text-purple-500 '}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

