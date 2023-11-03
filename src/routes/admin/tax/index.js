import React, { Fragment, useState } from "react";
import './index.less'
import { useAuth } from "global";
import { HookDataTable, HookModalForm } from "hooks";
import { ColumnTax } from "columns/tax";
import { TaxService } from "services/tax";
import { useTranslation } from "react-i18next";



const Page = () => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [handleEdit, ModalForm, handleDelete] = HookModalForm({
    title: (data) => !data?.id ? 'Thêm mới thuế' : 'Chỉnh sửa thuế',
    isLoading, setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnTax({
      t,
      formatDate,
    }),
    GetById: TaxService.getById,
    Post: async (values) => {
      return await TaxService.post({ ...values})
    },
    Put: async (values, id) => {
      return TaxService.put({ ...values}, id)
    },
    Delete: TaxService.delete,
    widthModal: 600,
    idElement: 'user',
    textSubmit: 'Lưu',
    textCancel: 'Hủy',
    className: 'modalFormTax',

  });

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => { }
    }),
    save: false,
    isLoading,
    setIsLoading,
    filter: 'filter',
    Get: TaxService.get,
    columns: ColumnTax({
      t,
      formatDate,
      handleEdit,
      handleDelete,
    }),
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} thuế`,
    rightHeader: (
      <Fragment>
        <button
          className="bg-teal-900 text-white h-[44px] w-[156px] rounded-[10px] hover:bg-teal-700 lg:ml-4"
          onClick={() => handleEdit()}
        >
          <i className="las la-plus mr-1" />
          Thêm thuế
        </button>
      </Fragment>
    )
  });


  return <Fragment>
    <div className="tax-display min-h-screen">
      <p className="text-2xl font-bold text-teal-900 mb-8">Quản lý thuế</p>
      <div className="bg-white pt-6 pb-10 px-6 rounded-md table-tax">
        {DataTable()}
        {ModalForm()}
      </div>
    </div>
  </Fragment>;
};
export default Page;
