import { Todo, TodoFilter, TodoFilterByPriorityType } from "../../types/todo";

function isDateToday(dueDate: Date): boolean {
  const today = new Date();
  return (
    today.getFullYear() === dueDate.getFullYear() &&
    today.getMonth() === dueDate.getMonth() &&
    today.getDate() === dueDate.getDate()
  );
}

function isDateThisWeek(inputDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const givenDate = new Date(inputDate);
  givenDate.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const upcomingSunday = new Date(today);
  upcomingSunday.setDate(today.getDate() + daysUntilSunday);

  return givenDate > today && givenDate <= upcomingSunday;
}

function isDateThisMonth(inputDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const givenDate = new Date(inputDate);
  givenDate.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const upcomingSunday = new Date(today);
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  upcomingSunday.setDate(today.getDate() + daysUntilSunday);
  upcomingSunday.setHours(0, 0, 0, 0);

  const isInSameMonth = givenDate.getMonth() === today.getMonth();
  const isInSameYear = givenDate.getFullYear() === today.getFullYear();
  const isAfterSunday = givenDate > upcomingSunday;

  return isInSameMonth && isInSameYear && isAfterSunday;
}

export function isDateAfterFirstOfNextMonth(inputDate: Date): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstOfNextMonth = new Date(year, month + 1, 1);
  firstOfNextMonth.setHours(0, 0, 0, 0);

  const given = new Date(inputDate);
  given.setHours(0, 0, 0, 0);

  return given >= firstOfNextMonth;
}

type updatedTodosType = {
  today: Todo[];
  thisWeek: Todo[];
  thisMonth: Todo[];
  later: Todo[];
  missed: Todo[];
};

type PriorityMap = {
  low: Todo[];
  med: Todo[];
  high: Todo[];
};

export function filterTodosByDeadline(todos: Todo[], filter: TodoFilter) {
  const {
    priority: priorityFilter,
    sortField,
    sortOrder,
  } = filter;
  let currentTodos = todos;

  if (sortField !== "SELECT") {
    if (sortField === "PRIORITY") {
      let tempTodos = currentTodos.reduce<PriorityMap>((acc,cur)=>{
         if(cur.priority==='LOW')
           acc.low.push(cur)
         if(cur.priority==='MEDIUM')
           acc.med.push(cur)
         if(cur.priority==='HIGH')
           acc.high.push(cur)
         return acc; 
      },{
        low: [],
        med: [],
        high: [],
      });
      if(sortOrder==='ASC')
        currentTodos=[...tempTodos.low,...tempTodos.med,...tempTodos.high]
      else
        currentTodos=[...tempTodos.low,...tempTodos.med,...tempTodos.high].reverse()
    }
    else
    {
      if(sortOrder==='DESC')
        currentTodos=[...currentTodos].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      else
        currentTodos=[...currentTodos].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
  }

  const updatedTodos: updatedTodosType = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    later: [],
    missed: [],
  };
  if (priorityFilter.length !== 0)
    currentTodos = currentTodos.filter((todo) =>
      priorityFilter.includes(todo.priority as TodoFilterByPriorityType)
    );
  currentTodos.map((todo) => {
    if (isDateToday(new Date(todo.dueDate)))
      return updatedTodos["today"].push(todo);
    if (isDateThisWeek(new Date(todo.dueDate)))
      return updatedTodos["thisWeek"].push(todo);
    if (isDateThisMonth(new Date(todo.dueDate)))
      return updatedTodos["thisMonth"].push(todo);
    if (isDateAfterFirstOfNextMonth(new Date(todo.dueDate)))
      return updatedTodos["later"].push(todo);
    return updatedTodos["missed"].push(todo);
  });

  return updatedTodos;
}
