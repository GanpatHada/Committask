import { Todo, TodoFilterType } from "@/store/slices/todoSlice";


function isDateToday(dueDate:Date): boolean {
    const today = new Date();
    return (
      today.getFullYear() === dueDate.getFullYear() &&
      today.getMonth() === dueDate.getMonth() &&
      today.getDate() === dueDate.getDate()
    );
  }

  function isDateThisMonth(dueDate:Date): boolean {
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
  
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth()
    );
  }  
  function isDateThisWeek(dueDate: Date): boolean {
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
  
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);
  
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
  
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

export function filterTodos(todos:Todo[],appliedFilter:TodoFilterType):Todo[]{
   if(appliedFilter==='TODAY')
      return todos.filter(todo=>isDateToday(new Date(todo.dueDate)))
   if(appliedFilter==='THIS_MONTH')
      return todos.filter(todo=>isDateThisMonth(new Date(todo.dueDate))) 
   if(appliedFilter==='THIS_WEEK')
      return todos.filter(todo=>isDateThisWeek(new Date(todo.dueDate))) 
    return todos; 
}