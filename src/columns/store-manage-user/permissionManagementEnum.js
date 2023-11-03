const PERMISSION_MANAGEMENT_ENUM = {
  userManagement: {
    topic: 'userManagement',
    checkAll: 'Quản lý người dùng',
    child: ['Truy cập/Xem thông tin', 'Thêm người dùng', 'Chỉnh sửa thông tin', 'Xóa người dùng'],
  },
  goodsManagement: {
    topic: 'goodsManagement',
    checkAll: 'Quản lý hàng hóa',
    child: [
      'Truy cập/Xem thông tin',
      'Thêm sản phẩm Non-Balance',
      'Chỉnh sửa SP Non-Balance',
      'Xóa sản phẩm Non-Balance',
    ],
  },
  supplierManagement: {
    topic: 'supplierManagement',
    checkAll: 'Quản lý NCC',
    child: ['Xem thông tin NCC', 'Xóa sản phẩm Non-Balance', 'Chỉnh sửa NCC Non-Balance'],
  },
  storeManagement: {
    topic: 'storeManagement',
    checkAll: 'Quản lý cửa hàng',
    child: ['Xem thông tin', 'Chỉnh sửa thông tin cửa hàng', 'Xem doanh thu sản phẩm', 'Xem doanh thu đơn hàng'],
  },
  order: {
    topic: 'order',
    checkAll: 'Đặt hàng',
    child: ['Đặt hàng'],
  },
  branchManagement: {
    topic: 'branchManagement',
    checkAll: 'Quản lý chi nhánh',
    child: ['Xem thông tin', 'Thêm chi nhánh', 'Chỉnh sửa thông tin chi nhánh'],
  },
  connectManagement: {
    topic: 'connectManagement',
    checkAll: 'Quản lý kết nối',
    child: ['Xem thông tin', 'Tạo mới yêu cầu kết nối', 'Kết nối/Từ chối NCC'],
  },
  revenueManagement: {
    topic: 'revenueManagement',
    checkAll: 'Quản lý doanh thu',
    child: ['Doanh thu CH', 'Doanh thu NCC', 'Chiết khấu NCC'],
  },
  goodsTransfer: {
    topic: 'goodsTransfer',
    checkAll: 'Chuyển hàng',
    child: ['Xem thông tin chuyển hàng', 'Chuyển hàng', 'Nhận hàng'],
  },
  orderManagement: {
    topic: 'orderManagement',
    checkAll: 'Quản lý đơn hàng',
    child: ['Xem thông tin đơn hàng', 'Nhập/Hủy đơn hàng'],
  },
  goodsDisposal: {
    topic: 'goodsDisposal',
    checkAll: 'Hủy hàng',
    child: ['Xem thông tin hủy hàng', 'Hủy hàng'],
  },
  promotionGoods: {
    topic: 'promotionGoods',
    checkAll: 'Nhập hàng KM',
    child: ['Xem thông tin nhập hàng KM', 'Nhập hàng khuyến mại'],
  },
  goodsReturn: {
    topic: 'goodsReturn',
    checkAll: 'Trả hàng',
    child: ['Xem thông tin trả hàng', 'Trả hàng'],
  },
  nonBalOrder: {
    topic: 'nonBalOrder',
    checkAll: 'Nhập hàng Non Balance',
    child: ['Xem thông tin nhập hàng NB', 'Nhập hàng Non-Balance'],
  },
  inventory: {
    topic: 'inventory',
    checkAll: 'Tồn kho',
    child: ['Xem thông tin tồn kho'],
  },
};

export default PERMISSION_MANAGEMENT_ENUM;
