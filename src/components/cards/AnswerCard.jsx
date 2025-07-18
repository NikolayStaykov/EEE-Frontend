import { Box, IconButton, Tooltip, Typography, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AnswerModalDialog from "../modals/AnswerModalDialog";

const AnswerCard = ({ answer, questionId }) => {
    return (
        <Box sx={{
            background: 'rgb(0, 0, 0, 0.5)',
            border: '4px',
            height: '6vh',
            minWidth: '28vh',
            display: 'flex'
        }}>
            <Tooltip title={answer.answerText}>
                <Typography align="top-left" noWrap="true">{answer.answerText}</Typography>
            </Tooltip>
            <Box display='flex' flexGrow={1}></Box>
            <Tooltip title="Is answer correct">
                <Checkbox disabled checked={answer.isCorrect} />
            </Tooltip>
            <Tooltip title='Delete Answer'>
                <IconButton onClick={deleteAnswer}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <AnswerModalDialog answer={answer} edit={true} questionId={questionId}/>
        </Box>
    )

    function deleteAnswer() {
        //TODO delete answer via API
    }
}

export default AnswerCard;