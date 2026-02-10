import React, { useState, useEffect } from 'react';

const SearchFilter = ({ 
  onSearch, 
  onFilterChange, 
  filters = {}, 
  searchPlaceholder = "Search...",
  filterOptions = {},
  showSearch = true,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState(filters);

  // Update local state when filters prop changes
  useEffect(() => {
    setFilterValues(filters);
  }, [filters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilterValues = { ...filterValues, [filterName]: value };
    setFilterValues(newFilterValues);
    if (onFilterChange) {
      onFilterChange(newFilterValues);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    const clearedFilters = {};
    Object.keys(filterValues).forEach(key => {
      clearedFilters[key] = '';
    });
    setFilterValues(clearedFilters);
    
    if (onSearch) onSearch('');
    if (onFilterChange) onFilterChange(clearedFilters);
  };

  const renderFilterField = (filterName, options) => {
    if (options.type === 'select') {
      return (
        <select
          value={filterValues[filterName] || ''}
          onChange={(e) => handleFilterChange(filterName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{options.placeholder || `Select ${filterName}`}</option>
          {options.options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (options.type === 'multi-select') {
      return (
        <select
          multiple
          value={filterValues[filterName] || []}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
            handleFilterChange(filterName, selectedOptions);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (options.type === 'date-range') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={filterValues[`${filterName}From`] || ''}
            onChange={(e) => handleFilterChange(`${filterName}From`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filterValues[`${filterName}To`] || ''}
            onChange={(e) => handleFilterChange(`${filterName}To`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    } else {
      return (
        <input
          type={options.type || 'text'}
          value={filterValues[filterName] || ''}
          onChange={(e) => handleFilterChange(filterName, e.target.value)}
          placeholder={options.placeholder || `Filter by ${filterName}`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {showSearch && (
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {showFilters && Object.keys(filterOptions).map((filterName, index) => (
          <div key={filterName} className={`md:col-span-${filterOptions[filterName].colSpan || 2}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filterOptions[filterName].label || filterName.charAt(0).toUpperCase() + filterName.slice(1)}
            </label>
            {renderFilterField(filterName, filterOptions[filterName])}
          </div>
        ))}

        <div className={`flex items-end ${showSearch ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <button
            onClick={clearFilters}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;