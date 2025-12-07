import { Response } from 'express';
import { format } from 'date-fns';

export interface ExportOptions {
  filename: string;
  exportedBy: string;
  timestamp?: Date;
  data: any[];
  format: 'csv' | 'json';
}

/**
 * Export data to CSV with watermark
 */
export const exportToCSV = (options: ExportOptions, res: Response): void => {
  const { filename, exportedBy, timestamp = new Date(), data } = options;

  if (data.length === 0) {
    res.status(400).json({ error: 'No data to export' });
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvRows: string[] = [];

  // Add watermark as comment
  csvRows.push(`# Easy11 Commerce Intelligence Platform`);
  csvRows.push(`# Exported by: ${exportedBy}`);
  csvRows.push(`# Exported at: ${format(timestamp, 'yyyy-MM-dd HH:mm:ss')}`);
  csvRows.push(`# Total records: ${data.length}`);
  csvRows.push('');

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Escape commas and quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');

  // Set headers for download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}_${format(timestamp, 'yyyyMMdd_HHmmss')}.csv"`);
  res.send(csvContent);
};

/**
 * Export data to JSON with watermark
 */
export const exportToJSON = (options: ExportOptions, res: Response): void => {
  const { filename, exportedBy, timestamp = new Date(), data } = options;

  const exportData = {
    metadata: {
      platform: 'Easy11 Commerce Intelligence',
      exportedBy,
      exportedAt: format(timestamp, 'yyyy-MM-dd HH:mm:ss'),
      totalRecords: data.length,
    },
    data,
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}_${format(timestamp, 'yyyyMMdd_HHmmss')}.json"`);
  res.json(exportData);
};

/**
 * Hash email for PII protection in exports
 */
export const hashEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '***@***.com';
  
  const visibleChars = Math.min(1, name.length);
  return `${name.substring(0, visibleChars)}***@***.${domain.split('.').pop()}`;
};

/**
 * Validate export size limits
 */
export const validateExportSize = (recordCount: number, maxRecords: number = 10000): void => {
  if (recordCount > maxRecords) {
    throw new Error(`Export too large. Maximum ${maxRecords} records allowed. Please add filters.`);
  }
};

