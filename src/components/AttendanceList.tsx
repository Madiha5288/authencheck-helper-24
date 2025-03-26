
import { useState } from 'react';
import { AttendanceRecord } from '../utils/types';
import { ChevronLeft, ChevronRight, Search, FileDown, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceListProps {
  records: AttendanceRecord[];
}

const AttendanceList = ({ records }: AttendanceListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');
  
  const recordsPerPage = 8;
  
  // Apply filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = filterDate ? record.date.toISOString().split('T')[0] === filterDate : true;
    const matchesStatus = filterStatus === 'all' ? true : record.status === filterStatus;
    const matchesVerification = filterVerification === 'all' ? true : record.verificationMethod === filterVerification;
    
    return matchesSearch && matchesDate && matchesStatus && matchesVerification;
  });
  
  // Sort by date (most recent first)
  const sortedRecords = [...filteredRecords].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Paginate
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle date filter
  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle status filter
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle verification method filter
  const handleVerificationFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterVerification(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle export (mock functionality)
  const handleExport = () => {
    alert('Export functionality would be implemented here in a production app.');
  };
  
  // Pagination controls
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="bg-white rounded-lg shadow border animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Attendance Records</h2>
      </div>
      
      {/* Filters and search */}
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
              onChange={handleSearch}
              placeholder="Search by name"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
          </div>
          
          {/* Date filter */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={handleDateFilter}
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>
          
          {/* Status filter */}
          <div>
            <select
              value={filterStatus}
              onChange={handleStatusFilter}
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
              onChange={handleVerificationFilter}
              className="px-4 py-2 border rounded-md w-full"
            >
              <option value="all">All Methods</option>
              <option value="face">Face Recognition</option>
              <option value="fingerprint">Fingerprint</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Records table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check In</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check Out</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{record.userName}</td>
                  <td className="px-4 py-3 text-sm">{format(record.date, 'PP')}</td>
                  <td className="px-4 py-3 text-sm">{format(record.checkInTime, 'p')}</td>
                  <td className="px-4 py-3 text-sm">{format(record.checkOutTime, 'p')}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'on-time' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {record.status === 'on-time' ? 'On time' : 'Late'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1">
                      {record.verificationMethod === 'face' ? (
                        <>
                          <UserCheck size={14} className="text-primary" />
                          <span>Face</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint size={14} className="text-primary" />
                          <span>Fingerprint</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination and export */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRecords.length > 0 ? indexOfFirstRecord + 1 : 0}-
          {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-1.5 text-sm border rounded-md hover:bg-accent"
          >
            <FileDown size={16} className="mr-1" />
            Export
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md hover:bg-accent ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <span className="text-sm mx-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-1 rounded-md hover:bg-accent ${
                currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
