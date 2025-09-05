import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  currentLocation: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  currentLocation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
      onLocationSelect(searchTerm);
      setSearchTerm('');
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Location</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-white/90 text-sm mb-2">Current location:</p>
        <p className="text-white font-medium">{currentLocation}</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        </div>
        
        <button
          type="submit"
          disabled={!searchTerm.trim() || isSearching}
          className="w-full py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed border border-white/20 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search Location
            </>
          )}
        </button>
      </form>
    </div>
  );
};