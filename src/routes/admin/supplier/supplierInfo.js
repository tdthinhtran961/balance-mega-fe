import React, { useState, Fragment, useEffect } from 'react';
import { Form, Message } from 'components';

// import { UtilService } from "services/util";
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt } from 'antd';
import { SupplierService } from 'services/supplier';
import { ColumnSupplierForm } from 'columns/supplier';
// eslint-disable-next-line import/no-duplicates


const SupplierInfo = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const [data, setData] = useState({});

  useEffect(() => {
    const initFunction = async () => {
      if (idSupplier) {
        const res = await SupplierService.getById(idSupplier);
        if (res.isActive) {
          res.isActive = 1;
        } else {
          res.isActive = 2;
        }
        setData(res);
      }
    };
    initFunction();
  }, [idSupplier]);

  //   let title = '';

  //   switch (pageType) {
  //     case 'create':
  //       title = 'Thêm nhà cung cấp';
  //       break;
  //     case 'detail':
  //       title = 'Chi tiết nhà cung cấp';
  //       break;
  //     default:
  //       title = 'Nhà cung cấp';
  //       break;
  //   }

  const submit = async (values) => {
    try {
      let res;
      if (values.isActive === 1) {
        values.isActive = true;
      } else if (values.isActive === 2) {
        values.isActive = false;
      }
      const param = { ...values };
      setLoading(true);
      pageType === 'detail'
        ? (res = await SupplierService.post(param))
        : (res = await SupplierService.put(param, idSupplier));
      setLoading(false);
      if (res) {
        return navigate(`${routerLinks('Quản lý nhà cung cấp')}`);
      }
    } catch (err) {
      console.log('Error is:', err);
      setLoading(false);
    }
  };


  return (
    <Fragment>
       <div className="flex ">
              <Form
                className="ml-4 w-full"
                columns={ColumnSupplierForm({ pageType })}
                handSubmit={submit}
                checkHidden={true}
                classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                // isShowCancel={pageType === 'detail'}
                // textCancel={'Hủy thao tác'}
                values={data}
                form={form}
              />
            </div>
            <div className="flex justify-between mt-10 ">
              <button
                onClick={() => {
                  navigate(`${routerLinks('Supplier')}`);
                }}
                className="px-8 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1"
                id="backBtn"
              >
                Trở về
              </button>

              {/* {pageType === 'detail' &&
               <div className="flex justify-end items-end text-sm">
                  <button
                     onClick={() =>  submit(form.resetFields()) }
                     className="px-4 bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 mr-4" id="saveBtn">Hủy thao tác</button>
                  <button onClick={() => submit(form.getFieldsValue())}
                     className="px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1" id="deleteBtn" >Thêm cửa hàng</button>
               </div>
            } */}

              {pageType === 'detail' && (
                <div className="flex justify-end items-end text-sm">
                  {data.status ? (
                    <button
                      onClick={async () => {
                        Message.confirm({
                          text: 'Bạn có chắc chắn ngừng hoạt động? Khi thực hiện hành động này, cửa hàng sẽ bị tạm dừng hoạt động',
                          onConfirm: async () => {
                            const res = await SupplierService.delete([data.id]);
                            res && navigate(`${routerLinks('Quản lý cửa hàng')}`);
                          },
                          confirmButtonColor: '#ffffff',
                          confirmButtonText: 'Xóa',
                          cancelButtonText: 'Đóng',
                        });
                      }}
                      className="px-4 bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 mr-4"
                      id="saveBtn"
                    >
                      Ngừng hoạt động
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        Message.confirm({
                          text: 'Bạn có chắc chắn ngừng hoạt động? Khi thực hiện hành động này, cửa hàng sẽ bị tạm dừng hoạt động',
                          onConfirm: async () => {
                            const res = await SupplierService.delete([data.id]);
                            res && navigate(`${routerLinks('Quản lý cửa hàng')}`);
                          },
                          confirmButtonColor: '#ffffff',
                          confirmButtonText: 'Ngừng',
                          cancelButtonText: 'Đóng',
                        });
                      }}
                      className="px-4 bg-yellow-500 text-white text-base p-2 rounded-xl hover:bg-yellow-400 mt-1 mr-4"
                      id="saveBtn"
                    >
                      Tiếp tục hoạt động
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate(`${routerLinks('SupplierEdit')}?id=${idSupplier}`);
                    }}
                    id="saveBtn"
                    className="px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              )}
            </div>
    </Fragment>
  );
};
export default SupplierInfo;
