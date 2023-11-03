// import { Message } from 'components';
import { useAuth } from 'global';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductService } from 'services/product';
import { FileService } from 'services/file';
import { routerLinks } from 'utils';
import TableImageAndFile from '../components/tableAddImageAndFileFromExcel';
import { Spin } from 'components';
import { fileType } from 'constants/index';

function ListImageAndFile({ dataExcel, setStep }) {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const navigate = useNavigate();
  const [isLoading, set_isLoading] = useState(false);

  // fake data
  const [dataSource, setDataSource] = useState(dataExcel.map((i) => ({ ...i, photos: [] })) || []);
  const checkDisabled = () => {
    if (dataSource.every((i) => i.photos.length > 0)) {
      return false;
    } else {
      return true;
    }
  };

  const [errorContentList, setErrorContentList] = useState([]);

  const checkValidateContent = () => {
    setErrorContentList([]);
    for (const index in dataSource) {
      for (const i in dataSource[index].productInformation) {
        if (dataSource[index].productInformation[i]?.content === '') {
          setErrorContentList((prev) => prev.concat({ rowTable: +index, indexContent: +i }));
        }
      }
    }
    return errorContentList;
  };
  useEffect(() => {
    checkValidateContent();
  }, [dataSource]);

  // Edit by Thinh - Start
  const [defaultImage, setDefaultImage] = useState('');
  
  /**
   * Get url default image -> set default image
   */
  useEffect(() => {
    FileService.getDefaultImage(fileType.PRODUCT_IMPORT_IMAGE_DEFAULT)
      .then(res => {
        setDefaultImage(res);
        setDataSource(dataSource.map((i) => ({ photos: [defaultImage], ...i })));
      });
  }, [])
  // Edit by Thinh - End

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl text-teal-900 font-bold mb-6">Thêm sản phẩm</h2>
      <Spin spinning={isLoading}>
        <div className="bg-white rounded-[10px] p-4">
          <h2 className="font-bold text-teal-900 text-base mb-6">Thêm hình ảnh và thông tin khác</h2>
          <TableImageAndFile
            dataSource={dataSource}
            setDataSource={setDataSource}
            roleCode={roleCode}
            errorContentList={errorContentList}
            defaultImage={defaultImage}
          />
        </div>
        <div className="flex justify-between mt-6 button-product-group">
          <button
            onClick={() => setStep(2)}
            className="px-8 py-3 h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600 back-product-button"
            id="backBtn"
          >
            Trở về
          </button>
          <button
            onClick={async () => {
              set_isLoading(true);
              if (errorContentList.length > 0) {
                return false;
              } else {
                let res;
                roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR'
                  ? (res = await ProductService.createFileExcelProduct(dataSource))
                  : (res = await ProductService.storecreateFileExcelProduct(dataSource));
                if (res) {
                  window.scrollTo(0, 0);
                  return navigate(routerLinks('Product') + `?tab=2`);
                }
              }
              set_isLoading(false);
            }}
            className="w-[133px] h-[44px] text-sm bg-teal-900 text-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] disabled:bg-gray-400 disabled:border-gray-400"
            id="doneBtn"
            disabled={checkDisabled() || errorContentList.length > 0 || dataSource.length === 0}
          >
            Lưu
          </button>
        </div>
      </Spin>
    </div>
  );
}

export default ListImageAndFile;
