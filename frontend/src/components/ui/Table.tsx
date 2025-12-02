import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick }) => {
  return (
    <tr
      className={`border-b border-gray-300 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className="border border-gray-300 px-4 py-2">{children}</td>;
};


