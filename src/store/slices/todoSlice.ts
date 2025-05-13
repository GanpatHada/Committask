import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { AddToDo, EditToDo, Todo, TodoState } from "../../../types/todo";



const initialState: TodoState = {
  todos: [],
  todoFetching:true,
  todoUpdating:false,
  todoAdding:false,
  view: "ROWS",
  filter:{
    date:'ALL_TODOS',
    priority:[],
    includeCompleted:false,
    sortField:'SELECT',
    sortOrder:'ASC'
  },
};


export const fetchTodos = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>("todos/fetchTodos", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) {
      throw new Error("Failed to fetch todos");
    }
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch todos");
  }
});

export const addTodo = createAsyncThunk<Todo, AddToDo, { rejectValue: string }>(
  "todos/addTodo",
  async (todo, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(todo),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add todo");
    }
  }
);

export const deleteTodo = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("todos/deleteTodo", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete todo");
  }
});

export const updateTodo = createAsyncThunk<
  Todo,
  { updatedTodo: EditToDo; todoId: string },
  { rejectValue: string }
>("todos/updateTodo", async ({ todoId, updatedTodo }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/tasks/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) {
      throw new Error("Failed to update todo");
    }
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add todo");
  }
});


export const updateTodoStatus = createAsyncThunk<
  Todo,
  { completed:boolean; todoId: string },
  { rejectValue: string }
>("todos/updateTodoStatus", async ({ todoId,completed}, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/tasks/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({completed}),
    });

    if (!res.ok) {
      throw new Error("Failed to update todo");
    }
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    toast.success(result.message);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add todo");
  }
});


const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    toggleView: (state) => {
      state.view = state.view === "GRID" ? "ROWS" : "GRID";
    },
    applyDateFilter: (
      state,
      action: PayloadAction<"ALL_TODOS" | "TODAY" | "THIS_MONTH" | "THIS_WEEK">
    ) => {
      state.filter.date = action.payload;
    },
    applyPriorityFilter:(
      state,
      action: PayloadAction<"HIGH" | "MEDIUM" | "LOW">
    )=>{
      if(state.filter.priority.includes(action.payload))
      {
        state.filter.priority=state.filter.priority.filter(priority=>priority!==action.payload)
      }
      else
        state.filter.priority.push(action.payload)
    },
    toggleIncludeCompleted: (state) => {
      state.filter.includeCompleted = !state.filter.includeCompleted;
    },

    applySortFieldFilter:(state,action:PayloadAction<"PRIORITY" | "DEADLINE" | "SELECT">)=>{
        state.filter.sortField=action.payload
    },
    applySortOrderFilter:(state,action:PayloadAction<"ASC" | "DESC">)=>{
        state.filter.sortOrder=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.todoFetching = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        toast.error(action.payload || "unable to fetch todos");
        state.todoFetching = false;
      })

      //addTodo
      .addCase(addTodo.pending, (state) => {
        state.todoAdding = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        toast.success("Todo added successfully!");
        state.todoAdding = false;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.todoAdding = false;
        toast.error(action.payload || "unable to add todo");
      })

      // updateTodo
      .addCase(updateTodo.pending, (state) => {
        state.todoUpdating = true
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.todoUpdating = false
        const index = state.todos.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
        toast.success("Todo Updated successfully!");
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.todoUpdating = false
        toast.error(action.payload || "unable to update todo");
      })

      //updateTodoStatus

      .addCase(updateTodoStatus.pending, (state,action) => {
        const index = state.todos.findIndex((t) => t.id === action.meta.arg.todoId)
        if (index !== -1) {
          state.todos[index].loading=true
        }
      })
      .addCase(updateTodoStatus.fulfilled, (state, action) => {
        state.todoUpdating = false
        const index = state.todos.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index].loading=false
          state.todos[index] = action.payload
        }
      })
      .addCase(updateTodoStatus.rejected, (state, action) => {
        const todo = state.todos.find((todo) => todo.id === action.meta.arg.todoId);
        if (todo) todo.loading = false;
        toast.error(action.payload || "unable to update status");
      })

      // deleteTodo
      .addCase(deleteTodo.pending, (state, action) => {
        const todo = state.todos.find((todo) => todo.id === action.meta.arg);
        if (todo) todo.loading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        toast.success("Todo deleted successfully!");
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        const todo = state.todos.find((todo) => todo.id === action.meta.arg);
        if (todo) todo.loading = false;
        toast.error(action.payload || "unable to delete todo");
      });
  },
});

export const { toggleView, applyDateFilter,applyPriorityFilter,toggleIncludeCompleted,applySortFieldFilter,applySortOrderFilter} = todoSlice.actions;
export default todoSlice.reducer;
