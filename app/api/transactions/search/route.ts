// app/api/transactions/search/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { NextResponse } from 'next/server';

interface Transaction {
  date_time: string;
  trans_no: string;
  credit: string;
  debit: string;
  detail: string;
}

// Helper function to parse monetary values
function parseMonetaryValue(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 20;
    const sortColumn = searchParams.get('sortColumn') as keyof Transaction | null;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | null;

    const filePath = path.join(process.cwd(), 'data', 'transactions.csv');
    let fileContents = await fs.readFile(filePath, 'utf8');
    
    // Remove BOM if present
    if (fileContents.charCodeAt(0) === 0xFEFF) {
      fileContents = fileContents.slice(1);
    }

    const allRecords: Transaction[] = parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      ltrim: true,
      rtrim: true,
    });

    // Perform search on all columns
    const filteredRecords = allRecords.filter(record => 
      Object.values(record).some(value => 
        value.toLowerCase().includes(query.toLowerCase())
      )
    );

    // Sort the filtered records
    if (sortColumn && sortDirection) {
      filteredRecords.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortColumn === 'date_time') {
          return sortDirection === 'asc' 
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (sortColumn === 'credit' || sortColumn === 'debit') {
          const aNum = parseMonetaryValue(aValue);
          const bNum = parseMonetaryValue(bValue);
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    // Paginate the sorted and filtered records
    const startIndex = (page - 1) * pageSize;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      records: paginatedRecords,
      totalRecords: filteredRecords.length,
      currentPage: page,
      totalPages: Math.ceil(filteredRecords.length / pageSize)
    });

  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ error: 'Failed to search data' }, { status: 500 });
  }
}