import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, List, ListItem, ListItemText, Stack, Container, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QuestionSetModalDialog from './QuestionSetModalDialog';
import UserSearchModal from './UserSearchModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1600,
    height: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function NewDisciplineModalDialog({ disciplne, edit, onCloseListener }) {

    const [disciplneName, setDisciplineName] = useState(disciplne.disciplineName)
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [questionSets, setQuestionSets] = useState([])

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        onCloseListener();
    }
    const loadQuestionSets = async () => {
        const response = await fetch(`http://localhost:8080/questionSets?disciplineId=${disciplne.disciplineId}&loadQuestions=true`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setQuestionSets(data)
    }

    const loadStudents = async () => {
        const response = await fetch(`http://localhost:8080/disciplines/${disciplne.disciplineId}/students`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setStudents(data)
    }

    const loadTeachers = async () => {
        const response = await fetch(`http://localhost:8080/disciplines/${disciplne.disciplineId}/teachers`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setTeachers(data)
    }

    const saveDiscipline = async () => {
        if (disciplne.disciplineId === 0) {
            const response = await fetch(`http://localhost:8080/disciplines`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ disciplineName: disciplneName })
            });
            console.log(response);
        } else {
            const response = await fetch(`http://localhost:8080/disciplines/${disciplne.disciplineId}`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    disciplineName: disciplneName,
                    disciplineId: disciplne.disciplineId
                })
            });
            console.log(response);
        }
    }

    useEffect(() => {
        setDisciplineName(disciplne.disciplineName)
        loadQuestionSets()
        loadStudents()
        loadTeachers()
    }, [])

    function updateName(name) {
        setDisciplineName(name);
        console.log(disciplneName);
    }

    return (
        <div>
            <Tooltip title={edit ? "Edit discipline" : "Add new discipline"}>
                <IconButton onClick={handleOpen}>
                    {edit ? <EditIcon /> : <AddIcon />}
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {edit ? "Edit Discipline" : "Add new Discipline"}
                    </Typography>
                    <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={disciplneName}
                        onChange={(event) => {
                            updateName(event.target.value);
                        }} />
                    <Stack direction='row' spacing={21}>
                        <Stack direction='column' spacing={2}>
                            <Typography align='center'>Question sets</Typography>
                            <Container sx={{
                                background: 'rgb(145,211,133,0.5)',
                                border: '2',
                                minWidth: '400px',
                                minHeight: '600px',
                                alignContent: 'top-center',
                                overflowY: 'auto'
                            }}>
                                <List dense={true}>
                                    {questionSets.map((questionSet) =>
                                        <ListItem>
                                            <ListItemText
                                                primary={questionSet.name}
                                                secondary={questionSet.id}
                                            />
                                            <Tooltip title="Delete question set">
                                                <IconButton onClick={deleteQuestionSet(questionSet.questionSetId)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <QuestionSetModalDialog questionSet={questionSet} edit={true} parentId={questionSet.parentQuestionSetId} />
                                        </ListItem>,
                                    )}
                                </List>
                                <QuestionSetModalDialog questionSet={{
                                    "questionSetName": "",
                                    "questionSetId": "",
                                    "disciplineId": disciplne.disciplineId
                                }} edit={false} parentId={null} />
                            </Container>
                        </Stack>
                        <Stack direction='column' spacing={2}>
                            <Typography align='center'>Teachers</Typography>
                            <Container sx={{
                                background: 'rgb(145,211,133,0.5)',
                                border: '2',
                                minWidth: '400px',
                                minHeight: '600px',
                                alignContent: 'top-center',
                                overflowY: 'auto'
                            }}>
                                <List dense={true}>
                                    {teachers.map((teacher) =>
                                        <ListItem>
                                            <ListItemText
                                                primary={teacher.email}
                                                secondary={teacher.universityId}
                                            />
                                            <Tooltip title="Unasign teacher from discipline">
                                                <IconButton onClick={() => { unasignTeacher(teacher.universityId) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>,
                                    )}
                                </List>
                                <UserSearchModal userType="Teachers" endpoint={`http://localhost:8080/disciplines/${disciplne.disciplineId}/users`} usesrsToRemove={teachers}
                                    onCloseListener={() => { loadTeachers() }} />
                            </Container>
                        </Stack>
                        <Stack direction='column' spacing={2}>
                            <Typography align='center'>Students</Typography>
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
                                    {students.map((student) =>
                                        <ListItem>
                                            <ListItemText
                                                primary={student.email}
                                                secondary={student.universityId}
                                            />
                                            <Tooltip title="Unasign student from discipline">
                                                <IconButton onClick={() => { unasignStudent(student.universityId) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItem>,
                                    )}
                                </List>
                                <UserSearchModal userType="Students" endpoint={`http://localhost:8080/disciplines/${disciplne.disciplineId}/users`} usesrsToRemove={students}
                                    onCloseListener={() => { loadStudents() }} />
                            </Container>
                        </Stack>
                    </Stack>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={saveButtonClicked}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </div>
    );

    function saveButtonClicked() {
        saveDiscipline();
        handleClose();
    }

    async function unasignStudent(studentId) {
        await fetch(`http://localhost:8080/disciplines/${disciplne.disciplineId}/users`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: studentId })
        });
        loadStudents();
    }

    async function unasignTeacher(teacherId) {
        await fetch(`http://localhost:8080/disciplines/${disciplne.disciplineId}/users`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: teacherId })
        });
        loadTeachers();
    }

    function deleteQuestionSet(questionSetId) {
        //TODO delete question set via api 
    }
}