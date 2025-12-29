import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/lib/axiosinstance';

interface BadgeImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const allowedImageFormats = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
];
const maxImageSize = 2 * 1024 * 1024; // 2MB

const BadgeImageUpload: React.FC<BadgeImageUploadProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && allowedImageFormats.includes(file.type)) {
      if (file.size <= maxImageSize) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Image size should not exceed 2MB.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: `Please upload a valid image file. Allowed formats: ${allowedImageFormats.join(', ')}`,
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please select an image before uploading.',
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('background_img', selectedFile);

    try {
      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);
      console.log('FormData contents: background_img file');

      const response = await axiosInstance.post(
        '/register/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Upload response:', response);
      console.log('Response data:', response.data);

      if (response.data && response.data.data) {
        const { Location } = response.data.data;
        console.log('Image URL:', Location);
        onChange(Location);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully!',
        });
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Show detailed error in toast for debugging
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Image upload failed. Please try again.';
      
      const errorStatus = error.response?.status ? ` (${error.response.status})` : '';
      
      toast({
        variant: 'destructive',
        title: `Upload failed${errorStatus}`,
        description: errorMessage,
      });
      
      // Also alert for immediate visibility
      alert(`Upload Error${errorStatus}: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={allowedImageFormats.join(',')}
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative">
          <div className="w-32 h-32 relative rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={previewUrl}
              alt="Badge/Level preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Click to upload</p>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Selected: {selectedFile.name}
          </p>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
      )}

      {!previewUrl && !selectedFile && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  );
};

export default BadgeImageUpload;
