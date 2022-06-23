import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import NewEntry from './newEntry'
import ViewEntry from './viewEntry'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { toast } from "react-toastify"
import { Box, Container, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createRecord, updateRecord, deleteRecord, actions, getData } from './store'



const EntryBook = () => {

    const dispatch = useDispatch()

    const state = useSelector(state => state.entry)

    const [edit, setEdit] = useState(null)

    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        if (state?.loading === 'idle' && !!state?.message) {
            if (state.message === "Entry Created Successfully" || state.message === "Entry Updated Successfully") {
                toast.success(state.message)
            }
            else if (state.message === "Entry Deleted Successfully") {
                toast.warning(state.message)
            }
            else if (state.message === "Internal Servor Error") {
                toast.error(state.message)
            }
            else {
                toast.info("Something Went Wrong")
            }
            dispatch(actions.clearMessage())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.message])

    useEffect(() => {
        dispatch(getData(new Date()))  // get entries for today
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box>
            <Container maxWidth={false}>
                <Accordion sx={{ mb: 2 }} expanded={expanded} onChange={() => setExpanded(!expanded)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Button
                            variant="text"
                            color="primary"
                            component="span"
                        >
                            Add Entry +
                        </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <NewEntry
                            createRecord={createRecord}
                            updateRecord={updateRecord}
                            dispatch={dispatch}
                            edit={edit}
                            setEdit={setEdit}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            state={state}
                        />
                    </AccordionDetails>
                </Accordion>
                <Box sx={{ p: 2, background: '#ffffff' }}>
                    <ViewEntry
                        state={state}
                        setEdit={setEdit}
                        deleteRecord={deleteRecord}
                        dispatch={dispatch}
                        getData={getData}
                    />
                </Box>
            </Container>
        </Box>
    )
}

export default EntryBook