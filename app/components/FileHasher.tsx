"use client";

import { useState } from 'react';

async function calculateSHA256(file: File): Promise<`0x${string}`> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
}

type FileHasherProps = {
  onHashCalculated: (hash: `0x${string}`) => void;
};

export default function FileHasher({ onHashCalculated }: FileHasherProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const hash = await calculateSHA256(file);
      onHashCalculated(hash);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const hash = await calculateSHA256(file);
      onHashCalculated(hash);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 ${
        isDragOver ? 'border-blue-500 bg-gray-800' : 'border-gray-600 hover:border-gray-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-gray-400">
          {fileName ? `Selected: ${fileName}` : 'Drag & drop a file here, or click to select'}
        </p>
      </label>
    </div>
  );
}
