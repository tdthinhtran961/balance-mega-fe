// import { Table } from 'antd'
import React from 'react';

export const DataExcel = ({ dataExcel }) => {
  const DataRow = (dataItem, index) => {
    return (
      <tr key={index} className="even">
        <td> {index + 1} </td>
        <td>{dataItem.code}</td>
        <td>{dataItem.createdAt}</td>
        <td>{dataItem.supplierName}</td>
        <td>{dataItem.popn}</td>
        <td>{dataItem.storeName}</td>
        <td>{dataItem.moneyTotal}</td>
        <td>{dataItem.status}</td>
        <td>{dataItem.createPerson}</td>
      </tr>
    );
  };

  const DataTable = dataExcel.map((itemRow, index) => DataRow(itemRow, index));

  const tableHeader = (
    <thead className="bgvi">
      <tr>
        <th>STT</th>
        <th>Mã phiếu</th>
        <th>Ngày tạo</th>
        <th>Tên nhà cung cấp</th>
        <th>PO/RN</th>
        <th>CH Nhập/Xuất</th>
        <th>Tổng tiền</th>
        <th>Trạng thái</th>
        <th>Người tạo</th>
      </tr>
    </thead>
  );

  return (
    <table>
      {tableHeader}
      <tbody>{DataTable}</tbody>
    </table>
  );
};
