export interface Todo {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    updatedAt: string;
    createdAt: string;
    priority: string;
    userId: string;
    loading?: boolean;
  }
  
  export interface AddToDo {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
  }
  
  export interface EditToDo extends AddToDo{}
  
  export type TodoFilterByDateType = "TODAY" | "THIS_MONTH" | "THIS_WEEK" | "UPCOMMING" | "MISSED";
  export type TodoFilterByPriorityType = 'MEDIUM' | 'LOW' | 'HIGH';
  export type TodoViewType = 'GRID' | 'ROWS'
  export type TodoSortFieldType='PRIORITY' | 'DEADLINE' | 'SELECT'
  export type TodoSortOrderType='ASC' | 'DESC'

  

  export interface TodoFilter{
    date:TodoFilterByDateType;
    priority:TodoFilterByPriorityType[];
    sortField:TodoSortFieldType;
    sortOrder:TodoSortOrderType
};
  
  interface TodoState {
    todos: Todo[];
    todoFetching:boolean;
    todoUpdating:boolean;
    todoAdding:boolean;
    view: TodoViewType;
    filter:TodoFilter
  }