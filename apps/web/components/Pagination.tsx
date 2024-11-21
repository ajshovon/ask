import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface propsType {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: propsType) => {
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    const pages = [1];

    if (startPage > 2) {
      pages.push(-1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push(-1);
    }

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex md:justify-end justify-center mt-6">
      <nav className="flex sm:gap-2 gap-1 flex-wrap" aria-label="Pagination">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronsLeft />
        </button>
        {visiblePages.map((page, index) => (
          <button key={index} onClick={() => page > 0 && onPageChange(page)} disabled={page === -1} className={`sm:px-3 px-2 py-1 text-sm rounded-md ${page === currentPage ? 'bg-[#F4F4F5] dark:bg-[#19191C] border border-default' : 'hover:bg-[#F4F4F5] dark:hover:bg-[#19191C]'} ${page === -1 ? 'disabled:cursor-default' : ''}`}>
            {page > 0 ? page : '...'}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronsRight />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
