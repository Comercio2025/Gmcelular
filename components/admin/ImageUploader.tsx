
import React, { useState, useCallback, DragEvent, ClipboardEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  }, [handleFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }, [handleFile]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  
  const handlePaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
      // FIX: Explicitly type 'item' as DataTransferItem to resolve type inference error on 'item.type'.
      const clipboardItem = Array.from(e.clipboardData.items).find((item: DataTransferItem) => item.type.startsWith('image/'));
      if (clipboardItem) {
          handleFile(clipboardItem.getAsFile());
      }
  }, [handleFile]);

  return (
    <div 
        className={`relative w-full p-4 border-2 border-dashed rounded-md cursor-pointer text-center
        ${dragOver ? 'border-primary bg-blue-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
        tabIndex={0}
    >
      <label htmlFor="file-upload" className="cursor-pointer">
        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-primary">Clique</span>, arraste ou cole uma imagem
        </p>
      </label>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
    </div>
  );
};

export default ImageUploader;
