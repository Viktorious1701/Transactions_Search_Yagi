// app/api/transactions/route.ts
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 20; // Number of records per page

    const filePath = path.join(process.cwd(), 'data', 'transactions.csv');
    console.log('Attempting to read file:', filePath);
    let fileContents = await fs.readFile(filePath, 'utf8');
   // console.log('File read successfully. Content length:', fileContents.length);
    // Remove BOM if present
    if (fileContents.charCodeAt(0) === 0xFEFF) {
      fileContents = fileContents.slice(1);
    }
    
    // console.log('File read successfully. Content length:', fileContents.length);
    // console.log('First 100 characters:', fileContents.substring(0, 100));  

    const allRecords: Transaction[] = parse(fileContents, {
      columns: true,
      skip_empty_lines: true
    });
    console.log('Total records parsed:', allRecords.length);

    const startIndex = (page - 1) * pageSize;
    const paginatedRecords = allRecords.slice(startIndex, startIndex + pageSize);
    console.log(`Returning page ${page} with ${paginatedRecords.length} records`);
    
    return NextResponse.json({
      records: paginatedRecords,
      totalRecords: allRecords.length,
      currentPage: page,
      totalPages: Math.ceil(allRecords.length / pageSize)
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}