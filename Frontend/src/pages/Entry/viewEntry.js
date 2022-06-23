import DataTable from 'react-data-table-component'
import Loading from '../../components/Loading'
import Menu from '../../components/Menu'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HighLight from 'react-highlighter'
import { useState } from 'react'
import { Box, TextField, InputAdornment, FormControl, OutlinedInput, Typography } from '@mui/material'
import { fDate } from '../../utils/formatTime'
import { deleteAlert } from '../../components/Alert'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'


const ViewEntry = ({ state, setEdit, deleteRecord, dispatch, getData }) => {

    const [date, setDate] = useState(new Date())

    const [search, setSearch] = useState("")

    const pending = state?.loading === 'pending'

    const columns = [
        {
            name: 'Date',
            center: true,
            width: '120px',
            cell: row => (
                <HighLight search={search}>
                    {`${fDate(row.created_at)}`}
                </HighLight>
            )
        },
        {
            name: 'Details',
            center: true,
            width: '300px',
            selector: row => (
                <Box>
                    <Box my={2}>
                        <HighLight search={search}>
                            {`${row.quantity} ${row.details} ${row.vendor.name} ${"x"} ${row.price}`}
                        </HighLight>
                    </Box>
                    <Box marginLeft={5} my={1}>
                        {row?.sales?.map((item, index) => (
                            <Box my={1} key={index}>
                                <HighLight search={search}>
                                    {`${item.quantity} ${item.details} ${item.customer.name} ${"x"} ${item.price}`}
                                </HighLight>
                            </Box>
                        ))}
                    </Box>
                </Box >
            )
        },
        {
            name: 'Purchases(₹)',
            center: true,
            minWidth: 100,
            selector: row => (
                <Box position="absolute" top={12}>
                    <HighLight search={search}>
                        {`₹ ${row.total}`}
                    </HighLight>
                </Box>
            )
        },
        {
            name: 'Sales(₹)',
            center: true,
            minWidth: 100,
            selector: row => (
                <Box>
                    <Box my={2} />
                    <Box marginLeft={5} my={1}>
                        {row?.sales?.map((item, index) => (
                            <Box my={1} key={index}>
                                <HighLight search={search}>
                                    {`₹ ${item.total}`}
                                </HighLight>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
        },
        {
            name: 'Profit(₹)',
            center: true,
            minWidth: 100,
            selector: row => (
                <Box position="absolute" top={12}>
                    <HighLight search={search}>
                        {`₹ ${(row?.sales?.reduce((total, item) => total + item.total, 0)) - (row?.total)}`}
                    </HighLight>
                </Box>
            )

        },
        {
            name: "Edit",
            center: true,
            cell: row => (
                <Menu
                    onEdit={() => {
                        setEdit(row)
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                    }}
                    onDelete={async () => {
                        const confirm = await deleteAlert()
                        if (confirm) {
                            dispatch(deleteRecord(row.id))
                        }
                        return
                    }}
                />
            )
        }
    ]

    const getProfit = () => (
        (state?.entryData?.reduce((total, row) => total + row?.sales?.reduce((sum, item) => sum + item.total, 0), 0))
        -
        (state?.entryData?.reduce((total, row) => total + row?.total, 0))
    )

    return (
        <Box>
            <Box
                position="fixed"
                bottom={15}
                right={15}
                sx={{
                    background: '#0ea200',
                    color: '#ffffff',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    zIndex: 999
                }}
            >
                {`Total Profit : ₹ ${getProfit() || 0}`}
            </Box>
            <Typography fontWeight="400" fontSize={{ xs: 16, md: 21 }} textAlign="center" my={2}>
                {`Entries for, ${fDate(state?.entryData[0]?.created_at || new Date())}`}
            </Typography>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Box>
                    <FormControl variant="outlined" sx={{ width: { xs: '150px', md: '200px' } }}>
                        <OutlinedInput
                            value={search}
                            size="small"
                            placeholder='Search Text'
                            className='my-search'
                            onChange={e => setSearch(e.target.value)}
                            startAdornment={(
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            )}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                    </FormControl>
                </Box>
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            inputFormat="dd/MM/yyyy"
                            value={date}
                            disableFuture={true}
                            onChange={async date => {
                                setDate(date)
                                await dispatch(getData(date))
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InsertInvitationIcon fontSize='small' />
                                    </InputAdornment>
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    sx={{ width: { xs: '135px', md: '145px' } }}
                                    className='my-date-picker'
                                    size='small'
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
            <DataTable
                columns={columns}
                data={state?.entryData}
                highlightOnHover
                progressPending={pending}
                progressComponent={<Loading />}
                paginationComponentOptions={{
                    noRowsPerPage: true
                }}
            />
        </Box>
    )
}

export default ViewEntry