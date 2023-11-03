import React from 'react';
import PermissionCheckBoxGroup from 'routes/admin/store-manage-user/permission-management/PermissionCheckBoxGroup';
import PERMISSION_MANAGEMENT_ENUM from './permissionManagementEnum';

const Column = ({ pageType = '', roleList, roleCode, status, branchList, setPermissionCheckBox }) => {
  return [
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {},
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                setPermissionCheckBox={setPermissionCheckBox}
                optionsArr={PERMISSION_MANAGEMENT_ENUM.userManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.userManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.userManagement.topic}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.goodsManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.goodsManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.goodsManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.supplierManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.supplierManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.supplierManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.storeManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.storeManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.storeManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.order.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.order.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.order.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.branchManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.branchManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.branchManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.connectManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.connectManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.connectManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.goodsTransfer.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.goodsTransfer.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.goodsTransfer.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.orderManagement.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.orderManagement.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.orderManagement.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.goodsDisposal.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.goodsDisposal.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.goodsDisposal.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.promotionGoods.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.promotionGoods.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.promotionGoods.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.goodsReturn.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.goodsReturn.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.goodsReturn.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.nonBalOrder.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.nonBalOrder.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.nonBalOrder.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
    {
      title: '',
      name: 'code',
      formItem: {
        col: '6',
        type: 'checkbox',
        onChange: (values, form) => {
        },
        render: () => {
          return (
            <>
              <PermissionCheckBoxGroup
                optionsArr={PERMISSION_MANAGEMENT_ENUM.inventory.child}
                valueCheckAll={PERMISSION_MANAGEMENT_ENUM.inventory.checkAll}
                name={PERMISSION_MANAGEMENT_ENUM.inventory.topic}
                setPermissionCheckBox={setPermissionCheckBox}
              />
            </>
          );
        },
      },
    },
  ];
};
export default Column;
