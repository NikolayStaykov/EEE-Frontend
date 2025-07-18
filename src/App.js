import { React, useState, useEffect } from 'react';

import { Box, Typography, Container, Stack, IconButton, Tooltip } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp"

import NavBar from './components/navigation/navBar';
import DisciplineCard from './components/cards/DisciplineCard';
import NewDisciplineModalDialog from './components/modals/newDisciplineModalDialog';
import "./App.css";

const App = () => {

    const [userRole, setUserRole] = useState('admin');

    const [disciplines, setDisciplines] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);

    const loadDisciplines = async () => {
        const response = await fetch("http://localhost:8080/disciplines", {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip,deflate,br"
            }
        });
        const data = await response.json();
        setDisciplines(data)
    }

    useEffect(() => {
        loadDisciplines();
    }, [])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container
            maxWidth="{false}"
            maxHeight="{false}"
            sx={{
                paddingLeft: 0,
                paddingRight: 0,
                background: 'linear-gradient(to bottom, rgba(88, 184, 128, 1), rgba(0, 212, 255, 1))',
                height: '100vh'
            }}>
            <NavBar />
            <Typography align="center" paddingTop={5} fontSize={45}>Technical University Of Varna
                Electronic Exam System
            </Typography>
            <Box sx={{
                background: 'rgb(255, 255, 255, 0.5)',
                height: '80vh',
            }}>
                <Stack className="disciplineStack" alignItems="center" sdirection="column" spacing={2}>
                    <Typography id="disciplinesTypography" align="center" paddingTop={2} fontSize={21}>
                        Disciplines
                    </Typography>
                    {
                        disciplines.map((discipline) => <DisciplineCard discipline={discipline} userRole={userRole} onCloseListener={() => { loadDisciplines() }} />)
                    }
                    {renderAddDisciplineButton(userRole)}
                </Stack>
            </Box>
        </Container>
    );

    function renderAddDisciplineButton(userRole) {
        if (userRole == 'admin') {
            return <NewDisciplineModalDialog disciplne={{
                disciplineId: 0,
                disciplineName: " "
            }} edit={false}
                onCloseListener={() => { loadDisciplines() }} />
        }
    }
};

export default App;