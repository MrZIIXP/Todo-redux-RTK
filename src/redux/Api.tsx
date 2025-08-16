import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const Get = createAsyncThunk('api/Get', async () => {
	const response = await axios.get('http://37.27.29.18:8001/api/to-dos')
	return response.data.data
})

export const Post = createAsyncThunk('api/Post', async (data: any) => {
	await axios.post('http://37.27.29.18:8001/api/to-dos', data)
	const response = await axios.get('http://37.27.29.18:8001/api/to-dos')
	return response.data.data
})
export const Delete = createAsyncThunk('api/Delete', async (id: any) => {
	await axios.delete(`http://37.27.29.18:8001/api/to-dos?id=${id}`)
	const response = await axios.get('http://37.27.29.18:8001/api/to-dos')
	return response.data.data
})
export const Update = createAsyncThunk('api/Update', async (data: any) => {
	await axios.put(`http://37.27.29.18:8001/api/to-dos`, data)
	const response = await axios.get('http://37.27.29.18:8001/api/to-dos')
	return response.data.data
})
export const Check = createAsyncThunk(
	'api/Check',
	async (id: any, status: any) => {
		await axios.put(`http://37.27.29.18:8001/completed?id=%${id}`, { status })
		const response = await axios.get('http://37.27.29.18:8001/api/to-dos')
		return response.data.data
	}
)

interface Api {
	data: []
	error: string | null
	loading: boolean
}

const initialState: Api = {
	data: [],
	error: null,
	loading: false,
}

export const Apis = createSlice({
	name: 'api',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(Get.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(Get.fulfilled, (state, action) => {
				state.loading = false
				state.data = action.payload
			})
			.addCase(Get.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка при получении'
			})

			.addCase(Post.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(Post.fulfilled, (state, action) => {
				state.loading = false
				state.data = action.payload
			})
			.addCase(Post.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка при добавлении'
			})

			.addCase(Delete.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(Delete.fulfilled, (state, action) => {
				state.loading = false
				state.data = action.payload
			})
			.addCase(Delete.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка при удалении'
			})

			.addCase(Update.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(Update.fulfilled, (state, action) => {
				state.loading = false
				state.data = action.payload
			})
			.addCase(Update.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка при обновлении'
			})

			.addCase(Check.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(Check.fulfilled, (state, action) => {
				state.loading = false
				state.data = action.payload
			})
			.addCase(Check.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка при изменении статуса'
			})
	},
})

export default Apis.reducer
