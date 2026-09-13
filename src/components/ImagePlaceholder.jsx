import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function ImagePlaceholder({ 
  label = 'Image Placeholder', 
  aspectRatio = '16 / 9',
  imageUrl = null,
  altText = 'Placeholder'
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  return (
    <div 
      className="image-placeholder" 
      style={{ aspectRatio }}
      aria-label={label}
    >
      {imageUrl && !hasError ? (
        <img 
          src={imageUrl} 
          alt={altText} 
          onError={() => setHasError(true)}
        />
      ) : (
        <>
          <ImageIcon className="image-placeholder-icon" aria-hidden="true" />
          <span className="image-placeholder-label">[ {label} ]</span>
        </>
      )}
    </div>
  );
}
