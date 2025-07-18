import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Tooltip, IconButton, TextField, List, ListItem, ListItemText, Stack, Container, Button } from '@mui/material';
import AddIcon from "@mui/icons-material/AddSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QuestionSetModalDialog from './QuestionSetModalDialog';

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

export default function ExamAttemptModal({ examId }) {
    const [question, setQuestion] = useState(null);
    const [curentAnswers, setCurrentAnswers] = useState(null);
}