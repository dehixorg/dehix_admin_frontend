'use client';

import { useState, useRef, useCallback } from 'react';
import { Image as ImageIcon, UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { badgeLevelService } from '@/services/badgeLevelService';
import PropTypes from 'prop-types';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  maxSizeMB?: number;
  className?: string;
  previewClassName?: string;
  uploadButtonText?: string;
  fieldName?: string;
}

const defaultAllowedFormats = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
] as const;

type AllowedFormat = typeof defaultAllowedFormats[number];

const isValidImageType = (type: string): type is AllowedFormat => {
  return (defaultAllowedFormats as readonly string[]).includes(type);
};

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const {
    value,
    onChange,
    disabled = false,
    maxSizeMB = 2,
    className = '',
    previewClassName = 'w-32 h-32',
    uploadButtonText = 'Upload Image',
    fieldName = 'file',
  } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageType(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: `Please upload a valid image file (${defaultAllowedFormats.join(', ')})`,
      });
      return;
    }

    if (file.size > maxSizeBytes) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: `Image size should not exceed ${maxSizeMB}MB.`,
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [maxSizeBytes, maxSizeMB, toast]);

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageChange(event);
    }
  }, [handleImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(fieldName, selectedFile);

    try {
      const response = await badgeLevelService.uploadBadgeLevelImage(formData);

      console.log('=== Upload Response Debug ===');
      console.log('Full response:', response);
      console.log('Response Location:', response.Location);
      console.log('Response url:', response.url);
      console.log('Response secure_url:', response.secure_url);
      console.log('Response imageUrl:', response.imageUrl);

      const imageUrl = response.Location || response.url || response.secure_url || response.imageUrl;
      
      if (imageUrl) {
        console.log('Final imageUrl being set:', imageUrl);
        onChange(imageUrl);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully!',
        });
      } else {
        throw new Error('Invalid response format - no image URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, fieldName, onChange, toast]);

  const handleContainerClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        accept={defaultAllowedFormats.join(',')}
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
        disabled={disabled || isUploading}
      />

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${
          previewUrl ? 'border-transparent' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <div className="relative group">
            <div className={`${previewClassName} relative overflow-hidden`}>
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isUploading}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer"
            onClick={handleContainerClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleContainerClick()}
          >
            <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop your image here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports: {defaultAllowedFormats.join(', ')} (max {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || isUploading}
          aria-busy={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Uploading...
            </>
          ) : (
            uploadButtonText
          )}
        </button>
      )}    </div>
  );
};

ImageUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  maxSizeMB: PropTypes.number,
  className: PropTypes.string,
  previewClassName: PropTypes.string,
  uploadButtonText: PropTypes.string,
  fieldName: PropTypes.string,
};

ImageUpload.defaultProps = {
  disabled: false,
  maxSizeMB: 2,
  className: '',
  previewClassName: 'w-32 h-32',
  uploadButtonText: 'Upload Image',
  fieldName: 'file',
  value: null,
};

export { ImageUpload };
export default ImageUpload;