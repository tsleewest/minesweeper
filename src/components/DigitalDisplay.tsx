import React from 'react';

interface DigitalDisplayProps {
  value: number;
  id?: string;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({ value, id }) => {
  // Clamp value between -99 and 999
  const clampedValue = Math.max(-99, Math.min(999, value));
  
  // Format to 3 characters: e.g. "005", "042", "-09", "120"
  let formatted = '';
  if (clampedValue < 0) {
    formatted = `-${Math.abs(clampedValue).toString().padStart(2, '0')}`;
  } else {
    formatted = clampedValue.toString().padStart(3, '0');
  }

  return (
    <div
      id={id}
      className="bg-black border-2 border-[#333] px-2.5 py-1 flex items-center justify-center font-mono font-bold tracking-widest text-2xl sm:text-3xl select-none shadow-inner"
      style={{
        color: '#ff0000',
        textShadow: '0 0 8px rgba(255, 0, 0, 0.8), 0 0 14px rgba(255, 0, 0, 0.4)',
        minWidth: '76px',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {formatted}
    </div>
  );
};
