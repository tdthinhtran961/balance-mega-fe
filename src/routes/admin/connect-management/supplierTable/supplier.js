import { Message } from 'components';
import React, { useState } from 'react';
import { routerLinks } from 'utils';
import { ConnectManagementService } from 'services/connect-management';
import { HookDataTable, HookModal } from 'hooks';
import { ColumnSupplier } from 'columns/connect-management';
// import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ERole } from 'variable';
// import { useAuth } from 'global';
const SupplierData = ({ getSupplierList, statusCheck, roleCode, idRequest, formatDate }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onClick: async (event) => {
        if (event.target.getAttribute('class') && event.target.getAttribute('class').includes('connectBtn')) {
          if ((roleCode === 'OWNER_STORE' || roleCode === ERole.sales)) {
            const res = await ConnectManagementService.storeAcceptSupplier(data.id);
            res && Message.success({ text: `Kết nối thành công` });
            return navigate(`${routerLinks('ConnectManagement')}`);
          }
          // return;
        } else if (event.target.getAttribute('class') && event.target.getAttribute('class').includes('deleteBtn')) {
          if (roleCode === 'ADMIN') {
            await ConnectManagementService.adminDeleteSuggestedSupplier(data.id);
            getSupplierList();
            await handleChange();
            // return navigate(`${routerLinks('ConnectManagement')}`);
          }
          // return;
        } else if (event.target.getAttribute('class') && event.target.getAttribute('class').includes('priceBtn')) {
          await handlePrice(data);
        } else await handleDetail(data);
      },
    }),
    save: false,
    isLoading,
    showSearch: false,
    setIsLoading,
    // idProp: idRequest,
    id: () => idRequest,
    Get: roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR' && ConnectManagementService.getSupplier,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} người dùng`,
    columns:
      roleCode &&
      //   statusCheck &&
      //   localStorage.getItem(`status_${idRequest}`) &&
      ColumnSupplier({
        formatDate,
        handleChange: async () => await handleChange(),
        roleCode,
        // statusCheckS: statusCheck,
        statusCheck,
      }),
    showPagination: false,
  });
  const [handlePrice, ModalPrice] = HookModal({
    className: 'priceModal',
    title: (data) => <span className="text-xl text-teal-900 font-semibold">Bảng giá</span>,
    isLoading,
    setIsLoading,
    handleChange: async () => await handlePrice(),
    onOk: async (data) => {},
    widthModal: 1000,
    idElement: 'ConnectManagement',
    textCancel: 'Đóng',
    showSubmitButton: false,
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-center gap-5 buttonGroup">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
            text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Trở về'}
        </button>
      </div>
    ),
  });

  const [handleDetail, ModalDetailForm, ...propDetail] = HookModal({
    className: 'detailSupplier' + ' ' + ((roleCode === 'OWNER_STORE' || roleCode === ERole.sales) ? 'SUBMIT' : 'DELETE'),
    title: (data) => <span className="text-xl text-teal-900 font-semibold">Chi tiết sản phẩm</span>,
    isLoading,
    setIsLoading,
    handleChange: async () => await handleDetail(),
    columns: ColumnSupplier({}),

    onOk: async (data) => {
      if ((roleCode === 'OWNER_STORE' || roleCode === ERole.sales)) {
        const res = await ConnectManagementService.storeAcceptSupplier(data.id);
        res && Message.success({ text: `Kết nối thành công` });
        return navigate(`${routerLinks('ConnectManagement')}`);
      } else if (roleCode === 'ADMIN') {
        await ConnectManagementService.adminDeleteSuggestedSupplier(data.id);
        propDetail[2]();
        getSupplierList();
        await handleChange();
      }
    },
    GetById: roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR' && ConnectManagementService.getByIdSupplier,
    widthModal: 1000,
    idElement: 'ConnectManagement',
    textSubmit: (roleCode === 'OWNER_STORE' || roleCode === ERole.sales) ? 'Yêu cầu kết nối' : 'Xóa nhà cung cấp',
    textCancel: 'Trở về',
    showSubmitButton:
      statusCheck === 'WAITING_ADMIN' || (statusCheck === 'WAITING_STORE' && (roleCode === 'OWNER_STORE' || roleCode === ERole.sales)),
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-center gap-5 buttonGroup">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
            text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Trở về'}
        </button>
        {
          <button
            type={'button'}
            className={
              'py-2.5 px-2 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1 w-[166px] text-center submitbtn'
            }
            onClick={handleOk}
            hidden={roleCode === 'ADMIN' && statusCheck === 'WAITING_STORE'}
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {(roleCode === 'OWNER_STORE' || roleCode === ERole.sales) ? 'Đồng ý kết nối' : 'Xóa nhà cung cấp'}
          </button>
        }
      </div>
    ),
  });
  return [handleChange, DataTable, ModalDetailForm, ModalPrice];
};
export default SupplierData;
