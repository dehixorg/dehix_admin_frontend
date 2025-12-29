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
    formData.append('file', selectedFile); // Changed from 'background_img' to 'file' which is more common
    formData.append('upload_preset', 'badge_levels'); // Add if you're using Cloudinary

    try {
      console.log('Starting file upload...');
      console.log('File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });

      // Try with a more generic endpoint first
      const response = await axiosInstance.post(
        '/api/upload', // Try this common endpoint
        // '/admin/upload-image', // Or try this if you have an admin-specific endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add any required authentication headers here
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        },
      );

      console.log('Upload response:', response);
      console.log('Response data:', response.data);

      // Handle different response formats
      let imageUrl = '';
      
      // Try different response formats
      if (response.data?.url) {
        imageUrl = response.data.url; // Common format
      } else if (response.data?.data?.Location) {
        imageUrl = response.data.data.Location; // S3 format
      } else if (response.data?.secure_url) {
        imageUrl = response.data.secure_url; // Cloudinary format
      } else if (response.data?.imageUrl) {
        imageUrl = response.data.imageUrl; // Custom format
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }

      console.log('Extracted image URL:', imageUrl);
      onChange(imageUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
      });
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      let errorMessage = 'Failed to upload image';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Error setting up the upload request';
      }
      
      const errorStatus = error.response?.status ? ` (${error.response.status})` : '';
      
      toast({
        variant: 'destructive',
        title: 'Upload Error',
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
