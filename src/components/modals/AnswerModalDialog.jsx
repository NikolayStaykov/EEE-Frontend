import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, Stack, Button, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";
import EditIcon from "@mui/icons-material/Edit";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    height: 460,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AnswerModalDialog({ answer, edit, questionId }) {

    const [answerText, setAnswerText] = useState(answer.answerText);
    const [answerFraction, setAnswerFraction] = useState(answer.fraction);
    const [answerOrder, setAnswerOrder] = useState(answer.order);
    const [isCorrect, setIsCorrect] = useState(answer.isCorrect)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleIsCorrectedChanged = (event) => {
        setIsCorrect(event.target.checked);
    };

    return (
        <div>
            <Tooltip title={edit ? "Edit Question" : "Add new Question"}>
                <IconButton onClick={handleOpen}>
                    {edit ? <EditIcon /> : <AddIcon />}
                </IconButton>
            </Tooltip>
            <Modal open={open}
                aria-labelledby="modal-modal-title">
                <Box sx={style}>
                    <Stack direction="column" spacing={2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {edit ? "Edit Answer" : "Add new Answer"}
                        </Typography>
                        <TextField id="outlined-basic" label="Answer Text" variant="outlined" defaultValue={answerText} multiline={true} rows={5}
                            onChange={(event) => {
                                setAnswerText(event.target.value)
                            }} />
                        <TextField id="outlined-basic-fraction" label="Fraction" variant="outlined" defaultValue={answerFraction} multiline={false}
                            onChange={(event) => {
                                setAnswerFraction(event.target.value)
                            }} />
                        <TextField id="outlined-basic-order" label="Order" variant="outlined" defaultValue={answerOrder} multiline={false}
                            onChange={(event) => {
                                setAnswerOrder(event.target.value)
                            }} />
                        <div>
                            <Button onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={saveButtonClicked}>
                                Save
                            </Button>
                        </div>
                    </Stack>
                </Box>
            </Modal>
        </div>
    )

    async function saveAnswer() {
        if (edit) {
            await fetch(`http://localhost:8080/answers/${answer.id}`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: answer.id, questionId: questionId, answerText: answerText, fraction: answerFraction, answerOrder: answerOrder })
            });
        } else {
            await fetch(`http://localhost:8080/answers/`, {
                method: "PUT",
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,br",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ questionId: questionId, answerText: answerText, fraction: answerFraction, answerOrder: answerOrder })
            });
        }
    }

    function saveButtonClicked() {
        saveAnswer();
        handleClose();
    }
}