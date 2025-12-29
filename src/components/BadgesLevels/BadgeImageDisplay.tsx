import React from 'react';
import Image from 'next/image';

interface CustomComponentProps {
  id: string;
  data: Record<string, any>;
  refetch?: () => void;
}

const BadgeImageDisplay = ({ data }: CustomComponentProps): React.JSX.Element => {
  const imageUrl = data?.imageUrl;

  if (!imageUrl) {
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">No Image</span>
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
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.nextElementSibling) {
            (target.nextElementSibling as HTMLElement).classList.remove('hidden');
          }
        }}
      />
      <div className="hidden w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">Error</span>
      </div>
    </div>
  );
};

export default BadgeImageDisplay;
