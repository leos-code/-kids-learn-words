import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CharacterDisplay } from './components/CharacterDisplay';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CharacterDisplay />
    </ThemeProvider>
  );
}

export default App;
