import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './slices/todoSlice'
import sidebarReducer from './slices/sidebarSlice'
import dialogReducer from './slices/dialogSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    user:userReducer,
    todos: todoReducer,
    sidebar:sidebarReducer,
    dialog:dialogReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
