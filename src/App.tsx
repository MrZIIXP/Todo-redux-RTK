import { useEffect, useState } from 'react'
import { Avatar, Button, Card, Drawer, Empty, Image, Spin } from 'antd'
import {
	use_Check_Mutation,
	use_Delete_Image_Mutation,
	use_Delete_Mutation,
	use_Get_Query,
	use_Post_Image_Mutation,
	use_Post_Mutation,
	use_Put_Mutation,
} from './api/Todo'
import { LoadingOutlined } from '@ant-design/icons'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './components/ui/dialog'
import Meta from 'antd/es/card/Meta'
import { Label } from './components/ui/label'
import { useForm } from 'react-hook-form'
import { Input } from './components/ui/input'
import { Info, Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const PageNumbers = ({ page, setPage, totalPages }) => {
	const pages = []
	const maxVisiblePages = 5

	let startPage = Math.max(1, page - 2)
	let endPage = Math.min(totalPages, page + 2)

	if (page <= 3) {
		endPage = Math.min(5, totalPages)
	} else if (page >= totalPages - 2) {
		startPage = Math.max(totalPages - 4, 1)
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(
			<Button
				key={i}
				type={i === page ? 'primary' : 'default'}
				onClick={() => setPage(i)}
			>
				{i}
			</Button>
		)
	}

	return <>{pages}</>
}

const App = () => {
	const [size, setSize] = useState(6)
	const [page, setPage] = useState(1)
	const Get = use_Get_Query()
	let totalPages = Math.floor(Get.data?.data?.length / size) || 1
	const [Post, posts] = use_Post_Mutation()
	const [Put, puts] = use_Put_Mutation()
	const [Delete, deletes] = use_Delete_Mutation()
	const [Check, checks] = use_Check_Mutation()
	const [Add_Image, add_img] = use_Post_Image_Mutation()
	const [Del_Image, del_img] = use_Delete_Image_Mutation()

	const [AddOP, setAddOP] = useState(false)
	const [Add_imgOP, setAdd_imgOP] = useState(false)
	const [checkID, setcheckID] = useState(null)
	const [EditOP, setEditOP] = useState(false)
	const [DrawerOP, setDrawerOP] = useState(false)
	const [Edit_data, setEdit] = useState<any>({})
	useEffect(() => {
		totalPages = Math.ceil(Get.data?.data?.length / size) || 1
	}, [Get.isFetching, Get.isLoading])
	const Add = useForm({
		defaultValues: {
			name: '',
			description: '',
			images: [],
			isCompleted: false,
		},
	})

	const Add_img = useForm({
		defaultValues: {
			images: [],
		},
	})

	const Edit = useForm({
		defaultValues: {
			name: '',
			description: '',
		},
	})

	const onAddSubmit = (data: any) => {
		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('description', data.description)
		formData.append('isCompleted', data.isCompleted)
		Array.from(data.images).forEach((image: any) => {
			formData.append('images', image)
		})
		setAddOP(false)
		Add.reset()
		Post(formData)
	}

	const onAdd_imgSubmit = (data: any) => {
		const formData = new FormData()
		Array.from(data.images).forEach((image: any) => {
			formData.append('images', image)
		})
		setAdd_imgOP(false)
		Add_img.reset()
		Add_Image({ id: Edit_data?.id, image: formData })
	}
	const onEditSubmit = (data: any) => {
		Put({ ...data, id: Edit_data?.id })
		Edit.reset()
		setEditOP(false)
	}
	const openEdit = data => {
		Edit.reset({
			name: data.name,
			description: data.description,
		})
	}

	return (
		<div className='flex flex-col items-center min-h-screen pb-[60px] bg-gray-800'>
			<div className='flex flex-col items-center py-20 bg-gradient-to-tr from-blue-800 text-white w-full to-black'>
				<b className='text-[32px]'>Todo List</b>
				<h1 className='text-[25px]'>You can add a new Todo</h1>
				<br />
				<div className='flex gap-3'>
					<Dialog open={AddOP} onOpenChange={setAddOP}>
						<DialogTrigger>
							<Button type='primary' size='large'>
								Add
							</Button>
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Todo</DialogTitle>
							</DialogHeader>

							<form
								id='Add'
								className='flex flex-col gap-9'
								onSubmit={Add.handleSubmit(onAddSubmit)}
							>
								<div className='flex relative flex-col gap-3'>
									<Label htmlFor='name'>Name</Label>
									<Input
										id='name'
										placeholder='Name'
										{...Add.register('name', {
											required: 'This field is required',
											minLength: {
												value: 3,
												message: 'Name must be at least 3 characters',
											},
										})}
									/>
									{Add.formState.errors.name && (
										<b className='absolute text-red-500 bottom-[-25px]'>
											{Add.formState.errors.name.message}
										</b>
									)}
								</div>

								<div className='flex relative flex-col gap-3'>
									<Label htmlFor='desc'>Description</Label>
									<Input
										id='desc'
										placeholder='Description'
										{...Add.register('description', {
											required: 'This field is required',
											minLength: {
												value: 3,
												message: 'Name must be at least 3 characters',
											},
										})}
									/>
									{Add.formState.errors.description && (
										<b className='absolute text-red-500 bottom-[-25px]'>
											{Add.formState.errors.description.message}
										</b>
									)}
								</div>

								<div className='flex relative flex-col gap-3'>
									<Label htmlFor='img'>Images</Label>
									<Input
										id='img'
										multiple
										type='file'
										{...Add.register('images', {
											required: 'This field is required',
											min: {
												value: 1,
												message: 'Name must be at least 1 file',
											},
										})}
									/>
									{Add.formState.errors.images && (
										<b className='absolute text-red-500 bottom-[-25px]'>
											{Add.formState.errors.images.message}
										</b>
									)}
								</div>
							</form>

							<DialogFooter>
								<Button type='primary' form='Add' htmlType='submit'>
									Add
								</Button>
								<Button
									onClick={() => setAddOP(false)}
									danger
									color='red'
									variant='outlined'
								>
									Cancel
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<Button
						type='primary'
						loading={Get.isFetching}
						size='large'
						disabled={Get.isFetching}
						className='text-white'
						onClick={() => Get.refetch()}
					>
						Reload
					</Button>
				</div>
			</div>

			<Dialog open={Add_imgOP} onOpenChange={setAdd_imgOP}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Images into {Edit_data?.name}</DialogTitle>
					</DialogHeader>

					<form
						id='Add_img'
						className='flex flex-col gap-9'
						onSubmit={Add_img.handleSubmit(onAdd_imgSubmit)}
					>
						<div className='flex relative flex-col gap-3'>
							<Label htmlFor='img'>Images</Label>
							<Input
								id='img'
								multiple
								type='file'
								{...Add_img.register('images', {
									required: 'This field is required',
									min: {
										value: 1,
										message: 'Name must be at least 1 file',
									},
								})}
							/>
							{Add_img.formState.errors.images && (
								<b className='absolute text-red-500 bottom-[-25px]'>
									{Add_img.formState.errors.images.message}
								</b>
							)}
						</div>
					</form>

					<DialogFooter>
						<Button type='primary' form='Add_img' htmlType='submit'>
							Add Images
						</Button>
						<Button
							onClick={() => setAdd_imgOP(false)}
							danger
							color='red'
							variant='outlined'
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={EditOP} onOpenChange={setEditOP}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Todo</DialogTitle>
					</DialogHeader>

					<form
						id='Edit'
						className='flex flex-col gap-9'
						onSubmit={Edit.handleSubmit(onEditSubmit)}
					>
						<div className='flex relative flex-col gap-3'>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								placeholder='Name'
								{...Edit.register('name', {
									required: 'This field is required',
									minLength: {
										value: 3,
										message: 'Name must be at least 3 characters',
									},
								})}
							/>
							{Edit.formState.errors.name && (
								<b className='absolute text-red-500 bottom-[-25px]'>
									{Edit.formState.errors.name.message}
								</b>
							)}
						</div>

						<div className='flex relative flex-col gap-3'>
							<Label htmlFor='desc'>Description</Label>
							<Input
								id='desc'
								placeholder='Description'
								{...Edit.register('description', {
									required: 'This field is required',
									minLength: {
										value: 3,
										message: 'Name must be at least 3 characters',
									},
								})}
							/>
							{Edit.formState.errors.description && (
								<b className='absolute text-red-500 bottom-[-25px]'>
									{Edit.formState.errors.description.message}
								</b>
							)}
						</div>
					</form>

					<DialogFooter>
						<Button type='primary' form='Edit' htmlType='submit'>
							Edit
						</Button>
						<Button
							onClick={() => setEditOP(false)}
							danger
							color='red'
							variant='outlined'
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Drawer open={DrawerOP} onClose={() => setDrawerOP(false)}>
				{Edit_data && (
					<>
						<Swiper
							modules={[Autoplay]}
							autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
							loop={true}
						>
							{Edit_data?.images?.map((image: any) => (
								<SwiperSlide
									key={image.id}
									onDoubleClick={async () => {
										try {
											await Del_Image(image.id)
										} finally {
											setEdit(
												Edit_data.images.filter(
													(item: any) => item.id !== image.id
												)
											)
										}
									}}
								>
									<img
										src={'http://37.27.29.18:8001//images/' + image.imageName}
										className='w-full h-full'
									/>
								</SwiperSlide>
							))}
						</Swiper>

						<div className='flex flex-col gap-3'>
							<h1 className='text-[25px]'>{Edit_data.name}</h1>
							<p className='text-[18px]'>{Edit_data.description}</p>
							<Button
								color={!Edit_data.isCompleted ? 'red' : 'green'}
								variant='filled'
								loading={checks.isLoading && checkID === Edit_data.id}
								onClick={async () => {
									setcheckID(Edit_data.id)
									try {
										await Check({
											id: Edit_data.id,
											isCompleted: !Edit_data.isCompleted,
										})
									} finally {
										setEdit((prev: any) => ({
											...prev,
											isCompleted: !prev.isCompleted,
										}))
									}
								}}
							>
								{!Edit_data.isCompleted ? 'Not Completed' : 'Completed'}
							</Button>
							<Button
								color='orange'
								variant='filled'
								size='large'
								onClick={() => {
									setEditOP(true)
									setDrawerOP(false)
									openEdit(Edit_data)
								}}
							>
								Edit
							</Button>
							<Button
								color='blue'
								variant='outlined'
								size='large'
								onClick={() => {
									setAdd_imgOP(true)
									setDrawerOP(false)
								}}
							>
								Add images
							</Button>
						</div>
					</>
				)}
			</Drawer>

			<div
				className={`flex flex-col items-center p-5 w-[90%] min-h-[400px] mx-auto border-2 rounded-lg mt-20`}
			>
				{Get.isError || Get.isLoading ? (
					Get.isFetching ? (
						<LoadingOutlined
							style={{ fontSize: 100 }}
							spin
							className='my-auto text-white'
						/>
					) : (
						<>{Get.error}</>
					)
				) : Get.data.data.length > 0 ? (
					<div className='w-full flex flex-col justify-between items-center'>
						<div className={`grid grid-cols-3 gap-4 w-full`}>
							{posts.isLoading && (
								<Card
									hoverable
									loading
									cover={
										<div className='w-full h-[200px] flex justify-center items-center'>
											<LoadingOutlined spin className='text-[200px]' />
										</div>
									}
								></Card>
							)}
							{Array.from(Get.data.data)
								.reverse()
								.slice(0 + page * size, size + page * size)
								.map((item: any) => (
									<Card
										key={item.id}
										className='hover:scale-105 transition-all duration-300'
										cover={
											<Image
												className='w-full rounded-t-lg object-cover'
												height={200}
												src={
													'http://37.27.29.18:8001//images/' +
													item.images[1]?.imageName
												}
												fallback='data:image/png;base64,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'
											/>
										}
										actions={[
											<Button
												color={!item.isCompleted ? 'red' : 'green'}
												variant='filled'
												loading={checks.isLoading && checkID === item.id}
												onClick={() => {
													setcheckID(item.id)
													Check({ id: item.id, isCompleted: !item.isCompleted })
												}}
											>
												{!item.isCompleted ? 'Not Completed' : 'Completed'}
											</Button>,
											<Button
												color='red'
												variant='outlined'
												onClick={() => {
													Delete(item.id), setcheckID(item.id)
												}}
											>
												{deletes.isLoading && checkID === item.id ? (
													<>
														<LoadingOutlined spin /> deleting
													</>
												) : (
													<Trash2 />
												)}
											</Button>,
											<Button
												color='blue'
												variant='outlined'
												onClick={() => {
													setDrawerOP(true), setEdit(item)
												}}
											>
												<Info />
											</Button>,
										]}
									>
										<Meta
											description={item.description}
											title={item.name}
											avatar={
												<Avatar
													src={
														'http://37.27.29.18:8001//images/' +
														item.images[0]?.imageName
													}
												/>
											}
										/>
									</Card>
								))}
						</div>
						<div className='flex justify-center mt-4 gap-2'>
							<Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
								Назад
							</Button>

							<PageNumbers
								page={page}
								setPage={setPage}
								totalPages={totalPages}
							/>

							<Button
								disabled={page === totalPages}
								onClick={() => setPage(p => p + 1)}
							>
								Вперед
							</Button>
						</div>
					</div>
				) : (
					<div className='text-white'>
						<Empty
							image={Empty.PRESENTED_IMAGE_DEFAULT}
							className='w-full scale-150 mt-20'
							description={<p className='text-white'>Data is empty</p>}
						>
							<Button type='primary' onClick={() => setAddOP(true)}>
								Add new
							</Button>
						</Empty>
					</div>
				)}
			</div>
		</div>
	)
}

export default App
