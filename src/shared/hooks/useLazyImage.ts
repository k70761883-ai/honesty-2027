import { useEffect, useRef, useState } from 'react';

interface UseLazyImageProps {
  src: string;
  threshold?: number;
  rootMargin?: string;
}

export const useLazyImage = ({ src, threshold = 0.1, rootMargin = '50px' }: UseLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(true); // Still set loaded true to show fallback
      };
    }
  }, [isInView, isLoaded, src]);

  return { imgRef, isLoaded, isInView };
};

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ECF2FF"/%3E%3C/svg%3E',
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  ...props
}) => {
  const { imgRef, isLoaded, isInView } = useLazyImage({ src, threshold, rootMargin });

  return (
    <img
      ref={imgRef}
      src={isInView ? (isLoaded ? src : placeholder) : placeholder}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
