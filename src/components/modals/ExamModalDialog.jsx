import { React, useState, useEffect } from "react";
import { Tooltip, IconButton, TextField, List, ListItem, ListItemText, Stack, Container, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddIcon from "@mui/icons-material/AddSharp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import UserSearchModal from "./UserSearchModal";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 910,
    height: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ExamModalDialog({ discipline, exam, edit }) {

    const [examName, setExamName] = useState(exam.examName);
    const [examDate, setExamDate] = useState(exam.startDate);
    const [students, setStudents] = useState([]);
    const [duration, setDuration] = useState(exam.durationMinutes)
    const [questionSets, setQuestionSets] = useState([])
    const [questionSetId, setQUestionSetId] = useState(exam.questionSetId)
    const [totalPoints, setTotalPoints] = useState(exam.totalPoints)
    const [numberOfQuestions, setNumberOfQuestions] = useState(exam.numberOfQuestions)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const loadQuestionSets = async () => {
        const response = await fetch(`http://localhost:8080/questionSets?disciplineId=${discipline.disciplineId}`, {
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
        const response = await fetch(`http://localhost:8080/exams/${discipline.disciplineId}/users`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setStudents(data)
    }

    const saveExam = async () => {
        if (exam.id === 0) {
            const response = await fetch(`http://localhost:8080/exams`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    examName: examName,
                    startDate: examDate,
                    durationMinutes: duration,
                    questionSetId: questionSetId,
                    totalPoints: totalPoints,
                    numberOfQuestions: numberOfQuestions,
                    disciplineId: discipline.disciplineId
                })
            });
            console.log(response);
        } else {
            const response = await fetch(`http://localhost:8080/exams/${exam.id}`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: exam.id,
                    examName: examName,
                    startDate: examDate,
                    durationMinutes: duration,
                    questionSetId: questionSetId,
                    totalPoints: totalPoints,
                    numberOfQuestions: numberOfQuestions,
                    disciplineId: discipline.disciplineId
                })
            });
        }

    }

    useEffect(() => {
        loadQuestionSets();
        loadStudents();
        if (exam.date != "") {
            setExamDate(dayjs(exam.date));
        }
    }, [])

    return (
        <div>
            <Tooltip title={getTooltip(exam, edit)}>
                <IconButton onClick={handleOpen} disabled={!getEnabled(exam, edit)}>
                    {edit ? <EditIcon /> : <AddIcon />}
                </IconButton>
            </Tooltip>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {edit ? "Edit Exam" : "Schedule new Exam"}
                    </Typography>
                    <Stack direction='row' spacing={21}>
                        <Stack direction='column' spacing={4}>
                            <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={examName}
                                onChange={(event) => {
                                    setExamName(event.target.value);
                                }} />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker label="Exam start time" value={examDate != "" ? examDate : new dayjs()}
                                        onChange={(newValue) => setExamDate(newValue)} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <TextField id="outlined-duration" label="Duration in minutes" variant="outlined" defaultValue={duration}
                                onChange={(event) => {
                                    setDuration(event.target.value);
                                }} />
                            <FormControl fullWidth>
                                <InputLabel id="question-set-label">Question Set</InputLabel>
                                <Select
                                    labelId="question-set-label"
                                    id="demo-simple-select"
                                    value={questionSetId}
                                    label="Question Set"
                                    onChange={(event) => {
                                        setQUestionSetId(event.target.value);
                                    }}>
                                    {
                                        questionSets?.map((questionSet) => <MenuItem value={questionSet.id}>{questionSet.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <TextField id="outlined-totalPoints" label="Total Points" variant="outlined" defaultValue={totalPoints}
                                onChange={(event) => {
                                    setTotalPoints(event.target.value);
                                }} />
                            <TextField id="outlined-numberOfQuestions" label="Number Of Questions" variant="outlined" defaultValue={numberOfQuestions}
                                onChange={(event) => {
                                    setNumberOfQuestions(event.target.value);
                                }} />
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
                                    {students?.map((student) => <ListItem>
                                        <ListItemText
                                            primary={student.email}
                                            secondary={student.universityId}
                                        />
                                        <Tooltip title="Unasign student from discipline">
                                            <IconButton onClick={() => {unasignStudent(student.universityId)}}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItem>,)
                                    }
                                </List>
                                <UserSearchModal userType="Students" endpoint={`http://localhost:8080/exams/${exam.id}/users`} usesrsToRemove={students}
                                    onCloseListener={() => { loadStudents() }} />
                            </Container>
                        </Stack>
                    </Stack>
                    <div>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={saveButtonClicked}>
                            {edit ? "Save" : "Schedule"}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )

    function saveButtonClicked() {
        saveExam();
        handleClose();
    }

    function getTooltip(exam, edit) {
        if (!edit) {
            return "Schedule new exam"
        }
        if (Date.parse(exam.date) > new Date().getTime()) {
            return "Edit exam"
        } else {
            return "Unable to edit exam after start date has been reacherd"
        }
    }

    function getEnabled(exam, edit) {
        if (!edit) {
            return true
        }
        return Date.parse(exam.startDate) > new Date().getTime()
    }

    async function unasignStudent(studentId) {
        await fetch(`http://localhost:8080/exams/${exam.id}/users`, {
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
}