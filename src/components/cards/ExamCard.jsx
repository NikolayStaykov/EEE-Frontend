import { Box, IconButton, Tooltip, Typography, Stack } from "@mui/material";
import StartIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import ExamModalDialog from "../modals/ExamModalDialog";


const ExamCard = ({ exam, userRole, discipline, onCloseListener }) => {

    const deleteExam = async () => {
        const response = await fetch(`http://localhost:8080/exams/${exam.id}`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        onCloseListener();
    }

    return (
        <Box sx={{
            background: 'rgb(0, 0, 0, 0.5)',
            border: '4px',
            height: '6vh',
            minWidth: '28vh',
            display: 'flex'
        }}>
            <Stack sdirection="column">
                <Tooltip title={exam.name}>
                    <Typography align="top-left" noWrap="true">{exam.examName}</Typography>
                </Tooltip>
                <Typography align="top-left" noWrap="true">Begins: {exam.startDate.substring(0,16).replace("T"," ")}</Typography>
            </Stack>
            <Box display='flex' flexGrow={1}></Box>
            {renderEditOrStartButton(userRole, exam)}
            {renderDeleteButton(userRole)}
        </Box>
    )

    function renderDeleteButton(userRole) {
        if (userRole == 'admin') {
            return <div>
                <Tooltip title="Delete exam">
                    <IconButton onClick={()=>{deleteExamClicked()}}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        }
    }

    function renderEditOrStartButton(userRole, exam) {
        if (userRole !== 'student') {
            return <ExamModalDialog discipline={discipline} exam={exam} edit={true} />
        } else {
            if (exam.canBeStarted == true) {
                return <div>
                    <Tooltip title="Start exam">
                        <IconButton>
                            <StartIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            } else {
                return <div>
                    <Tooltip title="Unable to start this exam at the moment">
                        <span>
                            <IconButton disabled='true'>
                                <StartIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>
            }
        }
    }

    function deleteExamClicked(){
        deleteExam();
    }
}

export default ExamCard;