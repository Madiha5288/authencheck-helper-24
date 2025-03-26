
import React from 'react';
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react';

interface AttendancePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  indexOfFirstRecord: number;
  indexOfLastRecord: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onExport: () => void;
}

const AttendancePagination = ({
  currentPage,
  totalPages,
  totalRecords,
  indexOfFirstRecord,
  indexOfLastRecord,
  onPrevPage,
  onNextPage,
  onExport,
}: AttendancePaginationProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing {totalRecords > 0 ? indexOfFirstRecord + 1 : 0}-
        {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} records
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onExport}
          className="flex items-center px-3 py-1.5 text-sm border rounded-md hover:bg-accent"
        >
          <FileDown size={16} className="mr-1" />
          Export
        </button>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onPrevPage}
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
            onClick={onNextPage}
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
  );
};

export default AttendancePagination;
