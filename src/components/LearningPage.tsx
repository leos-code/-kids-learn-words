import { useState, useEffect } from 'react';
import type { Character } from '../data/characters';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Fade,
  useTheme,
  Container
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getSelectedCharacters } from '../data/characters';

interface LearningPageProps {
  onBack: () => void;
}

export const LearningPage = ({ onBack }: LearningPageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChars, setSelectedChars] = useState<Character[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const theme = useTheme();

  // 停止所有语音播放
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
  };

  // 组件卸载时停止语音
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    const chars = getSelectedCharacters();
    console.log('Loaded characters:', chars);
    setSelectedChars(chars);
  }, []);

  const currentChar = selectedChars[currentIndex];
  
  useEffect(() => {
    if (currentChar) {
      console.log('Current character:', currentChar);
      console.log('Words:', currentChar.words);
    }
  }, [currentChar]);

  // 当切换汉字时停止语音
  useEffect(() => {
    stopSpeaking();
  }, [currentIndex]);

  const speak = (text: string, isWord: boolean = false) => {
    if (isSpeaking || !currentChar) return;
    
    stopSpeaking();
    setIsSpeaking(true);

    // 如果是汉字，准备连读汉字和词组
    if (!isWord) {
      const words = currentChar.words || [];
      const fullText = words.length > 0 
        ? `${text}，${words.join('，')}` 
        : text;
      
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.4;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentWordIndex(-1);
      };
      
      utterance.onerror = () => {
        stopSpeaking();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // 如果是单独点击词组，只读词组
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.7;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentWordIndex(-1);
      };
      
      utterance.onerror = () => {
        stopSpeaking();
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < selectedChars.length - 1) {
      stopSpeaking(); // 切换前停止语音
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      stopSpeaking(); // 切换前停止语音
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 修改返回按钮的处理函数
  const handleBack = () => {
    stopSpeaking(); // 返回前停止语音
    onBack();
  };

  if (!currentChar) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          请先选择要学习的汉字
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          返回选择
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s'
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {currentIndex + 1} / {selectedChars.length}
        </Typography>
      </Box>

      <Fade in={true} timeout={500}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '24px',
            backgroundColor: 'white',
            position: 'relative',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            position: 'relative'
          }}>
            <Typography 
              variant="h1" 
              component="div"
              sx={{ 
                fontFamily: 'font-kids',
                fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                textAlign: 'center',
                mb: 2,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease'
                }
              }}
              onClick={() => speak(currentChar.char)}
            >
              {currentChar.char}
            </Typography>
            
            {/* 添加可爱的猫咪图标 */}
            {/* <PetsIcon 
              sx={{ 
                fontSize: '3rem',
                color: theme.palette.primary.main,
                position: 'absolute',
                right: '-4rem',
                top: '50%',
                transform: 'translateY(-50%)',
                animation: 'bounce 1s ease-in-out infinite',
                '@keyframes bounce': {
                  '0%, 100%': {
                    transform: 'translateY(-50%) rotate(0deg)',
                  },
                  '50%': {
                    transform: 'translateY(-50%) rotate(15deg)',
                  }
                }
              }} 
            /> */}
          </Box>

          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {currentChar.pinyin}
          </Typography>

          <IconButton
            size="large"
            onClick={() => speak(currentChar.char)}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { transform: 'scale(1.2)' },
              transition: 'transform 0.2s'
            }}
          >
            <VolumeUpIcon fontSize="large" />
          </IconButton>

          <Box sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              常用词组：
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {currentChar.words.slice(0, 2).map((word, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  onClick={() => {
                    setCurrentWordIndex(index);
                    speak(word, true);
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: currentWordIndex === index 
                      ? theme.palette.primary.main 
                      : theme.palette.primary.light,
                    color: 'white',
                    transform: currentWordIndex === index ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      backgroundColor: theme.palette.primary.main,
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="h6">{word}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Paper>
      </Fade>

      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          上一个
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={currentIndex === selectedChars.length - 1}
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          下一个
        </Button>
      </Box>
    </Container>
  );
}; 