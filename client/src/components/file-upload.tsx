import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Upload, Check, Loader2 } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  placeholder?: string;
  isLoading?: boolean;
  uploadedUrl?: string;
}

export function FileUpload({ 
  onFileSelect, 
  onUploadComplete,
  accept = "image/*", 
  maxSize = 5,
  placeholder = "Clique para fazer upload ou arraste a imagem aqui",
  isLoading = false,
  uploadedUrl
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo ${maxSize}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (uploadedUrl) {
    return (
      <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6 text-center">
        <div className="mb-4">
          <img 
            src={uploadedUrl} 
            alt="Imagem enviada" 
            className="max-h-40 w-auto mx-auto rounded-lg shadow-sm"
          />
        </div>
        <div className="flex items-center justify-center text-green-700 mb-2">
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium">Imagem enviada com sucesso!</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          Trocar imagem
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              handleFileSelect(files[0]);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragOver ? "border-primary bg-blue-50" : 
        isLoading ? "border-blue-300 bg-blue-50" : 
        "border-slate-300 hover:border-primary"
      } ${isLoading ? "pointer-events-none" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onClick={!isLoading ? handleClick : undefined}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-blue-600 font-medium mb-2">Enviando imagem...</p>
          <p className="text-sm text-blue-500">Por favor, aguarde</p>
        </>
      ) : (
        <>
          <Cloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">{placeholder}</p>
          <p className="text-sm text-slate-500">PNG, JPG até {maxSize}MB</p>
        </>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            handleFileSelect(files[0]);
          }
        }}
      />
    </div>
  );
}
