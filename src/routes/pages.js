import React from 'react';
import { routerLinks } from 'utils';

export const pages = [
  {
    layout: React.lazy(() => import('../layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('./auth/login')),
        title: 'Login',
      },
      {
        path: routerLinks('ForgotPass'),
        component: React.lazy(() => import('./auth/forget-password')),
        title: 'Forgot Password',
      },
      {
        path: routerLinks('ResetPass'),
        component: React.lazy(() => import('./auth/reset-password')),
        title: 'Reset Password',
      },
      {
        path: routerLinks('SendOTP'),
        component: React.lazy(() => import('./auth/send-otp')),
        title: 'Send Otp',
      },

    ],
  },
  {
    layout: React.lazy(() => import('../layouts/admin')),
    isPublic: false,
    child: [
      {
        path: routerLinks('Dashboard'),
        component: React.lazy(() => import('./admin/dashboard')),
        title: 'Dashboard',
      },
      // Product
      {
        path: routerLinks("Product"),
        component: React.lazy(() => import("./admin/product")),
        title: "Category",
      },
      {
        path: routerLinks("ProductCreate"),
        component: React.lazy(() => import("./admin/product/detail")),
        title: "Category",
      },
      {
        path: routerLinks("ProductEdit"),
        component: React.lazy(() => import("./admin/product/detail")),
        title: "Category",
      },
      {
        path: routerLinks("ProductDetail"),
        component: React.lazy(() => import("./admin/product/detail")),
        title: "Category",
      },
      // Store
      {
        path: routerLinks("Quản lý cửa hàng"),
        component: React.lazy(() => import("./admin/store")),
        title: "Store",
      },
      {
        path: routerLinks("StoreInfo"),
        component: React.lazy(() => import("./admin/store/detail")),
        title: "StoreInfo",
      },
      {
        path: routerLinks("RevenueByProduct"),
        component: React.lazy(() => import("./admin/store/components/revenueByProduct")),
        title: "RevenueByProduct",
      },
      {
        path: routerLinks("RevenueByOrder"),
        component: React.lazy(() => import("./admin/store/components/revenueByOrder")),
        title: "RevenueByOrder",
      },
      {
        path: routerLinks("InventoryManagement"),
        component: React.lazy(() => import("./admin/store/components/inventoryManagement")),
        title: "InventoryManagement",
      },
      {
        path: routerLinks("StoreCreate"),
        component: React.lazy(() => import("./admin/store/create")),
        title: "Store",
      },
      {
        path: routerLinks("StoreEdit"),
        component: React.lazy(() => import("./admin/store/detail")),
        title: "Store",
      },
      {
        path: routerLinks("StoreDetail"),
        component: React.lazy(() => import("./admin/store/detail")),
        title: "Store",
      },
      // User
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('./admin/user')),
        title: 'User',
      },
      {
        path: routerLinks('UserCreate'),
        component: React.lazy(() => import('./admin/user/detail')),
        title: 'User',
      },
      {
        path: routerLinks('UserDetail'),
        component: React.lazy(() => import('./admin/user/detail')),
        title: 'User',
      },
      {
        path: routerLinks('UserEdit'),
        component: React.lazy(() => import('./admin/user/detail')),
        title: 'User',
      },
      // Category
      {
        path: routerLinks('Category'),
        component: React.lazy(() => import('./admin/category')),
        title: 'Category',
      },
      {
        path: routerLinks('CategoryCreate'),
        component: React.lazy(() => import('./admin/category/detail')),
        title: 'Category',
      },
      {
        path: routerLinks('CategoryEdit'),
        component: React.lazy(() => import('./admin/category/detail')),
        title: 'Category',
      },
      {
        path: routerLinks('CategoryDetail'),
        component: React.lazy(() => import('./admin/category/detail')),
        title: 'Category',
      },
      // Supplier
      {
        path: routerLinks('Supplier'),
        component: React.lazy(() => import('./admin/supplier/index.js')),
        title: 'Supplier',
      },
      {
        path: routerLinks('SupplierCreate'),
        component: React.lazy(() => import('./admin/supplier/addSupplier.js')),
        title: 'Supplier',
      },
      {
        path: routerLinks('SupplierDetail'),
        component: React.lazy(() => import('./admin/supplier/supplierDetail.js')),
        title: 'Supplier',
      },
      {
        path: routerLinks('SupplierEdit'),
        component: React.lazy(() => import('./admin/supplier/supplierDetail.js')),
        title: 'Supplier',
      },
      // Order
      {
        path: routerLinks('OrderManagement'),
        component: React.lazy(() => import('./admin/order/index.js')),
        title: 'OrderManagement',
      },
      {
        path: routerLinks('OrderDetail'),
        component: React.lazy(() => import('./admin/order/detail.js')),
        title: 'OrderDetail',
      },
      {
        path: routerLinks('OrderEdit'),
        component: React.lazy(() => import('./admin/order/edit.js')),
        title: 'OrderEdit',
      },
      // Cart
      {
        path: routerLinks('CartDetail'),
        component: React.lazy(() => import('./admin/input-product/cartDetail')),
        title: 'Cart',
      },
      {
        path: routerLinks('CartSalesDetail'),
        component: React.lazy(() => import('./admin/input-product/cartSalesDetail')),
        title: 'SalesCart',
      },
      // Input Product
      {
        path: routerLinks('InputProduct'),
        component: React.lazy(() => import('./admin/input-product/index')),
        title: 'InputProduct',
      },
      {
        path: routerLinks('InputProductDetail'),
        component: React.lazy(() => import('./admin/input-product/index')),
        title: 'InputProduct',
      },
      {
        path: routerLinks('ConnectManagement'),
        component: React.lazy(() => import('./admin/connect-management')),
        title: 'ConnectManagement',
      },
      {
        path: routerLinks('Connect'),
        component: React.lazy(() => import('./admin/connect-management')),
        title: 'Connect',
      },
      {
        path: routerLinks('Contract'),
        component: React.lazy(() => import('./admin/connect-management/contract-store-supplier/index')),
        title: 'Contract',
      },
      {
        path: routerLinks('ContractDetailBetweenStoreNSupplier'),
        component: React.lazy(() => import('./admin/connect-management/contract-store-supplier/detail.js')),
        title: 'ContractDetailBetweenStoreNSupplier',
      },
      {
        path: routerLinks('SampleContractBetweenStoreNSupplier'),
        component: React.lazy(() => import('./admin/connect-management/contract-store-supplier/sampleContract.js')),
        title: 'SampleContractBetweenStoreNSupplier',
      },
      {
        path: routerLinks('RequestDetail'),
        component: React.lazy(() => import('./admin/connect-management/detail')),
        title: 'RequestDetail',
      },
      {
        path: routerLinks('PromotionOrderDetail'),
        component: React.lazy(() => import('./admin/order/promotionDetail.js')),
        title: 'PromotionOrderDetail',
      },
      {
        path: routerLinks('RevenueDetail'),
        component: React.lazy(() => import('./admin/revenue/revenue.js')),
        title: 'Revenue',
      },
      {
        path: routerLinks('SampleContract'),
        component: React.lazy(() => import('./admin/supplier/contract/contractFrame')),
        title: 'Contract',
      },
      {
        path: routerLinks('DiscountDetail'),
        component: React.lazy(() => import('./admin/supplier/DiscountDetail')),
        title: 'DiscountDetail',
      },
      {
        path: routerLinks('Profile'),
        component: React.lazy(() => import('./admin/profile')),
        title: 'Profile',
      },
      {
        path: routerLinks('SupplierInfo'),
        component: React.lazy(() => import('./admin/supplier/supplierDropdownNavbar/SupplierInfo')),
        title: 'SupplierInfo',
      },
      {
        path: routerLinks('Revenue'),
        component: React.lazy(() => import('./admin/supplier/supplierDropdownNavbar/SupplierRevenue')),
        title: 'Revenue',
      },
      {
        path: routerLinks('Discount'),
        component: React.lazy(() => import('./admin/supplier/supplierDropdownNavbar/SupplierDiscount')),
        title: 'Discount',
      },
      {
        path: routerLinks('SupplierContract'),
        component: React.lazy(() => import('./admin/supplier/supplierDropdownNavbar/SupplierContract')),
        title: 'SupplierContract',
      },
      // Promotial
      {
        path: routerLinks('PromotionalGoods'),
        component: React.lazy(() => import('./admin/promotional-goods/index')),
        title: 'PromotionalGoods',
      },
      {
        path: routerLinks('PromotionalGoodsDetail'),
        component: React.lazy(() => import('./admin/promotional-goods/detail.js')),
        title: 'PromotionalGoods',
      },
      {
        path: routerLinks('PromotionalGoodsCreate'),
        component: React.lazy(() => import('./admin/promotional-goods/detail.js')),
        title: 'PromotionalGoods',
      },
      {
        path: routerLinks('PromotionalGoodsEdit'),
        component: React.lazy(() => import('./admin/promotional-goods/detail.js')),
        title: 'PromotionalGoods',
      },
      // Disposal
      {
        path: routerLinks('DisposalGoodsDetail'),
        component: React.lazy(() => import('./admin/disposal-goods/detail.js')),
        title: 'DisposalGoods',
      },
      {
        path: routerLinks('DisposalGoodsCreate'),
        component: React.lazy(() => import('./admin/disposal-goods/detail.js')),
        title: 'DisposalGoods',
      },
      {
        path: routerLinks('DisposalGoodsEdit'),
        component: React.lazy(() => import('./admin/disposal-goods/detail.js')),
        title: 'DisposalGoods',
      },
      {
        path: routerLinks("ProductImport"),
        component: React.lazy(() => import("./admin/product/importExcel/index.js")),
        title: "Category",
      },
      {
        path: routerLinks("Tax"),
        component: React.lazy(() => import("./admin/tax/index.js")),
        title: "Tax",
      },
      {
        path: routerLinks('DisposalGoods'),
        component: React.lazy(() => import('./admin/disposal-goods/index')),
        title: 'DisposalGoods',
      },
      {
        path: routerLinks('GoodReturn'),
        component: React.lazy(() => import('./admin/goods-return/index.js')),
        title: 'GoodReturn',
      },
      {
        path: routerLinks('GoodReturnSuccess'),
        component: React.lazy(() => import('./admin/goods-return/detail.js')),
        title: 'GoodReturn'
      },
      {
        path: routerLinks('GoodReturnDetail'),
        component: React.lazy(() => import('./admin/goods-return/detail.js')),
        title: "GoodReturn"
      },
      {
        path: routerLinks('GoodReturnCreate'),
        component: React.lazy(() => import('./admin/goods-return/detail.js')),
        title: "GoodReturn"
      },
      {
        path: routerLinks('GoodReturnEdit'),
        component: React.lazy(() => import('./admin/goods-return/detail.js')),
        title: "GoodReturn"
      },
      {
        path: routerLinks('ManageReturnGoods'),
        component: React.lazy(() => import('./admin/merchandise/returnGoodManagement')),
        title: 'ManageReturnGoods',
      },
      {
        path: routerLinks('ManageReturnGoodsDetail'),
        component: React.lazy(() => import('./admin/merchandise/returnGoodViewSup')),
        title: 'ManageReturnGoodsDetail',
      },
      {
        path: routerLinks("SupplierManagementByStore"),
        component: React.lazy(() => import("./admin/supplier-by-store/index")),
        title: "SupplierManagementByStore",
      },
      // Branch
      {
        path: routerLinks("BranchManagement"),
        component: React.lazy(() => import("./admin/store/components/brandManagement")),
        title: "BranchManagement",
      },
      {
        path: routerLinks("BranchCreate"),
        component: React.lazy(() => import("./admin/store/create")),
        title: "BranchManagement",
      },
      {
        path: routerLinks("BranchEdit"),
        component: React.lazy(() => import("./admin/store/detail")),
        title: "BranchManagement",
      },
       {
        path: routerLinks("BranchDetail"),
        component: React.lazy(() => import("./admin/store/detail")),
        title: "BranchManagement",
      },
      // Non Balance
      {
        path: routerLinks('ImportGoodsNonBal'),
        component: React.lazy(() => import('./admin/import-goods-from-nonBal/index')),
        title: 'ImportGoodsNonBal',
      },
      {
        path: routerLinks('ImportGoodsNonBalDetail'),
        component: React.lazy(() => import('./admin/import-goods-from-nonBal/detail.js')),
        title: 'ImportGoodsNonBal',
      },
      {
        path: routerLinks('ImportGoodsNonBalCreate'),
        component: React.lazy(() => import('./admin/import-goods-from-nonBal/detail.js')),
        title: 'ImportGoodsNonBal',
      },
      {
        path: routerLinks('ImportGoodsNonBalEdit'),
        component: React.lazy(() => import('./admin/import-goods-from-nonBal/detail.js')),
        title: 'ImportGoodsNonBal',
      },
      // Goods Transfer
      {
        path: routerLinks('GoodTransfer'),
        component: React.lazy(() => import(('./admin/goods-transfer/index.js'))),
        title: 'GoodTransfer'
      },
      {
        path: routerLinks('GoodTransferAdmin'),
        component: React.lazy(() => import(('./admin/goods-transfer/indexViewAdmin.js'))),
        title: 'GoodTransferAdmin'
      },
      {
        path: routerLinks('GoodTransferCreate'),
        component: React.lazy(() => import(('./admin/goods-transfer/detail.js'))),
        title: 'GoodTransfer'
      },
      {
        path: routerLinks('GoodTransferEdit'),
        component: React.lazy(() => import(('./admin/goods-transfer/detail.js'))),
        title: 'GoodTransfer'
      },
      {
        path: routerLinks('GoodTransferDetail'),
        component: React.lazy(() => import(('./admin/goods-transfer/detail.js'))),
        title: 'GoodTransfer'
      },
      {
        path: routerLinks('GoodReceiveDetail'),
        component: React.lazy(() => import(('./admin/goods-transfer/detail.js'))),
        title: 'GoodReceive'
      },
      {
        path: routerLinks('GoodTransferAdminDetail'),
        component: React.lazy(() => import(('./admin/goods-transfer/detail.js'))),
        title: 'GoodTransferAdminDetail'
      },
      {
        path: routerLinks('StoreManageUser'),
        component: React.lazy(() => import('./admin/store-manage-user')),
        title: 'StoreManageUser',
      },
      {
        path: routerLinks('StoreManageUserAdd'),
        component: React.lazy(() => import('./admin/store-manage-user/detail')),
        title: 'StoreManageUserAdd',
      },
      {
        path: routerLinks('StoreManageUserEdit'),
        component: React.lazy(() => import('./admin/store-manage-user/detail')),
        title: 'StoreManageUserEdit',
      },
      {
        path: routerLinks('ExportImportExist'),
        component: React.lazy(() => import('./admin/report/index.js')),
        title: 'ExportImportExist',
      },
      {
        path: routerLinks('ListOfStock'),
        component: React.lazy(() => import('./admin/report/stockListIndex.js')),
        title: 'ListOfStock',
      },
      {
        path: routerLinks('VoucherManagement'),
        component: React.lazy(() => import('./admin/promotion-management/index.js')),
        title: 'VoucherManagement',
      },
      {
        path: routerLinks('VoucherManagementCreate'),
        component: React.lazy(() => import('./admin/promotion-management/detail.js')),
        title: 'VoucherManagementCreate',
      },
      {
        path: routerLinks('VoucherManagementEdit'),
        component: React.lazy(() => import('./admin/promotion-management/detail.js')),
        title: 'VoucherManagementEdit',
      },
      {
        path: routerLinks('InventoryCheck'),
        component: React.lazy(() => import('./admin/inventory-check/index.js')),
        title: 'InventoryCheck',
      },
      {
        path: routerLinks('InventoryCheckCreate'),
        component: React.lazy(() => import('./admin/inventory-check/detail.js')),
        title: 'InventoryCheck',
      },
      {
        path: routerLinks('InventoryCheckEdit'),
        component: React.lazy(() => import('./admin/inventory-check/detail.js')),
        title: 'InventoryCheck',
      },
      {
        path: routerLinks('InventoryCheckEdit'),
        component: React.lazy(() => import('./admin/inventory-check/detail.js')),
        title: 'InventoryCheckEdit',
      },
      {
        path: routerLinks('RevenueManagementStore'),
        component: React.lazy(() => import('./admin/revenue-management/store/index.js')),
        title: 'RevenueManagementStore',
      },
      {
        path: routerLinks('RevenueManagementSupplier'),
        component: React.lazy(() => import('./admin/revenue-management/supplier/index.js')),
        title: 'RevenueManagementSupplier',
      },
      {
        path: routerLinks('RevenueManagementDiscount'),
        component: React.lazy(() => import('./admin/revenue-management/discount/index.js')),
        title: 'RevenueManagementDiscount',
      },
      // General configuration
      {
        path: routerLinks('GeneralConfiguration'),
        component: React.lazy(() => import('./admin/general-configuration/index.js')),
        title: 'GeneralConfiguration',
      },
      // sales
      {
        path: routerLinks('SalesManagementCustomer'),
        component: React.lazy(() => import('./admin/customer/index.js')),
        title: 'SalesManagementCustomer',
      },
    ], // 💬 generate link to here
  },
];

export const arrayPaths = [];
pages.map((layout) => {
  const paths = [];
  layout.child.map((page) => {
    paths.push(page.path);
    return page;
  });
  arrayPaths.push(paths);
  return layout;
});
