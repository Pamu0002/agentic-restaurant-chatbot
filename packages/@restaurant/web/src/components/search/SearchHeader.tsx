import { Search, X } from 'lucide-react';
import { useState } from 'react';
import colors from '../../theme/colors';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchHeader({ onSearch, initialQuery = '' }: SearchHeaderProps) {
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const suggestions = [
    { emoji: '🍲', text: 'Sri Lankan restaurants near me' },
    { emoji: '🦐', text: 'Best seafood in Colombo' },
    { emoji: '⭐', text: 'Top rated restaurants' },
    { emoji: '🍝', text: 'Italian cuisine' },
    { emoji: '🥢', text: 'Asian fusion' },
    { emoji: '🎉', text: 'Fine dining experiences' }
  ];

  const handleSearch = () => {
    onSearch(searchInput);
    setShowAutocomplete(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    onSearch(suggestion);
    setShowAutocomplete(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        marginBottom: '24px',
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          background: `linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,140,66,0.1))`,
          padding: '16px',
          borderRadius: '12px',
          border: `2px solid ${colors.border.default}`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(1, 1, 1, 0.3)',
            borderRadius: '8px',
            paddingLeft: '12px',
            border: `1px solid ${colors.border.default}`,
            transition: 'all 0.3s ease'
          }}
        >
          <Search size={20} style={{ color: colors.primary.base }} />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowAutocomplete(true);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowAutocomplete(true)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              padding: '8px 0',
              placeholderColor: colors.text.secondary
            }}
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                onSearch('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.secondary,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: '10px 24px',
            background: colors.gradient.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 12px rgba(255, 107, 53, 0.3)`,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 6px 16px rgba(255, 107, 53, 0.5)`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 12px rgba(255, 107, 53, 0.3)`;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Search
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: `linear-gradient(180deg, ${colors.background.overlay}, ${colors.background.card})`,
            border: `1px solid ${colors.border.default}`,
            borderRadius: '12px',
            zIndex: 50,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(suggestion.text)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: colors.text.primary,
                transition: 'all 0.2s ease',
                borderBottom: idx < suggestions.length - 1 ? `1px solid ${colors.border.default}` : 'none',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(255, 107, 53, 0.15)`;
                e.currentTarget.style.color = colors.primary.light;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <span style={{ fontSize: '16px' }}>{suggestion.emoji}</span>
              <span>{suggestion.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
