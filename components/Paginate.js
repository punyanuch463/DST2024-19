import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pagesToShow = 3;
  let startPage = currentPage - Math.floor(pagesToShow / 2);
  let endPage = currentPage + Math.floor(pagesToShow / 2);
  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(pagesToShow, totalPages);
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(totalPages - pagesToShow + 1, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <FaChevronLeft />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
