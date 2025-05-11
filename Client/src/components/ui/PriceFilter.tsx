import React, { useState, useEffect } from 'react';

interface PriceFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onChange }) => {
  const [localMin, setLocalMin] = useState<string>(minPrice?.toString() || '');
  const [localMax, setLocalMax] = useState<string>(maxPrice?.toString() || '');

  useEffect(() => {
    if (minPrice !== undefined) setLocalMin(minPrice.toString());
    if (maxPrice !== undefined) setLocalMax(maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    const min = localMin ? parseInt(localMin) : undefined;
    const max = localMax ? parseInt(localMax) : undefined;
    onChange(min, max);
  };

  const handleReset = () => {
    setLocalMin('');
    setLocalMax('');
    onChange(undefined, undefined);
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h3 className="font-bold text-lg mb-4">Фильтр цены</h3>
      <div className="flex gap-2 items-center mb-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Мин</span>
          </label>
          <input 
            type="number" 
            placeholder="0" 
            className="input input-bordered input-sm w-full max-w-xs" 
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            min="0"
          />
        </div>
        <div className="mt-8">-</div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Макс</span>
          </label>
          <input 
            type="number" 
            placeholder="1000" 
            className="input input-bordered input-sm w-full max-w-xs" 
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            min="0"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleApply} className="btn btn-sm btn-primary">Применить</button>
        <button onClick={handleReset} className="btn btn-sm btn-ghost">Сбросить</button>
      </div>
    </div>
  );
};

export default PriceFilter;
