import { useState, useEffect } from "react";
import { Typography, Container, Stack, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExamCard from "./ExamCard";
import NewDisciplineModalDialog from "../modals/newDisciplineModalDialog";
import ExamModalDialog from "../modals/ExamModalDialog";

const DisciplineCard = ({ discipline, userRole, onCloseListener }) => {

    const [exams, setExams] = useState([])

    const loadExams = async () => {
        const response = await fetch(`http://localhost:8080/exams?disciplineId=${discipline.disciplineId}`, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setExams(data)
    }

    const deleteDiscipline = async () => {
        const response = await fetch(`http://localhost:8080/disciplines/${discipline.disciplineId}`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        }).catch(console.error);;
    }

    useEffect(() => {
        loadExams();
    }, [])

    return (
        <Container sx={{
            background: 'rgb(255, 255, 255, 0.5)',
            height: '11vh',
            minWidth: '1700px'
        }}>
            <Typography align="top-left">
                {discipline.disciplineName}
            </Typography>
            <Stack className="examStack" direction="row" spacing={2}>
                {
                    exams.map((exam) => <ExamCard exam={exam} userRole={userRole} discipline={discipline} onCloseListener={() => { loadExams() }} />)
                }
                {renderNewExamButton(userRole)}
                {renderEditButton(userRole)}
                {renderDeleteButton(userRole)}
            </Stack>
        </Container>
    )

    function renderNewExamButton(userRole) {
        if (userRole !== 'student') {
            return <ExamModalDialog discipline={discipline} edit={false} exam={{
                id: 0,
                examName: " ",
                startDate: "",
                durationMinutes: "",
                questionSetId: "",
                totalPoints: 0,
                numberOfQuestions: 0,
            }} />
        }
    }

    function renderEditButton(userRole) {
        if (userRole != 'student') {
            return <NewDisciplineModalDialog disciplne={discipline} edit={true} onCloseListener={onCloseListener} />
        }
    }

    function renderDeleteButton(userRole) {
        if (userRole == 'admin') {
            return <div>
                <Tooltip title="Delete discipline">
                    <IconButton onClick={() => { deleteClicked() }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        }
    }

    function deleteClicked() {
        deleteDiscipline();
        onCloseListener();
    }

}

export default DisciplineCard;