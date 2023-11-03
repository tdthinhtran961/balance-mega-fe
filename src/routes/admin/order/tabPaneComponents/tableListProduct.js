import { Table } from 'antd';
import React from 'react';
import { formatCurrency } from 'utils';
import { SupplierService } from 'services/supplier';
import '../index.less';
import { taxApply } from 'constants/index';

const TableProduct = ({ expandedRowRender, dataInto, data, setIsLoadingPrint, tabKey, filterTax }) => {
  const columns = filterTax === taxApply.APPLY ? [
    {
      title: 'Đợt',
      dataIndex: 'name',
      key: 'name',
      className: 'border-none  text-left  ',
      width: '7%',
      height: 10,
    },
    {
      title: 'Thời gian nhập hàng',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Tổng tiền sau thuế (VND)',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text, record) => formatCurrency(text, ''),
    },
    {
      title: '',
      dataIndex: 'export',
      key: 'export',
      hidden: +tabKey === 4,
      className: 'border-r-0',
      render: (text, record) => (
        <a
          className="  text-teal-900  text-decoration-line underline text-sm"
          onClick={async () => {
            setIsLoadingPrint(true);
            const response = await SupplierService.printPurchaseOrderTemp(record.id);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
            link.target = '_blank';
            // link.download = values.fileName || values.name;
            link.download = `Phiếu đặt hàng tạm - Đợt ${+record.name} - Mã đơn: ${data.code}`;
            document.body.appendChild(link);
            link.click();
            link?.parentNode?.removeChild(link);
            setIsLoadingPrint(false);
          }}
        >
          Xuất phiếu tạm
        </a>
      ),
    },
  ].filter((col) => !col.hidden) : [
    {
      title: 'Đợt',
      dataIndex: 'name',
      key: 'name',
      className: 'border-none  text-left  ',
      width: '7%',
      height: 10,
    },
    {
      title: 'Thời gian nhập hàng',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '',
      dataIndex: 'export',
      key: 'export',
      hidden: +tabKey === 4,
      className: 'border-r-0',
      render: (text, record) => (
        <a
          className="  text-teal-900  text-decoration-line underline text-sm"
          onClick={async () => {
            setIsLoadingPrint(true);
            const response = await SupplierService.printPurchaseOrderTemp(record.id);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
            link.target = '_blank';
            // link.download = values.fileName || values.name;
            link.download = `Phiếu đặt hàng tạm - Đợt ${+record.name} - Mã đơn: ${data.code}`;
            document.body.appendChild(link);
            link.click();
            link?.parentNode?.removeChild(link);
            setIsLoadingPrint(false);
          }}
        >
          Xuất phiếu tạm
        </a>
      ),
    },
  ].filter((col) => !col.hidden)

  return (
    <div className="w-full">
      <Table
        columns={columns}
        className='parent-extended-table'
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: [0],
        }}
        scroll={{ y: 4000 }}
        pagination={false}
        dataSource={dataInto.map((ele, index) => {
          return { ...ele, key: index };
        })}
      />
    </div>
  );
};
export default TableProduct;
