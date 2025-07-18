import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import QuestionModalDialog from "../modals/QuestionModalDialog";
import DeleteIcon from "@mui/icons-material/Delete";

const QuestionCard = ({ question, onDeleteListener, questionSetId }) => {
    return (
        <Box sx={{
            background: 'rgb(0, 0, 0, 0.5)',
            border: '4px',
            height: '6vh',
            minWidth: '28vh',
            display: 'flex'
        }}>
            <Tooltip title={question.questionText}>
                <Typography align="top-left" noWrap="true">{question.questionText}</Typography>
            </Tooltip>
            <Box display='flex' flexGrow={1}></Box>
            <Tooltip title='Delete Question'>
                <IconButton id="delete-icon-button" onClick={() => {deleteButtonClicked()}}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <QuestionModalDialog question={question} edit={true} />
        </Box>
    )

    async function deleteQuestion() {
        await fetch(`http://localhost:8080/questionSets/${questionSetId}/questions`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ questionId: question.id })
        });
    }

    function deleteButtonClicked() {
        deleteQuestion();
        onDeleteListener();
    }
}

export default QuestionCard;