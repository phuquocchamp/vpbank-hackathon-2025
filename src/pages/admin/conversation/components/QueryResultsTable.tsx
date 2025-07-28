import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface QueryResultsTableProps {
  results: any[];
  maxRows?: number;
}

export const QueryResultsTable = ({ results, maxRows = 10 }: QueryResultsTableProps) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No results returned
      </div>
    );
  }

  const displayedRows = results.slice(0, maxRows);
  const columns = Object.keys(results[0]);

  return (
    <div className="space-y-2">
      <ScrollArea className="w-full rounded-md border">
        <div className="max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="font-mono text-sm">
                      {String(row[column] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {results.length > maxRows && (
        <p className="text-xs text-center text-muted-foreground">
          Showing first {maxRows} rows of {results.length} total rows
        </p>
      )}
    </div>
  );
};
