import { Tooltip } from 'antd';
import { Spin } from 'components';

import React, { useState } from 'react';
import { SupplierService } from 'services/supplier';
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

const ContractCard = ({ contract, pdfCoverThumb, roleCode, handleDeteleContract, wordThumb }) => {
  const [loading, setLoading] = useState(false);

  const saveContractItem = async (idContract) => {
    setLoading(true);
    const response = await SupplierService.downloadContractItem(idContract);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
    link.target = '_blank';
    // link.download = values.fileName || values.name;
    link.download = 'File hợp đồng';
    document.body.appendChild(link);
    link.click();
    link?.parentNode?.removeChild(link);
    setLoading(false);
  };

  return (
    <>
      <div
        key={contract.id}
        className="flex items-center mt-2 border border-stone-200 sm:w-[40%] w-full px-2 gap-1 p-[5px] overflow-hidden relative"
      >
        <a href={contract.url} className="glightbox mr-5">
          {contract.type === 'pdf' ? (
            <img
              src={pdfCoverThumb}
              alt={contract.fileName || 'NoImage'}
              className="w-[50px] h-[50px] aspect-square object-cover"
            />
          ) : (contract.type === 'docx' || contract.type === 'doc') ? (
            <img
              src={wordThumb}
              alt={contract.fileName || 'NoImage'}
              className="w-[50px] h-[50px] aspect-square object-cover"
            />
          ) : (contract.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || contract.type === 'application/vnd.ms-excel') || contract.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || contract.type === 'xlsx' ? (
            <img
              src={excelLogo}
              alt={contract.fileName || 'NoImage'}
              className="w-[50px] h-[50px] aspect-square object-cover"
            />
          ) :(
            <img
              src={contract.url}
              alt={contract.fileName || 'NoImage'}
              className="w-[50px] h-[50px] aspect-square object-cover"
            />
          )}
        </a>
        <div className="contract-consumer absolute left-[70px] w-full">
          <Tooltip placement="topLeft" title={contract.fileName || 'Đang cập nhật'}>
            <h1 className="font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[50%]">
              {contract.fileName || 'Đang cập nhật'}
            </h1>
          </Tooltip>
          <h1>{UtilTimer(contract?.createdAt)}</h1>
        </div>
        <div className="flex items-center gap-2 ml-auto z-[999]">
          {roleCode === 'ADMIN' && (
            <Tooltip placement="topLeft" title="Xóa File">
              <div
                className="deletebtn border border-stone-200 p-[5px] cursor-pointer hover:bg-stone-100 transition-all"
                onClick={() => handleDeteleContract(contract.id)}
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="delete"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                </svg>
              </div>
            </Tooltip>
          )}
          <Tooltip placement="topLeft" title="Tải File">
            <div className="deletebtn border border-stone-200 cursor-pointer hover:bg-stone-100 transition-all">
              <i className="las la-download text-[18px] p-[3px]" onClick={() => saveContractItem(contract.id)}></i>
            </div>
          </Tooltip>
        </div>
      </div>
      {loading && <Spin text="Downloading..." className="" />}
    </>
  );
};

export default ContractCard;
