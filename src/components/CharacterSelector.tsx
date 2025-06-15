import { useState, useEffect } from 'react';
import type { Character } from '../data/characters';
import { sortedCharacters } from '../data/characters';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  Container,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { saveSelectedCharacters, getSelectedCharacters } from '../data/characters';

interface CharacterSelectorProps {
  onStartLearning: () => void;
}

export const CharacterSelector = ({ onStartLearning }: CharacterSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChars, setSelectedChars] = useState<Character[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const saved = getSelectedCharacters();
    setSelectedChars(saved);
  }, []);

  const handleSelect = (char: Character) => {
    setSelectedChars(prev => {
      const isSelected = prev.some(c => c.id === char.id);
      let newSelected;
      if (isSelected) {
        newSelected = prev.filter(c => c.id !== char.id);
      } else {
        newSelected = [...prev, char];
      }
      saveSelectedCharacters(newSelected);
      return newSelected;
    });
  };

  const handleClear = () => {
    setSelectedChars([]);
    saveSelectedCharacters([]);
  };

  const filteredChars = sortedCharacters.filter(char => 
    char.char.includes(searchTerm) || 
    char.pinyin.includes(searchTerm.toLowerCase())
  );

  const speak = (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.7; // 更慢的语速
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          选择要学习的汉字
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="清空已选汉字">
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClear}
              disabled={selectedChars.length === 0}
              sx={{
                borderRadius: '20px',
                px: 3
              }}
            >
              清空
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            onClick={onStartLearning}
            disabled={selectedChars.length === 0}
            sx={{
              borderRadius: '20px',
              px: 4
            }}
          >
            开始学习 ({selectedChars.length})
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索汉字或拼音..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: 'white',
            }
          }}
        />
      </Box>

      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mt: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: 2
        }}
      >
        {filteredChars.map(char => (
          <Grid 
            key={char.id}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Fade in={true}>
              <Paper
                onClick={() => handleSelect(char)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: selectedChars.some(c => c.id === char.id)
                    ? theme.palette.primary.main
                    : 'white',
                  color: selectedChars.some(c => c.id === char.id)
                    ? 'white'
                    : 'text.primary',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: selectedChars.some(c => c.id === char.id)
                      ? theme.palette.primary.dark
                      : theme.palette.grey[100],
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Typography 
                  variant="h3" 
                  component="div"
                  sx={{ 
                    fontFamily: 'font-kids',
                    fontSize: '2.5rem',
                    lineHeight: 1.2
                  }}
                >
                  {char.char}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: selectedChars.some(c => c.id === char.id)
                      ? 'white'
                      : theme.palette.text.secondary,
                    fontSize: '0.9rem'
                  }}
                >
                  {char.pinyin}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(char.char);
                  }}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: selectedChars.some(c => c.id === char.id)
                      ? 'white'
                      : theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: selectedChars.some(c => c.id === char.id)
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <VolumeUpIcon />
                </IconButton>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Container>
  );
}; 