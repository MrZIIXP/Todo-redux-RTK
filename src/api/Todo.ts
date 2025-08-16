import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const TodoApi = createApi({
	reducerPath: 'todos',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://37.27.29.18:8001/' }),
	tagTypes: ['Todo'],
	endpoints: build => ({
		_Get_: build.query({
			query: () => `api/to-dos`,
			providesTags: ['Todo'],
		}),
		_Post_: build.mutation({
			query: data => ({
				url: 'api/to-dos',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Todo'],
		}),
		_Put_: build.mutation({
			query: data => ({
				url: 'api/to-dos',
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Todo'],
		}),
		_Delete_: build.mutation({
			query: id => ({
				url: `api/to-dos?id=${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Todo'],
		}),
		_Check_: build.mutation({
			query: ({ id, isCompleted }) => ({
				url: `completed?id=${id}`,
				method: 'PUT',
				body: { isCompleted },
			}),
			invalidatesTags: ['Todo'],
		}),
		_Delete_Image_: build.mutation({
			query: id => ({
				url: 'api/to-dos/images/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: ['Todo'],
		}),
		_Post_Image_: build.mutation({
			query: ({ id, image }) => ({
				url: 'api/to-dos/' + id + '/images',
				method: 'POST',
				body: image,
			}),
			invalidatesTags: ['Todo'],
		}),
	}),
})

export const {
	use_Get_Query,
	use_Post_Mutation,
	use_Put_Mutation,
	use_Check_Mutation,
	use_Delete_Mutation,
	use_Delete_Image_Mutation,
	use_Post_Image_Mutation,
} = TodoApi
