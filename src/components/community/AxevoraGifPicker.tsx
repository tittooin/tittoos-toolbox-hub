import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AxevoraGifPickerProps {
  onGifSelect: (gifUrl: string) => void;
}

// Curated list of safe, widely used reaction GIFs
const CURATED_GIFS = [
  { id: '1', url: 'https://media.tenor.com/F0-08_d9L-0AAAAi/yes-hell-yes.gif', tag: 'Yes' },
  { id: '2', url: 'https://media.tenor.com/b2bYd512aD0AAAAi/no.gif', tag: 'No' },
  { id: '3', url: 'https://media.tenor.com/T0bS1wS2ZkAAAAAi/lol.gif', tag: 'Lol' },
  { id: '4', url: 'https://media.tenor.com/8QOtyFfD0WAAAAAi/wow.gif', tag: 'Wow' },
  { id: '5', url: 'https://media.tenor.com/d_dZ3F65Y3YAAAAi/applause-clapping.gif', tag: 'Clap' },
  { id: '6', url: 'https://media.tenor.com/M1K3mC3oV1QAAAAi/facepalm.gif', tag: 'Facepalm' },
  { id: '7', url: 'https://media.tenor.com/7b3m9Oim-yMAAAAi/crying.gif', tag: 'Cry' },
  { id: '8', url: 'https://media.tenor.com/b_8E-rFv_7kAAAAi/angry.gif', tag: 'Angry' },
  { id: '9', url: 'https://media.tenor.com/4h10EwYwX4AAAAAi/mind-blown-explosion.gif', tag: 'Mind Blown' },
  { id: '10', url: 'https://media.tenor.com/3_c2q9Y-r6YAAAAi/dance.gif', tag: 'Dance' },
  { id: '11', url: 'https://media.tenor.com/N8v9mB9k0P4AAAAi/thumbs-up.gif', tag: 'Thumbs Up' },
  { id: '12', url: 'https://media.tenor.com/x8v1oNUOmg4AAAAi/rickroll-rick.gif', tag: 'Dance' }
];

export const AxevoraGifPicker: React.FC<AxevoraGifPickerProps> = ({ onGifSelect }) => {
  return (
    <div className="w-64 sm:w-80 h-72 bg-white rounded-xl flex flex-col p-2">
      <div className="text-xs font-bold text-slate-500 mb-2 px-2 uppercase tracking-wider">
        Trending GIFs
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 p-1">
          {CURATED_GIFS.map((gif) => (
            <button
              key={gif.id}
              onClick={() => onGifSelect(gif.url)}
              className="relative group rounded-md overflow-hidden aspect-video bg-slate-100 border border-slate-200 hover:border-indigo-400 transition-colors"
            >
              <img 
                src={gif.url} 
                alt={gif.tag} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                {gif.tag}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
