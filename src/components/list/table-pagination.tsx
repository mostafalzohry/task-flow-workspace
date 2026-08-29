"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  page,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: TablePaginationProps) => {
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 px-1"
    >
      <p className="text-sm font-medium text-muted-foreground">Page {page}</p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="lg"
          className="h-10 px-4"
          variant="outline"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          startIcon={<ChevronLeft />}
        >
          Previous
        </Button>
        <Button
          type="button"
          size="lg"
          className="h-10 px-4"
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
};

export default TablePagination;
