import React from "react";
import { ImageUpload } from "@/components/common/ImageUpload";

interface BadgeImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const BadgeImageUpload: React.FC<BadgeImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <ImageUpload
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxSizeMB={2}
      previewClassName="w-32 h-32"
      uploadButtonText="Upload Image"
      fieldName="file"
    />
  );
};

export { BadgeImageUpload };
