import { useRef, useState } from 'react'
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVert'


export default function UserMoreMenu({ onEdit, onDelete }) {

    const ref = useRef(null)

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' },
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem sx={{ color: 'text.secondary' }} onClick={() => {
                    setIsOpen(false)
                    onEdit()
                }}>
                    <ListItemIcon>
                        <ModeEditIcon
                            color="primary"
                        />
                    </ListItemIcon>
                    <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>

                <MenuItem sx={{ color: 'text.secondary' }} onClick={() => {
                    setIsOpen(false)
                    onDelete()
                }}>
                    <ListItemIcon>
                        <DeleteForeverTwoToneIcon
                            color="error"
                        />
                    </ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
        </>
    )
}