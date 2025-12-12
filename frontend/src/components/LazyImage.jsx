import { useState, useEffect } from 'react';

/**
 * Image component with lazy loading and optimization
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23f3f4f6" width="300" height="200"/%3E%3C/svg%3E',
  onLoad,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let observer;
    
    if (imageRef && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          rootMargin: '50px' // Start loading 50px before image enters viewport
        }
      );
      
      observer.observe(imageRef);
    } else {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

/**
 * Progressive image component - loads low quality first, then high quality
 */
export const ProgressiveImage = ({ 
  lowQualitySrc, 
  highQualitySrc, 
  alt, 
  className = '',
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
  }, [highQualitySrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`progressive-image ${className} ${isHighQualityLoaded ? 'high-quality' : 'low-quality'}`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

/**
 * Background image component with lazy loading
 */
export const LazyBackgroundImage = ({ 
  src, 
  children, 
  className = '',
  placeholder = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ...props 
}) => {
  const [backgroundImage, setBackgroundImage] = useState(placeholder);
  const [divRef, setDivRef] = useState();

  useEffect(() => {
    let observer;
    
    if (divRef && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setBackgroundImage(`url(${src})`);
              };
              observer.unobserve(divRef);
            }
          });
        },
        {
          rootMargin: '100px'
        }
      );
      
      observer.observe(divRef);
    }

    return () => {
      if (observer && divRef) {
        observer.unobserve(divRef);
      }
    };
  }, [divRef, src]);

  return (
    <div
      ref={setDivRef}
      className={`lazy-background ${className}`}
      style={{ backgroundImage }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Adaptive image component - serves different sizes based on viewport
 */
export const AdaptiveImage = ({ 
  srcSet, 
  alt, 
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) => {
  return (
    <LazyImage
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default LazyImage;
