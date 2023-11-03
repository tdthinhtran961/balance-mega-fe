import React, { useState, Fragment, useEffect, } from "react";
import { Form, Upload, Message } from "components";
import { ColumnCategoryForm } from "columns/category";
import { CategoryService } from "services/category";
import { UtilService } from "services/util";
import './index.less'
import { useLocation } from 'react-router-dom'
import { routerLinks } from "utils";
import { useNavigate } from "react-router";
import { Form as FormAnt } from "antd";

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [, setLoading] = useState(false);
  const pageType = location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idCategory = urlSearch.get('id');
  const [imageUrl, setImageUrl] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    const initFunction = async () => {
      if (idCategory) {
        const res = await CategoryService.getById(idCategory);
        if (res.isActive) {
          res.isActive = 1;
        } else {
          res.isActive = 2;
        }
        setData(res);
        setImageUrl(res?.image)
      }
    }
    initFunction();
  }, [idCategory]);

  let title = '';


  switch (pageType) {
    case 'create':
      title = 'Thêm danh mục';
      break;
    case 'edit':
      title = 'Chỉnh sửa danh mục';
      break;
    default:
      title = 'Danh mục';
      break;
  }

  const submit = async (values) => {
    try {
      if (!imageUrl) return Message.error({ text: 'Hình ảnh không được để trống !!' });

      let res;
      if (values.isActive === 1) {
        values.isActive = true;
      } else if (values.isActive === 2) {
        values.isActive = false;
      }
      const param = { ...values, image: imageUrl };
      setLoading(true);
      pageType === 'create' ? res = await CategoryService.post(param) : res = await CategoryService.put(param, idCategory);
      setLoading(false);
      if (res) {
        return navigate(`${routerLinks("Category")}`)
      }
    } catch (err) {
      console.log("Error is:", err);
      setLoading(false);
    }
  };


  return <Fragment>
    <div className="min-h-screen">
      <p className="text-2xl text-teal-900">{title}</p>

      <div className="bg-white w-full px-4 rounded-xl mt-5 relative">
        <div>
          <p className="text-xl font-bold text-teal-900 py-4">Chi tiết danh mục</p>
        </div>
        <div className="flex relative">
          <div className="mr-4">
            {pageType !== 'detail' ? (
              <>
                <Upload
                  onlyImage={true}
                  maxSize={20}
                  action={async (file) => {
                    const urlArr = await UtilService.post(file, 'CATEGORY');
                    setImageUrl(urlArr[0] ?? '');
                  }}
                >
                  {!imageUrl ? (<div className="h-60 w-60 px-8 cursor-pointer border border-dashed border-gray-500 rounded-xl mb-4">
                    <div className="text-center mt-20">
                      <i className="las la-image text-2xl"></i>
                      <p className="text-xs"> <span className="text-blue-500">Tải ảnh từ thiết bị</span></p>
                    </div>
                  </div>) : (
                    <div className="h-60 w-60 bg-cover bg-center cursor-pointer" style={{ backgroundImage: "url(" + imageUrl + ")" }}>
                    </div>)
                  }
                </Upload>
                <p className="w-60 text-xs text-center mb-4">Cho phép định dạng ảnh *.png, *.jpg và *.jpeg. Dung lượng ảnh tối đa 20MB</p>
              </>
            ) : (
              <div className="h-60 w-60 bg-cover bg-center" style={{ backgroundImage: "url(" + imageUrl + ")" }}>
              </div>
            )
            }
            <i className="las la-upload absolute icon-upload top-1/2 left-1/2 hidden text-4xl -translate-x-2/4 -translate-y-2/4 " ></i>
          </div>
          <Form
            className="ml-4 w-full"
            columns={ColumnCategoryForm({ pageType })}
            handSubmit={submit}
            checkHidden={true}
            textSubmit={pageType === 'create' ? 'Lưu' : null}
            classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-category-btn text-sm bottom-[-80px]'}
            // isShowCancel={pageType === 'create'}
            // textCancel={'Hủy thao tác'}
            values={data}
            form={form}
          />
        </div>
        <div>
        </div>
      </div>
      <div className="flex justify-between mt-10 ">
        <button
          onClick={() => {
            navigate(`${routerLinks("Category")}`)
          }}
          className="h-[44px] w-[106px] bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-sm rounded-[10px] text-teal-900 hover:text-teal-600" id="backBtn">Trở về</button>

        {pageType === 'edit' &&
          <div className="flex justify-end items-end text-sm">
            <button
              onClick={async () => {
                Message.confirm(
                  {
                    text: "Bạn có chắc chắn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được",
                    onConfirm: async () => {
                      const res = await CategoryService.delete([data.id]);
                      res && navigate(`${routerLinks("Category")}`);
                    },
                    confirmButtonColor: '#ffffff',
                    confirmButtonText: 'Xóa',
                    cancelButtonText: 'Đóng'
                  }
                )
              }}
              className="w-[130px] h-[44px] rounded-[10px] text-sm bg-red-500 text-white hover:bg-red-400 mr-4" id="saveBtn">Xóa sản phẩm</button>
            <button onClick={() => submit(form.getFieldsValue())}
              className="w-[130px] h-[44px] rounded-[10px] text-sm bg-teal-900 text-white hover:bg-teal-600" id="saveBtn" >Lưu</button>
          </div>
        }

        {pageType === 'detail' &&
          <div className="flex justify-end items-end text-sm">
            <button
              onClick={() => {
                navigate(`${routerLinks("CategoryEdit")}?id=${idCategory}`)
              }}
              id='saveBtn'
              className="px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1" >Chỉnh sửa</button>
          </div>
        }
      </div>

    </div>
  </Fragment>;
};
export default Page;
