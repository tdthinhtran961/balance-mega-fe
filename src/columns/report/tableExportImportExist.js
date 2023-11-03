import { formatCurrency } from "utils";



const valueCheck = (value) => {
  if (value === null || value === undefined) {
    return 0
  }
  return formatCurrency(value, ' ')
}
const totalPrice = (qty, price) =>{
  if(!qty || !price) return 0
  return formatCurrency(qty * price, ' ')
}
const Column = () => {
  return [
    {
      title: 'Mã vạch',
      name: 'productStoreBarcode',
      // width: 150,
      tableItem: {
        rowSpan: 2,
        width: 150,
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        rowSpan: 2,
        width: 180,
        render: (v, record) => `${record?.productName} (${record?.inventoryProductUnit?.unitName})`
      },
    },
    {
      title: 'Nhà cung cấp',
      name: 'suppplierName',
      tableItem: {
        rowSpan: 2,
        width: 180,
      },
    },
    {
      title: 'Tồn đầu kỳ',
      name: 'code',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.inventoryFirst)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.inventoryFirst, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Nhập trong kỳ',
      name: 'supplierName',
      tableItem: {
        width: 180,
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.importGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.importGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Trả trong kỳ',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.returnGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.returnGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Hủy trong kỳ',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.disposalGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.disposalGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Chuyển (Nhận)',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.transferReceiveGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.transferReceiveGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Chuyển (Xuất)',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.transferExportGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.transferExportGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Bán hàng',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.sellGoods)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.sellGoods, record?.productPrice)
          },
        ],

      },
    },
    {
      title: 'Tồn cuối kỳ',
      name: 'supplierName',
      tableItem: {
        children: [
          {
            title: 'SL',
            dataIndex: 'SL',
            align: 'center',
            render: (v, record) => valueCheck(record?.inventoryLast)
          },
          {
            title: 'Tiền',
            dataIndex: 'Tiền',
            align: 'center',
            render: (v, record) => totalPrice(record?.inventoryLast, record?.productPrice)
          },
        ],

      },
    },
  ];
};
export default Column;
