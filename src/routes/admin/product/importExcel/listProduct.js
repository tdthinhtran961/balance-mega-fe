import { ColumnErrorTable, ColumnSuccessDataTable } from 'columns/product';
import { Message } from 'components';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { routerLinks } from 'utils';

function ListProduct({ setStep, dataExcel, handDelete, dataSubmit, setDataSubmit }) {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleDelete = (idx) => {
    const newData = dataSubmit.filter(i => i.index !== idx);
    setDataSubmit(newData)
  }
  const [, ErrorDataTable] = HookDataTable({
    onRow: (data) => ({
      // onDoubleClick: (event) => navigate(routerLinks('ProductDetail') + `?id=${data.id}`),
    }),
    save: false,
    isLoading,
    setIsLoading,
    sort: 'sort',

    Get: async (params) => {
      return { data: dataExcel.fail.data, count: dataExcel?.fail.pagination?.total ?? 1 };
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} dữ liệu`,
    // paginationDescription: (data) => {console.log(data)},
    columns: ColumnErrorTable({ roleCode }),
    showSearch: false,
    showPagination: false,
    yScroll: 500,
    xScroll: 1600
  });

  const [_handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      // onDoubleClick: (event) => navigate(routerLinks('ProductDetail') + `?id=${data.id}`),
    }),
    save: false,
    isLoading,
    setIsLoading,
    sort: 'sort',
    Get: async (params) => {
      return { data: dataSubmit, count: dataExcel?.success.pagination?.total ?? 1 };
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} dữ liệu`,
    columns: ColumnSuccessDataTable({ roleCode, handDelete, handleDelete }),
    showSearch: false,
    showPagination: false,
    yScroll: 500,
    xScroll: 1600

  });

  useEffect(() => {
    _handleChange()
  }, [dataSubmit])


  return (
    <div className="min-h-screen">
      <h2 className="text-2xl text-teal-900 font-bold mb-6">Thêm sản phẩm</h2>
      <div className="bg-white rounded-[10px] p-4">
        <h2 className="font-bold text-teal-900 text-base">{dataExcel?.fail?.count ?? 0} dữ liệu không hợp lệ</h2>
        {ErrorDataTable()}
        <div className="my-6">
          <hr />
        </div>
        <h2 className="font-bold text-teal-900 text-base">{dataSubmit.length + '/' + (dataExcel?.success?.data?.length + dataExcel?.fail?.data?.length) ?? ''} dữ liệu hợp lệ</h2>
        {DataTable()}
      </div>
      <div className="flex justify-between mt-6 button-product-group">
        <button
          onClick={() => setStep(1)}
          className="px-8 py-3 h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600 back-product-button"
          id="backBtn"
        >
          Trở về
        </button>
        <button
          onClick={() => {
            if (dataExcel.fail.data?.length === 0) {
              window.scrollTo(0, 0);
              setStep(3);
              return navigate(routerLinks('ProductImport') + `?step=3`);
            } else {
              Message.confirm({
                text: 'Các dữ liệu không hợp lệ sẽ bị xoá. Bạn có muốn tiếp tục?', onConfirm: () => {
                  window.scrollTo(0, 0);
                  setStep(3);
                  return navigate(routerLinks('ProductImport') + `?step=3`);
                }
              })
            }

          }}
          disabled={dataSubmit.length === 0}
          className="w-[133px] h-[44px] text-sm bg-teal-900 text-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px]"
          id="continueBtn"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
}

export default ListProduct;
