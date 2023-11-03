import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { Select } from 'antd';
import './index.less';
import ContractUpload from './clickNDragContract';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
import { Message, Spin } from 'components';
import pdfCoverThumb from 'assets/images/pdf_cover.png';
import wordThumb from 'assets/images/word.png';
import ContractCard from './contractCard';
import excelLogo from 'assets/images/excelLogo.png';


const UtilTimer = (time, hour = true) => {
  const timer = new Date(time);
  const yyyy = timer.getFullYear();

  let mm = timer.getMonth() + 1; // Months start at 0!
  let dd = timer.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  if (hour)
    return (
      formattedToday +
      ' - ' +
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes()
    );

  return formattedToday;
};

const Detail = () => {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const navigate = useNavigate();
  const { Option } = Select;
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const [data, setData] = useState({});
  const idContract = data?.data?.id;
  const subOrgId = user?.userInfor?.subOrgId;
  const [fileList, setFileList] = useState([]);
  const [showUploadLister, setShowUploadLister] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value, id) => {
    let statusPush = '';
    switch (value) {
      case 'Chờ ký':
        statusPush = 'PENDING_SIGN_CONTRACT';
        break;
      case 'Đã ký':
        statusPush = 'SIGNED_CONTRACT';
        break;
      // case 'Quản trị viên từ chối':
      //   statusPush = 'REJECT_BY_ADMIN';
      //   break;
      // case 'Nhà cung cấp từ chối':
      //   statusPush = 'REJECT_BY_SUPPLIER';
      //   break;
      // case 'Quản trị viên đã ký':
      //   statusPush = 'SIGNED_CONTRACT_ADMIN';
      //   break;
    }

    const valuePush = {
      status: statusPush,
    };
    try {
      const res = await SupplierService.editStatusContractBetweenBalanceNSupplier(
        (value = valuePush),
        (id = idContract),
      );
      setData(res);
    } catch (error) {
      console.log(error);
      return false;
    }
    getContractDetailer();
  };
  const getContractDetailer = async () => {
    try {
      const res = await SupplierService.getContractDetail(idSupplier || subOrgId);
      setData(res);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  let contractStatusValue = '';
  switch (data?.data?.status) {
    case 'PENDING_SIGN_CONTRACT':
      contractStatusValue = 'Chờ Ký';
      break;
    case 'SIGNED_CONTRACT':
      contractStatusValue = 'Đã Ký';
      break;
    // case 'REJECT_BY_ADMIN':
    //   contractStatusValue = 'Quản trị viên từ chối';
    //   break;
    // case 'REJECT_BY_SUPPLIER':
    //   contractStatusValue = 'Nhà cung cấp từ chối';
    //   break;
    // case 'SIGNED_CONTRACT_ADMIN':
    //   contractStatusValue = 'Quản trị viên đã ký';
    //   break;
  }

  useEffect(() => {
    getContractDetailer();
  }, []);

  const beforeUpload = (file, fileListRest) => {
    setShowUploadLister(true);
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type ==='application/vnd.ms-excel'
    if (!isJpgOrPng) {
      return Message.error({
        text: 'File tải lên không đúng định dạng. Vui lòng tải lên hợp đồng có định dạng là docx, pdf, jpg, jpeg, csv, xlsx, xls',
      });
    }

    if (isJpgOrPng) {
      const isLt10M = file.size / 1024 / 1024 < 25;
      if (!isLt10M) {
        Message.error({ text: 'Hình ảnh có kích thước nhỏ hơn 25MB!' });
        return;
      }
    }
    if (file.type === 'application/pdf') {
      file.thumbUrl = pdfCoverThumb;
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      file.thumbUrl = wordThumb;
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      file.thumbUrl = excelLogo;
    }

    if (fileList.length === 0) {
      setFileList([file]);
    }
    setFileList([...fileList, file]);
    return false;
  };
  const handleRemove = async (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);

    setFileList(newFileList);
  };
  const handleChangeUpload = ({ fileList }) => {

    setShowUploadLister(true);
    // for (let i = 1; i < fileList.length; i++) {
    //   const isJpgOrPng = fileList[i].type === 'image/jpeg' || fileList[i].type === 'image/png' || fileList[i].type === 'image/jpg' || fileList[i].type === 'application/pdf';
    //   if (!isJpgOrPng) {
    //     return Message.error({
    //       text: 'File tải lên không đúng định dạng. Vui lòng tải lên hợp đồng có định dạng là docx, pdf, jpg, jpeg ',
    //     });
    //   }
    //   const isLt10M = fileList[i].size / 1024 / 1024 < 25;
    //   if (isJpgOrPng && !isLt10M) {
    //     Message.error({ text: 'Hình ảnh có kích thước nhỏ hơn 25MB!' });
    //     return;
    //   }
    // }
    // // setLoading(true)
    // setFileList(fileList);
    // setLoading(false)

    // if (status !== 'uploading') {
    //   console.log('uploading');
    // }
    // if (status === 'done') {
    //   console.log('file uploaded successfully.');
    // } else if (status === 'error') {
    //   console.log('file upload failed.');
    // }
  };

  // const dummyRequest = ({ file, onSuccess }) => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     console.log('ok');
  //   }, 0);
  //   setLoading(false)
  // };

  const handleDeteleContract = async (idContract) => {
    await SupplierService.deleteContract(idContract);
    const res = await SupplierService.getContractDetail(idSupplier || subOrgId);
    setData(res);
  };

  const arrayFileName = data?.data?.filePhoto.map((photo) => photo?.fileName);
  const convertPathFile = `supermarket-service/supplier-contract/${idSupplier || subOrgId}/${data?.data?.id}`;

  const handleDownloadContract = async (values) => {
    const response = await SupplierService.downloadContractZip(
      (values = {
        fileNames: arrayFileName,
        pathFile: convertPathFile,
      }),
    );
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
    link.target = '_blank';
    // link.download = values.fileName || values.name;
    link.download = 'Tệp hợp đồng';
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
  };
  // const [loading, setLoading] = useState(false);
  // const saveContractItem = async (idContract) => {
  //   setLoading(true);
  //   const response = await SupplierService.downloadContractItem(idContract);
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
  //   link.target = '_blank';
  //   // link.download = values.fileName || values.name;
  //   link.download = 'File hợp đồng';
  //   document.body.appendChild(link);
  //   link.click();
  //   link?.parentNode?.removeChild(link);
  //   setLoading(false);
  // };
  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => GLightbox());
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await SupplierService.uploadFileDocContract({
      files: fileList,
      docSubOrgId: Number(data?.data?.id),
      subOrgId: Number(idSupplier || subOrgId),
    });
    if (res.statusCode === 200) {
      setFileList([]);
    }
    setFileList([]);
    setShowUploadLister(false);
    await getContractDetailer();
    setLoading(false);
  };

  if (!data?.data) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="">
        <div className="flex flex-row items-center">
          <p className="sm:text-xl text-base font-semibold text-teal-900 pb-4 pt-0 mr-5">Chi tiết hợp đồng</p>
        </div>
        <div className="w-full flex flex-row mb-1 text-base">
          <div className="lg:flex lg:items-center  justify-between w-full">
            {/* <div className=''> */}
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-5">
                <div className="font-semibold text-teal-900">Mã hợp đồng:</div>
                <div>{data?.data?.code}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-5">
                <div className="font-semibold text-teal-900">Ngày tạo:</div>
                <div>{UtilTimer(data?.data?.createdAt)}</div>
              </div>
            </div>
            <div className="w-full">
              {contractStatusValue && (
                <div className="w-full sm:flex flex-row mb-5 statusCheck items-center">
                  <div className="font-semibold text-teal-900 w-[100px]">Trạng thái:</div>
                  <div className="sm:mt-0 mt-2">
                    <Select
                      defaultValue={contractStatusValue}
                      style={{
                        width: 248,
                      }}
                      onChange={handleChange}
                      disabled={
                        (roleCode === 'OWNER_SUPPLIER' || 
                        roleCode === 'DISTRIBUTOR') ||
                         contractStatusValue === 'Đã Ký' ||
                        contractStatusValue === 'Quản trị viên từ chối' ||
                        contractStatusValue === 'Nhà cung cấp từ chối'
                      }
                    >
                      <Option value="Chờ ký">Chờ ký</Option>
                      <Option value="Đã ký">Đã ký</Option>
                      {/* <Option value="Quản trị viên từ chối">Quản trị viên từ chối</Option>
                    <Option value="Nhà cung cấp từ chối">Nhà cung cấp từ chối</Option>
                    <Option value="Quản trị viên đã ký">Quản trị viên đã ký</Option> */}
                    </Select>
                  </div>
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
        <div className="w-full mb-1 text-base">
          <div className="md:flex">
            <div className="w-full">
              <div className="w-full flex flex-row mb-2 gap-5">
                <div className="font-semibold text-teal-900">Thông tin hợp đồng:</div>
                <div>
                  <a
                    target="_blank"
                    onClick={() => {
                      navigate(`${routerLinks('SampleContract')}?id=${idSupplier || subOrgId}`);
                    }}
                  >
                    <span className="text-[#3B82F6] underline">Nhấn vào đây</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-5">
                <div className="font-semibold text-teal-900">Tệp đã ký:</div>
                <div>
                  <a
                    target="_blank"
                    onClick={() => {
                      navigate(`${routerLinks('SampleContract')}?id=${idSupplier || subOrgId}`);
                    }}
                  >
                    <span className="text-[#3B82F6] underline">Nhấn vào đây</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-full"></div>
          </div>
        </div>

        <hr />

        {/* Thông tin nhà cung cấp           */}
        <div className="flex flex-row items-center">
          <p className="text-base font-bold text-teal-900 py-4 mr-5">Thông tin nhà cung cấp</p>
        </div>
        <div className="w-full lg:flex flex-row text-base">
          <div className="lg:w-[40%] w-full">
            <div className="w-full flex flex-row mb-5 gap-5">
              <div className="font-semibold text-teal-900 flex-none">Nhà cung cấp:</div>
              <div>{data?.data?.subOrg?.name}</div>
            </div>
            <div className="w-full flex flex-row mb-5 gap-5">
              <div className="font-semibold text-teal-900 flex-none">Số điện thoại:</div>
              <div>{data?.data?.subOrg?.userRole[0]?.userAdmin.phoneNumber}</div>
            </div>
          </div>
          <div className="">
            <div className="w-full flex flex-row mb-5 gap-5">
              <div className="font-semibold text-teal-900 flex-none">Tên chủ quản lý:</div>
              <div>{data?.data?.subOrg?.userRole[0]?.userAdmin.name}</div>
            </div>
            <div className="w-full flex flex-row mb-5 gap-5">
              <div className="font-semibold text-teal-900 lg:w-auto flex-none">Địa chỉ:</div>
              <div>{data?.addressSupplier}</div>
            </div>
          </div>
        </div>
        {roleCode === 'ADMIN' && (
          <>
            <p className="text-base font-bold text-teal-900 py-4 mr-5">Tải lên hợp đồng đã ký:</p>
            <ContractUpload
              docId={data?.data?.id}
              supplierId={idSupplier || subOrgId}
              handleSubmit={handleSubmit}
              beforeUpload={beforeUpload}
              handleRemove={handleRemove}
              handleChange={handleChangeUpload}
              showUploadList={showUploadLister}
              fileList={fileList}
              // dummyRequest={dummyRequest}
            />
            {loading && <Spin text="Uploading..." className="mx-auto" />}
          </>
        )}
        {(roleCode === 'ADMIN' || roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
          <>
            {data?.data?.filePhoto && data?.data?.filePhoto.length > 0 ? (
              <>
                <p className="text-base font-bold text-teal-900 py-4 mr-5">Tệp trên hệ thống:</p>
                <div className="flex flex-col items-center gap-2">
                  {data?.data?.filePhoto.map((contract) => {
                    setTimeout(() => {
                      import('glightbox').then(({ default: GLightbox }) => new GLightbox());
                    });
                    return (
                      <>
                        <ContractCard
                          contract={contract}
                          pdfCoverThumb={pdfCoverThumb}
                          wordThumb={wordThumb}
                          roleCode={roleCode}
                          handleDeteleContract={handleDeteleContract}
                          // saveContractItem={saveContractItem}
                          // loading={loading}
                        />
                      </>
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  <button
                    className="downloadbtn px-4 w-[215px] h-[44px] bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-5 "
                    onClick={() => handleDownloadContract()}
                  >
                    Tải tệp hợp đồng <i className="las la-download ml-1"></i>
                  </button>
                </div>
              </>
            ) : (
              <>
                {' '}
                <p className="text-base font-bold text-teal-900 py-4 mr-5">Tệp trên hệ thống:</p>
                <p>Chưa có hình hợp đồng trên hệ thống.</p>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex sm:flex-row flex-col items-center  sm:w-auto w-full  sm:justify-between sm:mt-10 ExchangeButton ">
        {roleCode === 'ADMIN' ? (
          <div className="sm:w-auto w-full flex sm:flex-row flex-col items-center">
            <button
              onClick={() => {
                navigate(`${routerLinks('Supplier')}`);
              }}
              className="px-8 sm:w-auto w-[215px] h-[44px] bg-white border-teal-900 hover:border-teal-600 border-solid border
            text-[14px] p-2 rounded-[10px]  text-teal-900 hover:text-teal-600 mt-1"
              id="backBtn"
            >
              Trở về
            </button>
          </div>
        ) : (
          ''
        )}
        {roleCode === 'ADMIN' && (
          <div className="sm:w-auto w-full sm:mt-0 mt-2 flex sm:flex-row flex-col items-center">
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-teal-900 sm:w-auto w-[215px] h-[44px] text-white text-[14px] px-4 py-2.5 rounded-[10px] hover:bg-teal-700 sm:inline-flex items-center"
              id="uploadContractBtn"
              disabled={!fileList || fileList.length === 0}
            >
              Đăng tải hợp đồng
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Detail;
