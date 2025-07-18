import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, Stack, Container, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";
import EditIcon from "@mui/icons-material/Edit";
import AnswerCard from '../cards/AnswerCard';
import AnswerModalDialog from './AnswerModalDialog';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    height: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const questionTypes = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'MATCHING', 'SHORT_ANSWER', 'NUMERICAL']


export default function QuestionModalDialog({ question, edit, questionSetId, onCloseListener }) {
    const [questionText, setQuestionText] = useState(question.questionText);
    const [points, setPoints] = useState(question.defaultGrade);
    const [questionType, setQuestionType] = useState(question.questionType);
    const [answers, setAnswers] = useState(question.answers);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Tooltip title={edit ? "Edit question" : "Add new question"}>
                <IconButton onClick={handleOpen}>
                    {edit ? <EditIcon /> : <AddIcon />}
                </IconButton>
            </Tooltip>
            <Modal open={open}
                aria-labelledby="modal-modal-title">
                <Box sx={style}>
                    <Stack direction="column" spacing={2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {edit ? "Edit Question" : "Add new Question"}
                        </Typography>
                        <TextField id="outlined-basic" label="Question Text" variant="outlined" defaultValue={questionText} multiline={true} rows={6}
                            onChange={(event) => {
                                setQuestionText(event.target.value)
                            }} />
                        <TextField id="outlined-basic" label="Points" variant="outlined" defaultValue={points}
                            onChange={(event) => {
                                setPoints(event.target.value)
                            }} />
                        <FormControl fullWidth>
                            <InputLabel id="question-type-label">Question Type</InputLabel>
                            <Select
                                labelId="question-label-label"
                                id="demo-simple-select"
                                value={questionType}
                                label="Question Type"
                                onChange={(event) => {
                                    setQuestionType(event.target.value);
                                }}>
                                {
                                    questionTypes?.map((type) => <MenuItem value={type}>{type}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <Container sx={{
                            minHeight: 310,
                            height: 310,
                            background: 'rgb(145,211,133,0.5)',
                            border: 2,
                            overflowY: "auto"
                        }}>
                            <Stack direction="column" spacing={2}>
                                {
                                    answers.map((a) => <AnswerCard answer={a} questionId={question.id}/>)
                                }
                                <AnswerModalDialog edit={false} answer={{
                                    "id": "",
                                    "answerText": "",
                                    "isCorrect": ""
                                }} questionId={question.id}/>
                            </Stack>
                        </Container>
                        <div>
                            <Button onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={() => { saveButtonClicked() }}>
                                Save
                            </Button>
                        </div>
                    </Stack>
                </Box>
            </Modal>
        </div>
    )

    async function saveQuestion() {
        if (edit) {
            const response = await fetch(`http://localhost:8080/questions/${question.id}`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: question.id, questionText: questionText,  questionType: questionType, discipline: question.discipline, defaultGrade: points,answers:[]})
            });
        } else {
            const response = await fetch(`http://localhost:8080/questions`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({questionText: questionText,  questionType: questionType, discipline: question.discipline, defaultGrade: points, answers:[]})
            });
            const data = await response.json();
            console.log(data)
            await fetch(`http://localhost:8080/questionSets/${questionSetId}/questions`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({questionId: data})
            });
        }
    }


    function saveButtonClicked() {
        saveQuestion();
        onCloseListener();
        handleClose();
    }
}
