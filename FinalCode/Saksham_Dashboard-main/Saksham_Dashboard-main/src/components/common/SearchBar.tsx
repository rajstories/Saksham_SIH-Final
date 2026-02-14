import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search trainings, incidents, organizations..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

