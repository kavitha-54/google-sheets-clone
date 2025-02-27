import React from 'react';

const Cell = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="cell"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Cell;