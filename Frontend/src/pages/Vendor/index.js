import { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import Page from '../../components/Page';
import AddIcon from '@mui/icons-material/Add';
import Label from '../../components/Label';
import DataTable from 'react-data-table-component';
import Loading from '../../components/Loading';
import Menu from '../../components/Menu';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { sentenceCase } from '../../utils/avail';
import { deleteAlert } from '../../components/Alert';
import { toast } from "react-toastify"


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
};



const Vendor = () => {

  const [vendor, setVendor] = useState({ id: null, name: '' })

  const [error, setError] = useState(false);

  const [userList, setUserList] = useState([]);

  const [filterdUser, setFilteredUser] = useState([])

  const [pending, setPending] = useState(true);

  const [modal, setModal] = useState(false);

  const [refetchUser, setRefetchUser] = useState(false);

  const [search, setSearch] = useState('')

  const createVendor = async () => {
    try {
      const response = await axios.post('/api/vendor/', { name: sentenceCase(vendor.name) });
      if (response?.status === 201) {
        toast.success("Vendor Created Successfully")
        return true
      }
      toast.error("Internal Server Error")
      return false
    } catch (e) {
      toast.info("Something Went Wrong")
    }
  }

  const updateVendor = async () => {
    try {
      const response = await axios.put(`/api/vendor/${vendor.id}/`, { name: sentenceCase(vendor.name) });
      if (response?.status === 200) {
        toast.success("Vendor Updated Successfully")
        return true
      }
      toast.error("Internal Server Error")
      return false
    } catch (e) {
      toast.info("Something Went Wrong")
    }
  }

  const deleteVendor = async id => {
    try {
      const confirm = await deleteAlert();
      if (confirm) {
        const response = await axios.delete(`/api/vendor/${id}/`);
        if (response?.status === 204) {
          toast.warning("Vendor Deleted Successfully")
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

  const searchVendor = e => {
    setSearch(e.target.value)
    if (e.target.value !== "") {
      setFilteredUser(userList.filter((user) => user.name.toLowerCase().includes(e.target.value.toLowerCase())
      ));
    }
    else {
      setFilteredUser(userList)
    }
  }

  const handleSubmit = async e => {
    e?.preventDefault()
    if (vendor.name.length) {
      setPending(true)
      const resp = await (!vendor.id ? createVendor() : updateVendor())
      if (resp) {
        setRefetchUser(!refetchUser)
        setPending(false)
        setVendor('')
        setModal(!modal)
      }
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await axios.get('/api/vendor/');
      if (response?.status === 200) {
        setUserList(response?.data)
        setFilteredUser(response?.data)
        setPending(false)
      }
    };
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchUser])

  const columns = [
    {
      name: 'S.No.',
      center: true,
      maxWidth: 100,
      cell: (row, index) => index + 1
    },
    {
      name: 'Full Name',
      center: true,
      width: '150px',
      selector: row => row?.name
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
            setVendor(row)
            setModal(!modal)
          }}
          onDelete={() => deleteVendor(row?.id)}
        />
      )
    }
  ];

  return (
    <Page title="Vendor">
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
              value={vendor.name}
              error={error}
              helperText={error ? "This field is required." : null}
              onChange={e => {
                setVendor({ ...vendor, [e.target.name]: e.target.value });
                setError(false);
              }}
            />
            <Button fullWidth sx={{ mt: 2 }} type="submit" variant="contained" disabled={pending} >
              {pending ? "SAVING" : "SAVE"}
            </Button>
          </Box>
        </form>
      </Modal>
      <Container>
        <Card sx={{ p: { xs: 3, md: 5 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Button variant="contained" onClick={() => setModal(!modal)} startIcon={<AddIcon />}>
              New Vendor
            </Button>
            <FormControl variant="outlined" sx={{ width: { xs: '150px', md: '200px' } }}>
              <OutlinedInput
                value={search}
                size="small"
                className='my-search'
                placeholder='Search'
                onChange={searchVendor}
                startAdornment={<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>}
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


export default Vendor