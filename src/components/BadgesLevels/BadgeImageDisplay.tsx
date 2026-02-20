import React, { useState } from 'react';
import Image from 'next/image';

interface CustomComponentProps {
  id: string;
  data: Record<string, any>;
  refetch?: () => void;
}

const BadgeImageDisplay = ({ data }: CustomComponentProps): React.JSX.Element => {
  const imageUrl = data?.imageUrl;
  const [imageError, setImageError] = useState(false);

  if (!imageUrl) {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">No Image</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">Error</span>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-gray-200">
      <Image
        src={imageUrl}
        alt={data?.name || 'Badge/Level'}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default BadgeImageDisplay;
