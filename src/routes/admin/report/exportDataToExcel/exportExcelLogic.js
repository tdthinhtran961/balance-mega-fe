import React from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import ExcelJS from 'exceljs';
import { t } from 'i18next';
import moment from 'moment';

const convertedDate = (date) => {
  if (!date) return null;
  const reFormattedDate = moment(date, 'YYYY/MM/DD');
  return reFormattedDate.format('DD/MM/YYYY');
};

export const ExportCSV = ({ csvData, fileName, headExcelInfo, supplierList, storeList, fullTextSearchURL }) => {
  const supplierName = supplierList.find((item) => item?.id === headExcelInfo?.idSupplier);
  const storeName = storeList.find((item) => item?.id === headExcelInfo?.idStore);

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet([]);

    // Tiêu đề file Excel
    XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH PHIẾU KHO']], { origin: 'C1' });

    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm theo mã phiếu:', headExcelInfo.fullTextSearch || fullTextSearchURL]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Từ ngày', convertedDate(headExcelInfo?.filterDate?.dateFrom) || '']], {
      origin: 'A4',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Đến ngày', convertedDate(headExcelInfo?.filterDate?.dateTo) || '']], {
      origin: 'A5',
    });
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          'Lọc theo loại phiếu',
          headExcelInfo.type === 'RECIEVED'
            ? 'Nhập hàng'
            : headExcelInfo.type === 'RETURN'
            ? 'Trả hàng'
            : headExcelInfo.type === 'DISPOSAL'
            ? 'Hủy hàng'
            : headExcelInfo.type === 'TRANSFER_SEND'
            ? 'Chuyển hàng'
            : headExcelInfo.type === 'TRANSFER_RECIEVED'
            ? 'Nhận hàng'
            : '',
        ],
      ],
      { origin: 'E3' },
    );
    XLSX.utils.sheet_add_aoa(ws, [['Lọc theo cửa hàng', headExcelInfo.storeName || storeName?.name]], { origin: 'E4' });
    XLSX.utils.sheet_add_aoa(ws, [['Lọc theo nhà cung cấp', headExcelInfo.supplierName || supplierName?.name]], { origin: 'E5' });
    XLSX.utils.sheet_add_aoa(ws, [['Lọc theo trạng thái', headExcelInfo.status]], { origin: 'H3' });
    XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A8' });

    const style = {
      font: { name: 'Times New Roman', sz: 14 },
      fill: { fgColor: { rgb: 'D3D3D3' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
      },
      alignment: { horizontal: 'center' },
    };

    // for (let row = 1; row <= csvData.length; row++) {
    //   for (let col = 1; col <= csvData[0].length; col++) {
    //     const cell = XLSX.utils.encode_cell({ r: row, c: col });
    //     XLSX.utils.cell_set_style(ws, cell, style);
    //   }
    // }

    for (let row = 8; row <= csvData.length; row++) {
      for (let col = 1; col <= csvData[0].length; col++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: col });
        ws[cell].s = style;
      }
    }
    // ws['A1'].l = { Target:"https://sheetjs.com", Tooltip:"Find us @ SheetJS.com!" };
    // const cell_address = XLSX.utils.encode_cell({ c: 1, r: 1 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer', cellStyles: true });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[171px] h-11 justify-center disabled:opacity-60 disabled:pointer-events-none"
      onClick={(e) => exportToCSV(csvData, fileName)}
      disabled={csvData.length === 0}
    >
      {t('Xuất báo cáo')}
    </button>
  );
};
