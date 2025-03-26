
import { AttendanceRecord } from '../utils/types';
import AttendanceFilters from './attendance/AttendanceFilters';
import AttendanceTable from './attendance/AttendanceTable';
import AttendancePagination from './attendance/AttendancePagination';
import { useAttendanceList } from './attendance/AttendanceListLogic';

interface AttendanceListProps {
  records: AttendanceRecord[];
}

const AttendanceList = ({ records }: AttendanceListProps) => {
  const {
    searchQuery,
    filterDate,
    filterStatus,
    filterVerification,
    currentRecords,
    currentPage,
    totalPages,
    totalRecords,
    indexOfFirstRecord,
    indexOfLastRecord,
    handleSearch,
    handleDateFilter,
    handleStatusFilter,
    handleVerificationFilter,
    handleExport,
    goToNextPage,
    goToPrevPage
  } = useAttendanceList({ records });
  
  return (
    <div className="bg-white rounded-lg shadow border animate-fade-in">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Attendance Records</h2>
      </div>
      
      {/* Filters */}
      <AttendanceFilters 
        searchQuery={searchQuery}
        filterDate={filterDate}
        filterStatus={filterStatus}
        filterVerification={filterVerification}
        onSearchChange={handleSearch}
        onDateFilterChange={handleDateFilter}
        onStatusFilterChange={handleStatusFilter}
        onVerificationFilterChange={handleVerificationFilter}
      />
      
      {/* Records table */}
      <AttendanceTable records={currentRecords} />
      
      {/* Pagination and export */}
      <AttendancePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        indexOfFirstRecord={indexOfFirstRecord}
        indexOfLastRecord={indexOfLastRecord}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onExport={handleExport}
      />
    </div>
  );
};

export default AttendanceList;
