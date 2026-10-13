import {
  type ColumnDef,
  type RowData,
  type SortingState,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: {} as { align?: 'right' },
})

type Features = typeof features

/** Column helper bound to DataTable's features. */
export const columnHelper = <T extends RowData>() =>
  createColumnHelper<Features, T>()

const SHOW_ALL = Number.MAX_SAFE_INTEGER

export function DataTable<T extends RowData>({
  columns,
  data,
  caption,
  empty = 'Nothing here yet.',
  pageSize,
  initialSorting = [],
}: {
  columns: ColumnDef<Features, T, any>[]
  data: T[]
  /** Describes the table for screen readers. */
  caption: string
  empty?: React.ReactNode
  pageSize?: number
  initialSorting?: SortingState
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize ?? SHOW_ALL,
  })
  const table = useTable({
    features,
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  })

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const right = header.column.columnDef.meta?.align === 'right'
                  const label = flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                  return (
                    <TableHead
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : undefined
                      }
                      className={cn(right && 'text-right')}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'inline-flex items-center gap-1 hover:text-foreground',
                            right && 'flex-row-reverse'
                          )}
                        >
                          {label}
                          {sorted === 'asc' ? (
                            <ArrowUpIcon className="size-3" />
                          ) : sorted === 'desc' ? (
                            <ArrowDownIcon className="size-3" />
                          ) : (
                            <ArrowUpDownIcon className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        label
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.align === 'right' &&
                          'text-right tabular-nums'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center text-muted-foreground"
                >
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pageSize && table.getPageCount() > 1 && (
        <nav
          aria-label={`${caption} pages`}
          className="flex items-center justify-end gap-2 text-sm"
        >
          <span className="text-muted-foreground">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  )
}
