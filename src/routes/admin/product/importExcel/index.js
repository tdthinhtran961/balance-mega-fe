import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import ImportFile from './importFile';
import './index.less';
import ListImageAndFile from './listImageAndFile';
import ListProduct from './listProduct';

import { ProductService } from 'services/product';
import { useAuth } from 'global';
import { fileType } from 'constants/index';

const Page = () => {
  // // const location = useLocation();
  const [step, setStep] = useState(1);
  const [dataExcel, setDataExcel] = useState([]);
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode


  // const pageType =
  //   location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  // const urlSearch = new URLSearchParams(location.search);

  const handDelete = (index) => {
    dataExcel.success.data.filter((item) => item.index !== index);
  };
  const [dataSubmit, setDataSubmit] = useState([]);
  // useEffect(() => {
  //   switch (urlSearch.get('step')) {
  //     case '1':
  //       step !== 1 && setStep(1);
  //       break;
  //     case '2':
  //       step !== 2 && setStep(2);
  //       break;
  //     case '3':
  //       step !== 3 && setStep(3);
  //       break;
  //     default:
  //       setStep(1);
  //       break;
  //   }
  // }, [location.search]);
  const [disabled, setDisabled] = useState(false);
  return (
    <Fragment>
      {step === 1 && (
        <div>
          <h2 className="text-2xl text-teal-900 font-bold mb-6">Thêm sản phẩm</h2>
          <div className="min-h-screen">
            <div className="bg-white p-4 rounded-[10px]">
              <h2 className="text-base mb-4 text-teal-900 font-medium">Thêm sản phẩm từ excel</h2>
              <p className="mb-4">
                Tải file mẫu:
                <a
                  className="underline text-blue-500 ml-4"
                  onClick={async () => {
                    let response;
                    roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR'
                      ? (response = await ProductService.getFileTemplate({ type: fileType.PRODUCT_SUPPLIER }))
                      : (response = await ProductService.getFileTemplate({ type: fileType.PRODUCT_STORE }));
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                    link.target = '_blank';
                    // link.download = values.fileName || values.name;
                    link.download = 'Mãu template';
                    document.body.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                  }}
                >
                  Bấm để tải
                </a>
              </p>
              <ImportFile setDataExcel={setDataExcel} setDisabled={setDisabled} />
            </div>
            <div className="flex justify-between mt-6 button-product-group">
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600 back-product-button"
                id="backBtn"
              >
                Trở về
              </button>
              <button
                onClick={async () => {
                  let res;

                  roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR'
                    ? (res = await ProductService.readFileExcelProduct(dataExcel))
                    : (res = await ProductService.storereadFileExcelProduct(dataExcel));
                  if (res) {
                    setDataExcel(res.data);
                    setDataSubmit(res.data?.success?.data);
                    window.scrollTo(0, 0);
                    setStep(2);
                    return navigate(routerLinks('ProductImport') + `?step=2`);
                  }
                }}
                className="w-[133px] h-[44px] text-sm bg-teal-900 text-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] disabled:!bg-gray-400 disabled:!border-gray-300"
                id="continueBtn"
                disabled={disabled || dataExcel.length === 0}
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <ListProduct
            setStep={setStep}
            dataExcel={dataExcel}
            handDelete={handDelete}
            dataSubmit={dataSubmit}
            setDataSubmit={setDataSubmit}
          />
        </div>
      )}
      {step === 3 && (
        <div>
          <ListImageAndFile setStep={setStep} dataExcel={dataSubmit} />
        </div>
      )}
    </Fragment>
  );
};

export default Page;
