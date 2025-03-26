
import React from 'react';
import { Search } from 'lucide-react';

interface AttendanceFiltersProps {
  searchQuery: string;
  filterDate: string;
  filterStatus: string;
  filterVerification: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onVerificationFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AttendanceFilters = ({
  searchQuery,
  filterDate,
  filterStatus,
  filterVerification,
  onSearchChange,
  onDateFilterChange,
  onStatusFilterChange,
  onVerificationFilterChange,
}: AttendanceFiltersProps) => {
  return (
    <div className="p-4 border-b">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name"
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
        </div>
        
        {/* Date filter */}
        <div>
          <input
            type="date"
            value={filterDate}
            onChange={onDateFilterChange}
            className="px-4 py-2 border rounded-md w-full"
          />
        </div>
        
        {/* Status filter */}
        <div>
          <select
            value={filterStatus}
            onChange={onStatusFilterChange}
            className="px-4 py-2 border rounded-md w-full"
          >
            <option value="all">All Statuses</option>
            <option value="on-time">On Time</option>
            <option value="late">Late</option>
          </select>
        </div>
        
        {/* Verification method filter */}
        <div>
          <select
            value={filterVerification}
            onChange={onVerificationFilterChange}
            className="px-4 py-2 border rounded-md w-full"
          >
            <option value="all">All Methods</option>
            <option value="face">Face Recognition</option>
            <option value="fingerprint">Fingerprint</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
