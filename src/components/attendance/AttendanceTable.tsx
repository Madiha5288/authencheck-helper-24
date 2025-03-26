
import React from 'react';
import { format } from 'date-fns';
import { UserCheck, Fingerprint } from 'lucide-react';
import { AttendanceRecord } from '../../utils/types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const AttendanceTable = ({ records }: AttendanceTableProps) => {
  return (
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
          {records.length > 0 ? (
            records.map((record) => (
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
  );
};

export default AttendanceTable;
