import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import colors from '../../theme/colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState('');
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleJumpToPage = () => {
    const page = parseInt(jumpPage);
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        padding: '24px',
        background: `linear-gradient(180deg, ${colors.background.overlay}, ${colors.background.card})`,
        border: `1px solid ${colors.border.default}`,
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        marginTop: '24px'
      }}
    >
      {/* Results Counter */}
      <p style={{ margin: 0, fontSize: '14px', color: colors.text.secondary }}>
        Showing{' '}
        <span style={{ color: colors.primary.base, fontWeight: '600' }}>{startItem}</span> to{' '}
        <span style={{ color: colors.primary.base, fontWeight: '600' }}>{endItem}</span> of{' '}
        <span style={{ color: colors.primary.base, fontWeight: '600' }}>{totalItems}</span> results
      </p>

      {/* Page Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: currentPage === 1 ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.2)',
            border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: '8px',
            color: currentPage === 1 ? '#64748B' : '#14B8A6',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = 'rgba(20,184,166,0.3)';
              e.currentTarget.style.color = '#06B6D4';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = 'rgba(20,184,166,0.2)';
              e.currentTarget.style.color = '#14B8A6';
            }
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                page === currentPage
                  ? 'linear-gradient(135deg, #14B8A6, #06B6D4)'
                  : page === '...'
                    ? 'transparent'
                    : 'rgba(20,184,166,0.1)',
              border: page === '...' ? 'none' : '1px solid rgba(20,184,166,0.3)',
              borderRadius: '8px',
              color: page === currentPage ? 'white' : page === '...' ? '#94A3B8' : '#94A3B8',
              cursor: page === '...' ? 'default' : 'pointer',
              fontWeight: page === currentPage ? '600' : '500',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (page !== '...' && page !== currentPage) {
                e.currentTarget.style.background = 'rgba(20,184,166,0.3)';
                e.currentTarget.style.color = '#14B8A6';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== '...' && page !== currentPage) {
                e.currentTarget.style.background = 'rgba(20,184,166,0.1)';
                e.currentTarget.style.color = '#94A3B8';
              }
            }}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: currentPage === totalPages ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.2)',
            border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: '8px',
            color: currentPage === totalPages ? '#64748B' : '#14B8A6',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = 'rgba(20,184,166,0.3)';
              e.currentTarget.style.color = '#06B6D4';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = 'rgba(20,184,166,0.2)';
              e.currentTarget.style.color = '#14B8A6';
            }
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Jump to Page */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <label
          htmlFor="jumpPage"
          style={{ fontSize: '14px', color: '#94A3B8' }}
        >
          Go to page:
        </label>
        <input
          id="jumpPage"
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleJumpToPage();
            }
          }}
          placeholder="Enter page #"
          style={{
            width: '80px',
            padding: '8px 12px',
            background: 'rgba(1, 1, 1, 0.3)',
            border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: '6px',
            color: '#E2E8F0',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(20,184,166,0.6)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(20,184,166,0.3)';
          }}
        />
        <button
          onClick={handleJumpToPage}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
