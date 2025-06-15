import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { characters, getCurrentProgress, saveProgress } from '../data/characters';
import type { Character } from '../data/characters';

export const CharacterDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(getCurrentProgress());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentChar, setCurrentChar] = useState<Character>(characters[currentIndex]);

  const speak = useCallback(() => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(currentChar.char);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [currentChar, isSpeaking]);

  const handleNext = useCallback(() => {
    if (currentIndex < characters.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveProgress(newIndex);
    }
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveProgress(newIndex);
    }
  }, [currentIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: true
  });

  useEffect(() => {
    setCurrentChar(characters[currentIndex]);
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" {...handlers}>
      <div className="relative w-full max-w-md mx-auto">
        <div className="character-display mb-8">
          {currentChar.char}
        </div>
        
        <div className="flex justify-center mb-8">
          <IconButton
            className="speaker-button bg-white shadow-lg hover:bg-gray-50"
            onClick={speak}
            disabled={isSpeaking}
          >
            <VolumeUpIcon className={isSpeaking ? 'text-gray-400' : 'text-blue-500'} />
          </IconButton>
        </div>

        <div className="flex justify-between px-4">
          <IconButton
            className="nav-button bg-white shadow-lg hover:bg-gray-50"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <NavigateBeforeIcon className={currentIndex === 0 ? 'text-gray-400' : 'text-blue-500'} />
          </IconButton>
          
          <IconButton
            className="nav-button bg-white shadow-lg hover:bg-gray-50"
            onClick={handleNext}
            disabled={currentIndex === characters.length - 1}
          >
            <NavigateNextIcon className={currentIndex === characters.length - 1 ? 'text-gray-400' : 'text-blue-500'} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}; 