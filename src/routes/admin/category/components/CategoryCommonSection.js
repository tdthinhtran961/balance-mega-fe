import React from 'react';

export const CategoryAboveSection = ({ title='' }) => {
  return (
    <h1 className="text-center py-2 bg-gray-100 text-sm text-teal-900 font-semibold rounded-t-lg border border-gray-200">
      {title}
    </h1>
  );
};

export const CategoryBellowSection = () => {
  return (
    <p className="text-[10px] text-gray-500 italic leading-4 font-normal mt-2 mb-5">
      (*)Tên danh mục không được để trống
    </p>
  );
};
