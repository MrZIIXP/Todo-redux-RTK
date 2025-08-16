import { configureStore } from '@reduxjs/toolkit'
import { TodoApi } from './api/Todo'

export const store = configureStore({
	reducer: {
		[TodoApi.reducerPath]: TodoApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(TodoApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
