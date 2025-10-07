import React from 'react';
import './TimeRangeFilter.css';

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ value, onChange, className = '' }) => {
  const options = [
    { value: '7d' as TimeRange, label: '7 jours' },
    { value: '30d' as TimeRange, label: '30 jours' },
    { value: '90d' as TimeRange, label: '90 jours' },
    { value: '1y' as TimeRange, label: '1 an' },
    { value: 'all' as TimeRange, label: 'Tout' }
  ];

  return (
    <div className={`time-range-filter ${className}`}>
      {options.map(option => (
        <button
          key={option.value}
          className={value === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeFilter;
