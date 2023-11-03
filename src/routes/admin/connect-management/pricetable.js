import { HookDataTable } from 'hooks';
import { ColumnPrice } from 'columns/connect-management';
import { ConnectManagementService } from 'services/connect-management';
import React, { useState } from 'react';
const LazyTable = ({ idProduct }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [handlePriceChange, DataPriceTable] = HookDataTable({
    onRow: (data) => ({}),
    // onDoubleClick
    className:"tablePriceProductRequest",
    save: false,
    isLoading,
    setIsLoading,
    id: () => idProduct,
    Get: ConnectManagementService.getPriceDetails,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    showPagination: false,
    showSearch: false,
    columns: 
    ColumnPrice({
      handleChange: async () => await handlePriceChange(),
    }),
  });
 
  return (
    <>
      <div>{DataPriceTable()}</div>
    </>
  );
};

export default LazyTable;
