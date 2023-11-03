import { ERole } from "variable";

const Layout = (roleCode) => [
  {
    icon: 'lab la-buffer',
    name: 'Dashboard',
  },
  {
    icon: 'las la-boxes',
    name: 'Đặt hàng',
  },
  {
    icon: 'las la-clipboard-list',
    name: 'Quản lý kho',
    child: [
      {
        name: 'Quản lý đơn hàng',
      },
      {
        name: 'Nhập Hàng Trực Tiếp',
      },
      {
        name: 'Nhập hàng N-Balance',
      },
      {
        name: 'Hủy hàng',
      },
      {
        name: 'Trả hàng',
      },
      {
        name: 'Quản lý chuyển hàng',
      },
      {
        name: 'Chuyển hàng',
      },
      roleCode === 'OWNER_STORE' && {
        name: 'Tồn kho',
      },
      {
        name: 'Kiểm kê',
      },
    ],
  },
  {
    icon: 'las la-chart-bar',
    name: 'Báo cáo',
    child: [
      {
        name: 'Xuất nhập tồn',
      },
      {
        name: 'Danh sách phiếu kho',
      },
    ],
  },
  roleCode !== 'OWNER_STORE' && {
    icon: 'las la-clipboard-list',
    name: 'Quản lý đơn hàng',
  },
  roleCode === 'OWNER_SUPPLIER' && {
    iconSvg: '/images/return.svg',
    name: 'Quản lý trả hàng',
  },
  (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && {
    icon: 'las la-tags',
    name: 'Quản lý khuyến mãi',
    child: [
      {
        name: 'Quản lý voucher',
      },
    ],
  },
  {
    icon: 'las la-link',
    name: 'Quản lý kết nối',
    child: [
      { name: 'Kết nối' },
      // { name: 'Hợp đồng' }
    ],
  },
  roleCode === 'OWNER_STORE' && {
    icon: 'las la-user-friends',
    name: 'Quản lý người dùng ',
  },
  (roleCode === 'ADMIN' || roleCode === 'OWNER_STORE' || roleCode === 'DISTRIBUTOR') && {
    icon: 'las la-user-friends',
    name: 'Quản lý người dùng',
  },

  {
    icon: 'las la-shopping-cart',
    name: 'Quản lý hàng hóa',
    pageUrl: '/merchandise-managerment',
    child: [
      {
        name: 'Sản phẩm',
      },
      {
        name: 'Danh mục',
      },
      {
        name: 'Thuế',
      },
    ],
  },
  roleCode === 'OWNER_STORE' && {
    icon: 'las la-luggage-cart',
    name: 'Quản lý NCC',
  },
  roleCode === 'ADMIN'
    ? {
        icon: 'las la-luggage-cart',
        name: 'Quản lý nhà cung cấp',
      }
    : {
        icon: 'las la-luggage-cart',
        name: 'Quản lý nhà cung cấp',
        child: [
          {
            name: 'Thông tin NCC',
          },
          {
            name: 'Doanh thu',
          },
          {
            name: 'Chiết khấu',
          },
          {
            name: 'Hợp đồng',
          },
        ],
      },
  roleCode === 'ADMIN'
    ? {
        icon: 'las la-store-alt',
        name: 'Quản lý cửa hàng',
      }
    : {
        icon: 'las la-store-alt',
        name: 'Quản lý cửa hàng',
        child: [
          {
            name: 'Thông tin cửa hàng',
          },
          {
            name: 'Quản lý chi nhánh',
          },
          {
            name: 'Doanh thu theo SP',
          },
          {
            name: 'Doanh thu theo ĐH',
          },
          {
            name: 'Quản lý kho',
          },
        ],
      },

  roleCode === 'DISTRIBUTOR' && {
    icon: 'las la-warehouse',
    name: 'Quản lý kho',
    child: [
      {
        name: 'Yêu cầu nhập hàng',
      },
      {
        name: 'Nhập hàng',
      },
      {
        name: 'Tồn kho',
      },
      {
        name: 'Cài đặt kho',
      },
    ],
  },
  {
    icon: 'las la-link',
    name: 'Quản lý hợp đồng',
  },
  {
    icon: 'las la-hand-holding-usd',
    name: 'Doanh thu',
  },

  roleCode === 'ADMIN' && {
    icon: 'las la-chart-area',
    name: 'Quản lý doanh thu',
    child: [
      {
        name: 'Doanh thu CH',
      },
      {
        name: 'Doanh thu NCC',
      },
      {
        name: 'Chiết khấu NCC',
      },
    ],
  },
  roleCode === 'OWNER_STORE' && {
    icon: 'las la-ban',
    name: 'Hủy hàng',
  },
  roleCode === 'ADMIN' && {
    icon: 'las la-cog',
    name: 'Cấu hình chung',
  },
  roleCode === ERole.sales && {
    icon: 'las la-user-friends',
    name: 'Quản lý khách hàng',
  }
];
export default Layout;
