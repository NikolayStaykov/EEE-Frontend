import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, List, ListItem, ListItemText, Stack, Container, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";


export default function UserSearchModal({ userType, endpoint, onCloseListener, usesrsToRemove }) {

    const [users, setUsers] = useState([]);
    const [bookedUsers, setBookedUsers] = useState(usesrsToRemove)

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setUsers(users.filter(filterUsers))
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        onCloseListener();
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function filterUsers(value) {
        let id = value.universityId;
        let result = true;
        Array.from(bookedUsers).forEach(
            (user) => {
                if (user.universityId == id) {
                    result = false
                }
            }
        )
        return result;
    }

    const loadUsers = async () => {
        var apiEndpoint = userType === "Students" ? `http://localhost:8080/students` : `http://localhost:8080/teachers`;
        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setUsers(data);
    }

    useEffect(() => {
        loadUsers()
    }, [])

    return (
        <div>
            <Tooltip title={userType === "Students" ? "Add Student" : "AddTeacher"}>
                <IconButton onClick={handleOpen}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Stack direction='column' spacing={2}>
                        <Typography align='center'>{userType}</Typography>
                        <Container sx={{
                            background: 'rgb(145,211,133,0.5)',
                            border: '2',
                            minWidth: '400px',
                            minHeight: '600px',
                            maxHeight: '600px',
                            alignContent: 'top-center',
                            overflowY: 'auto'
                        }}>
                            <List dense={true}>
                                {users.map((user) =>
                                    <ListItem>
                                        <ListItemText
                                            primary={user.email}
                                            secondary={user.universityId}
                                        />
                                        <Tooltip title="Add">
                                            <IconButton onClick={() => { addUser(user.universityId) }}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItem>,
                                )}
                            </List>
                        </Container>
                    </Stack>
                </Box>
            </Modal>
        </div>
    )

    async function addUser(userIdToAdd) {
        console.log(userIdToAdd)
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: userIdToAdd })
        });
    }
}