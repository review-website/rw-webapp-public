'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceDelay?: number;
  className?: string;
}

export function SearchBar({ 
  placeholder = '搜索模组、作者或标签...', 
  onSearch, 
  debounceDelay = 300,
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceDelay]);

  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}