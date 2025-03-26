
import { useState } from 'react';
import { AttendanceRecord } from '../../utils/types';

export interface AttendanceListLogicProps {
  records: AttendanceRecord[];
  recordsPerPage?: number;
}

export interface UseAttendanceListResult {
  searchQuery: string;
  filterDate: string;
  filterStatus: string;
  filterVerification: string;
  currentPage: number;
  currentRecords: AttendanceRecord[];
  totalPages: number;
  totalRecords: number;
  indexOfFirstRecord: number;
  indexOfLastRecord: number;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleVerificationFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleExport: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export const useAttendanceList = ({
  records,
  recordsPerPage = 8
}: AttendanceListLogicProps): UseAttendanceListResult => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');
  
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

  return {
    searchQuery,
    filterDate,
    filterStatus,
    filterVerification,
    currentPage,
    currentRecords,
    totalPages,
    totalRecords: filteredRecords.length,
    indexOfFirstRecord,
    indexOfLastRecord,
    handleSearch,
    handleDateFilter,
    handleStatusFilter,
    handleVerificationFilter,
    handleExport,
    goToNextPage,
    goToPrevPage
  };
};
