import React, { useRef, useState, useEffect, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setScrollTop(scrollContainerRef.current.scrollTop);
    }
  }, []);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simpler version for lists with variable heights
interface SimpleVirtualListProps<T> {
  items: T[];
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  estimatedItemHeight?: number;
}

export function SimpleVirtualList<T>({
  items,
  containerHeight,
  renderItem,
  estimatedItemHeight = 50,
}: SimpleVirtualListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(
    Math.ceil(containerHeight / estimatedItemHeight) + 10
  );
  const [startIndex, setStartIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const newStartIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - 5);
      setStartIndex(newStartIndex);
    }
  }, [estimatedItemHeight]);

  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
    >
      {visibleItems.map((item, index) => (
        <div key={startIndex + index}>
          {renderItem(item, startIndex + index)}
        </div>
      ))}
    </div>
  );
}
