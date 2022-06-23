import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { formatDate } from '../../../utils/formatTime'
import axios from 'axios'

export const getData = createAsyncThunk('shift/getData', async params => {
    const response = await axios.get(`/api/entry/list/?created_at=${formatDate(params)}`)
    return response
})

export const createRecord = createAsyncThunk('entry/createRecord', async (data, { dispatch }) => {
    const response = await axios.post('/api/entry/', data)
    await dispatch(getData(new Date()))
    return response
})

export const updateRecord = createAsyncThunk('entry/updateRecord', async (data, { dispatch }) => {
    const response = await axios.put('/api/entry/', data)
    await dispatch(getData(new Date()))
    return response
})

export const deleteRecord = createAsyncThunk('entry/deleteRecord', async (id, { dispatch }) => {
    const response = await axios.delete(`/api/entry/${id}/`)
    await dispatch(getData(new Date()))
    return response
})

export const entrySlice = createSlice({
    name: 'entry',
    initialState: {
        message: null,
        loading: 'idle',
        currentRequestId: undefined,
        entryData: []
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: state => {
            state.message = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getData.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.entryData = action?.payload?.data || []
            })
            .addCase(createRecord.pending, (state, action) => {
                if (state.loading === 'idle') {
                    state.loading = 'pending'
                    state.currentRequestId = action.meta.requestId
                }
            })
            .addCase(createRecord.fulfilled, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.currentRequestId = undefined
                    state.message = "Entry Created Successfully"
                }
            })
            .addCase(createRecord.rejected, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.message = "Internal Servor Error"
                    state.currentRequestId = undefined
                }
            })
            .addCase(updateRecord.pending, (state, action) => {
                if (state.loading === 'idle') {
                    state.loading = 'pending'
                    state.currentRequestId = action.meta.requestId
                }
            })
            .addCase(updateRecord.fulfilled, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.currentRequestId = undefined
                    state.message = "Entry Updated Successfully"
                }
            })
            .addCase(updateRecord.rejected, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.message = "Internal Servor Error"
                    state.currentRequestId = undefined
                }
            })
            .addCase(deleteRecord.pending, (state, action) => {
                if (state.loading === 'idle') {
                    state.loading = 'pending'
                    state.currentRequestId = action.meta.requestId
                }
            })
            .addCase(deleteRecord.fulfilled, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.currentRequestId = undefined
                    state.message = "Entry Deleted Successfully"
                }
            })
            .addCase(deleteRecord.rejected, (state, action) => {
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === action.meta.requestId
                ) {
                    state.loading = 'idle'
                    state.message = "Internal Servor Error"
                    state.currentRequestId = undefined
                }
            })
    }
})

export const actions = entrySlice.actions

export default entrySlice.reducer
