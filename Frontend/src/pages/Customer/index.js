import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Modal,
    TextField,
    Card,
    Stack,
    Container,
    FormControl,
    OutlinedInput,
    InputAdornment
} from '@mui/material'
import { sentenceCase } from '../../utils/avail'
import { deleteAlert } from '../../components/Alert'
import { toast } from "react-toastify"
import axios from 'axios'
import Page from '../../components/Page'
import AddIcon from '@mui/icons-material/Add'
import Label from '../../components/Label'
import DataTable from 'react-data-table-component'
import Loading from '../../components/Loading'
import Menu from '../../components/Menu'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 250,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
}

const Customer = () => {

    const [customer, setCustomer] = useState({ id: null, name: '' })

    const [error, setError] = useState(false)

    const [userList, setUserList] = useState([])

    const [filterdUser, setFilteredUser] = useState([])

    const [pending, setPending] = useState(true)

    const [modal, setModal] = useState(false)

    const [refetchUser, setRefetchUser] = useState(false)

    const [search, setSearch] = useState('')

    const createCustomer = async () => {
        try {
            const response = await axios.post('/api/customer/', { name: sentenceCase(customer.name) })
            if (response?.status === 201) {
                toast.success("Customer Created Successfully")
                return true
            }
            toast.error("Internal Server Error")
            return false
        } catch (e) {
            toast.info("Something Went Wrong")
        }
    }

    const updateCustomer = async () => {
        try {
            const response = await axios.put(`/api/customer/${customer.id}/`, { name: sentenceCase(customer.name) })
            if (response?.status === 200) {
                toast.success("Customer Updated Successfully")
                return true
            }
            toast.error("Internal Server Error")
            return false
        } catch (e) {
            toast.info("Something Went Wrong")
        }
    }

    const deleteCustomer = async id => {
        try {
            const confirm = await deleteAlert()
            if (confirm) {
                const response = await axios.delete(`/api/customer/${id}/`)
                if (response?.status === 204) {
                    toast.warning("Customer Deleted Successfully")
                    setRefetchUser(!refetchUser)
                    return true
                }
            }
            toast.error("Internal Server Error")
            return false
        } catch (e) {
            toast.info("Something Went Wrong")
        }
    }

    const searchCustomer = ({ target }) => {
        setSearch(target.value)
        if (target.value !== "") {
            setFilteredUser(userList.filter(user => user.name.toLowerCase().includes(target.value.toLowerCase())))
            return
        }
        setFilteredUser(userList)
    }

    const handleSubmit = async e => {
        e?.preventDefault()
        if (customer.name.length) {
            setPending(true)
            const resp = await (!customer.id ? createCustomer() : updateCustomer())
            if (resp) {
                setRefetchUser(!refetchUser)
                setPending(false)
                setCustomer('')
                setModal(!modal)
            }
            return
        }
        setError(true)
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await axios.get('/api/customer/')
            if (response?.status === 200) {
                setUserList(response?.data)
                setFilteredUser(response?.data)
                setPending(false)
            }
        }
        fetchCustomers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchUser])

    const columns = [
        {
            name: 'S.No.',
            center: true,
            maxWidth: 100,
            cell: (row, index) => `${index + 1}`
        },
        {
            name: 'Full Name',
            center: true,
            width: '150px',
            selector: row => `${row?.name}`
        },
        {
            name: 'Status',
            center: true,
            width: '150px',
            selector: row => (
                <Box marginLeft={5}>
                    <Label variant="ghost" color={(!row?.status && 'error') || 'success'}>
                        {row?.status ? "Active" : "Inactive"}
                    </Label>
                </Box>
            )
        },
        {
            name: "Edit",
            center: true,
            maxWidth: 100,
            cell: row => (
                <Menu
                    onEdit={() => {
                        setCustomer(row)
                        setModal(!modal)
                    }}
                    onDelete={() => deleteCustomer(row?.id)}
                />
            )
        }
    ]

    return (
        <Page title="Customer">
            <Modal
                open={modal}
                onClose={() => setModal(!modal)}
            >
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box sx={style}>
                        <TextField
                            fullWidth
                            size='small'
                            placeholder='Full Name'
                            className='my-text-input'
                            name='name'
                            value={customer.name}
                            error={error}
                            helperText={error ? "This field is required." : null}
                            onChange={e => {
                                setCustomer({ ...customer, [e.target.name]: e.target.value })
                                setError(false)
                            }}
                        />
                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            type="submit"
                            variant="contained"
                            disabled={pending}
                        >
                            {pending ? "SAVING" : "SAVE"}
                        </Button>
                    </Box>
                </form>
            </Modal>
            <Container>
                <Card sx={{ p: { xs: 3, md: 5 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Button variant="contained" onClick={() => setModal(!modal)} startIcon={<AddIcon />}>
                            New Customer
                        </Button>
                        <FormControl sx={{ width: { xs: '150px', md: '200px' } }} variant="outlined">
                            <OutlinedInput
                                value={search}
                                size="small"
                                placeholder='Search'
                                className='my-search'
                                onChange={searchCustomer}
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon />
                                    </InputAdornment>
                                )}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                            />
                        </FormControl>
                    </Stack>
                    <DataTable
                        columns={columns}
                        data={filterdUser}
                        highlightOnHover
                        pagination
                        paginationPerPage={5}
                        progressPending={pending}
                        progressComponent={<Loading />}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                    />
                </Card>
            </Container>
        </Page>
    )
}


export default Customer