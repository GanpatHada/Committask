import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

export interface Todo {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  updatedAt: string
  createdAt:string
  priority:string
  userId:string
  loading?:boolean
}

export interface AddToDo{
  title: string
  description: string
  dueDate: string
  priority:string
}

export type TodoFilterType='ALL_TODOS' | 'TODAY' | 'THIS_MONTH' | 'THIS_WEEK'



interface TodoState {
  todos: Todo[]
  loading:{
    read:boolean,
    update:boolean,
    create:boolean
  }
  view:'GRID' | 'ROWS'
  filter : TodoFilterType
}

const initialState: TodoState = {
  todos: [],
  loading:{
    read:false,
    update:false,
    create:false
  },
  view:'ROWS',
  filter :'ALL_TODOS' 
}

// Async thunks

export const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch todos');
      }
      const result = await res.json();
      if(!result.success)
        throw new Error(result.message)
      return result.data;
    } catch (error:any) {
      return rejectWithValue(error.message || 'Failed to fetch todos');
    }

  }
);

export const addTodo = createAsyncThunk<Todo, AddToDo, { rejectValue: string }>(
  'todos/addTodo',
  async (todo, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(todo),
      });

      if (!res.ok) {
        throw new Error('Failed to add todo');
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add todo');
    }
  }
);

export const deleteTodo = createAsyncThunk<string, string,{ rejectValue: string }>(
  'todos/deleteTodo', 
  async (id,{rejectWithValue}) => {
  try {
   const res = await fetch(`/api/tasks/${id}`, {
     method: 'DELETE',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
   })
   if (!res.ok) throw new Error('Failed to delete todo')
    const result = await res.json();
   if (!result.success) {
     throw new Error(result.message);
   }
   return result.data;
 } catch (error:any) {
  return rejectWithValue(error.message || 'Failed to delete todo');
 }
})



export const updateTodo = createAsyncThunk<Todo, Todo>('todos/updateTodo', async (todo) => {
  const res = await fetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
})



const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleView: (state) => {
      state.view = state.view === 'GRID' ? 'ROWS' : 'GRID';
    },
    applyFilter:(state,action: PayloadAction<'ALL_TODOS' | 'TODAY' | 'THIS_MONTH' | 'THIS_WEEK'>)=>{
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.loading.read = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload
        state.loading.read = false
        
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        toast.error(action.payload || 'unable to fetch todos')
        state.loading.read = false
      })

      //addTodo
      .addCase(addTodo.pending, (state) => {
        state.loading.create=true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload)
        toast.success('Todo added successfully!')
        state.loading.create=false;
      })
      .addCase(addTodo.rejected, (state, action) => {
         state.loading.create=false;
        toast.error(action.payload || 'unable to add todo')
      })

      // // updateTodo
      // .addCase(updateTodo.pending, (state) => {
      //   state.status = 'loading'
      // })
      // .addCase(updateTodo.fulfilled, (state, action) => {
      //   state.status = 'succeeded'
      //   const index = state.todos.findIndex((t) => t.id === action.payload.id)
      //   if (index !== -1) {
      //     state.todos[index] = action.payload
      //   }
      // })
      // .addCase(updateTodo.rejected, (state, action) => {
      //   state.status = 'failed'
      //   state.error = action.error.message || 'Failed to update todo'
      // })

      // deleteTodo
      .addCase(deleteTodo.pending, (state,action) => {
        const todo = state.todos.find((todo) => todo.id === action.meta.arg);
        if (todo) todo.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        toast.success('Todo deleted successfully!')
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        const todo = state.todos.find((todo) => todo.id === action.meta.arg);
        if (todo) todo.loading = false;
        toast.error(action.payload || 'unable to delete todo')
      })
  },
})

export const { toggleView,applyFilter} = todoSlice.actions
export default todoSlice.reducer
