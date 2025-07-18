import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, List, ListItem, ListItemText, Stack, Container, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QuestionCard from '../cards/QuestionCard';
import QuestionModalDialog from './QuestionModalDialog';

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


export default function QuestionSetModalDialog({ questionSet, edit, parentId }) {
    const [questionSetName, setQuestionSetName] = useState(questionSet.name)
    const [questionSetInfo, setQuestionSetInfo] = useState(questionSet.info)
    const [questionSetQuestions, setQuestionSetQuestions] = useState([])
    const [parentQuestionSetId, setParentQuestionSetId] = useState(parentId)

    const loadQuestions = async () => {
        const response = await fetch(`http://localhost:8080/questionSets/${questionSet.id}?loadQuestions=true`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setQuestionSetQuestions(data.questions);
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setQuestionSetName(questionSet.name)
        setQuestionSetQuestions(questionSet.questions)
    }, [])

    return (
        <div>
            <Tooltip title={edit ? "Edit question set" : "Add new question set"}>
                <IconButton onClick={handleOpen}>
                    {edit ? <EditIcon /> : <AddIcon />}
                </IconButton>
            </Tooltip>
            <Modal open={open}
                aria-labelledby="modal-modal-title">
                <Box sx={style}>
                    <Stack direction="column" spacing={2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {edit ? "Edit Question Set" : "Add new Question Set"}
                        </Typography>
                        <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={questionSetName}
                            onChange={(event) => {
                                setQuestionSetName(event.target.value);
                            }} />
                        <TextField id="outlined-basic-info" label="Info" variant="outlined" defaultValue={questionSetInfo}
                            onChange={(event) => {
                                setQuestionSetInfo(event.target.value);
                            }} />
                        <Container sx={{
                            minHeight: 500,
                            height: 500,
                            background: 'rgb(145,211,133,0.5)',
                            border: 2,
                            overflowY: "auto"
                        }}>
                            <Stack direction="column" spacing={2}>
                                {
                                    questionSetQuestions?.map((q) => <QuestionCard question={q} questionSetId={questionSet.id} onDeleteListener={() => loadQuestions()} />)
                                }
                                <QuestionModalDialog question={{
                                    "id": 0,
                                    "questionText": "",
                                    "points": "0",
                                    "discipline": { "disciplineId": questionSet.disciplineId },
                                    "answers": [
                                    ]
                                }} edit={false} questionSetId={questionSet.id} onCloseListener={() => loadQuestions()} />
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

    async function saveQuestionSet() {
        if (edit) {
            const response = await fetch(`http://localhost:8080/questionSets/${questionSet.id}`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ parentQuestionSetId: null, id: questionSet.id, disciplineId: questionSet.disciplineId, name: questionSetName, info: questionSetInfo })
            });
        } else {
            const response = await fetch(`http://localhost:8080/questionSets`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ parentQuestionSetId: null, disciplineId: questionSet.disciplineId, name: questionSetName, info: questionSetInfo })
            });
        }

    }

    function saveButtonClicked() {
        saveQuestionSet();
        handleClose();
    }
}