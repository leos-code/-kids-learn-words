import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import { CharacterSelector } from './components/CharacterSelector';
import { LearningPage } from './components/LearningPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: [
      'font-kids',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

function App() {
  const [isLearning, setIsLearning] = useState(false);

  const handleStartLearning = () => {
    setIsLearning(true);
  };

  const handleBackToSelection = () => {
    setIsLearning(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        {!isLearning ? (
          <CharacterSelector onStartLearning={handleStartLearning} />
        ) : (
          <LearningPage onBack={handleBackToSelection} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
