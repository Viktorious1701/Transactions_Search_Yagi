'use client';
import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import HighlightText from '@/components/HighlightText';
import Loading from './loading';

interface Transaction {
  date_time: string;
  trans_no: string;
  credit: string;
  debit: string;
  detail: string;
}

interface PaginatedResponse {
  records: Transaction[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);  // Added loading state

  const fetchData = useCallback(async (query: string, page: number) => {
    try {
      setLoading(true);  // Set loading to true when starting fetch
      const url = new URL('/api/transactions/search', window.location.origin);
      url.searchParams.append('q', query);
      url.searchParams.append('page', page.toString());
      if (sortColumn) {
        url.searchParams.append('sortColumn', sortColumn);
        url.searchParams.append('sortDirection', sortDirection);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaginatedResponse = await response.json();
      setTransactions(data.records);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Fetching error:", error);
    } finally {
      setLoading(false);  // Set loading to false after fetch completes
    }
  }, [sortColumn, sortDirection]);

  const debouncedFetchData = useCallback(
    debounce((query: string, page: number) => fetchData(query, page), 1000),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(searchQuery, currentPage);
  }, [debouncedFetchData, searchQuery, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      setLoading(true);  // Set loading to true when starting sort
    } else {
      setSortColumn(column);
      setSortDirection('asc');
      setLoading(true);  // Set loading to true when starting sort
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortColumn) return transactions;

    return [...transactions].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle date sorting
      if (sortColumn === 'date_time') {
        return sortDirection === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // Handle monetary value sorting (credit and debit)
      if (sortColumn === 'credit' || sortColumn === 'debit') {
        const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle string sorting (trans_no and detail)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Fallback for any other types
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortColumn, sortDirection]);

  return (
    <div className="container">
      <div className="shader-effect"></div>
      <header className="header">Transactions</header>
      <div className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search transactions..."
          className="search-input"
        />
      </div>
      
      {/* Show loading indicator when fetching */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  {(['date_time', 'trans_no', 'credit', 'debit', 'detail'] as const).map((column) => (
                    <th key={column} onClick={() => handleSort(column)}>
                      {column.charAt(0).toUpperCase() + column.slice(1).replace('_', ' ')}
                      {sortColumn === column && (
                        <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td><HighlightText text={transaction.date_time} highlight={searchQuery} /></td>
                    <td><HighlightText text={transaction.trans_no} highlight={searchQuery} /></td>
                    <td><HighlightText text={transaction.credit} highlight={searchQuery} /></td>
                    <td><HighlightText text={transaction.debit} highlight={searchQuery} /></td>
                    <td><HighlightText text={transaction.detail} highlight={searchQuery} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
