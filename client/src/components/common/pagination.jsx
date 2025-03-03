import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-6">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || totalPages === 1}
              className={`${
                currentPage <= 1 || totalPages === 1
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => onPageChange(index + 1)}
                className={`cursor-pointer transition-colors px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-gray-300 text-gray-900 font-semibold"
                    : "hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages || totalPages === 1}
              className={`${
                currentPage === totalPages || totalPages === 1
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
