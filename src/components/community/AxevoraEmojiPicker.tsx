import React from 'react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

interface AxevoraEmojiPickerProps {
  onEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
  lazyLoadEmojis?: boolean;
}

export const AxevoraEmojiPicker: React.FC<AxevoraEmojiPickerProps> = ({ onEmojiClick, lazyLoadEmojis = true }) => {
  const { theme } = useTheme();
  
  return (
    <EmojiPicker 
      onEmojiClick={onEmojiClick}
      theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
      lazyLoadEmojis={lazyLoadEmojis}
      width={330}
      height={350}
      style={{ border: 'none', backgroundColor: 'transparent' }}
    />
  );
};
