import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container sx={{
      color: 'white',
      background: 'linear-gradient(to bottom, rgba(88, 184, 128, 1), rgba(0, 212, 255, 1))',
      height: '100vh'
    }}>
      <Typography align="center" paddingTop={35} fontSize={45} fontFamily={'Oswald'}>Technical University Of Varna 
        Electronic Exam System
      </Typography>
    </Container>
  );
}

export default App;
