// import { Message } from 'components';
import excelLogo from 'assets/images/excelLogo.png';
import { Message } from 'components';
import { useAuth } from 'global';
import React, { useEffect, useRef, useState } from 'react';
import readXlsxFile from 'read-excel-file';
// const { Dragger } = Upload;
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

const ImportFile = ({ setDataExcel, setDisabled }) => {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  // const [previewVisible, setPreviewVisible] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');
  // const [previewTitle, setPreviewTitle] = useState('');
  // const action = async (file) => {
  //   console.log(file)
  //   if (Number(file?.file?.size) > 10485760) {
  //     Message.error({ text: 'File đăng tải phải có kích thước dưới 10MB' });
  //     return false;
  //   }
  // };

  const inputFile = useRef();

  // const onDrop = (event) => {
  //   // handleSubmit();
  //   // handleChange()
  //   handleChangeUpload(event.dataTransfer.files);
  // };

  // const handleCancel = () => setPreviewVisible(false);

  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewVisible(true);
  //   setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  // };
  const [change, setchange] = useState(false);
  useEffect(() => {
    const input = document.getElementById('input');
    if (input) {
      input.addEventListener('change', () => {
        readXlsxFile(input.files[0]).then((rows) => {
          let res;
          roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR'
            ? (res = rows
              .filter((rowExcel, index) => index >= 2)
              .map((row, i) => ({
                index: i + 1,
                category: {
                  level1: row[0],
                  level2: row[1],
                  level3: row[2],
                  level4: row[3],
                  level5: row[4],
                },
                barcode: row[5] !== null ? String(row[5]) : null,
                name: row[6],
                description: row[7],
                brand: row[8],
                supplierName: row[9],
                origin: row[10],
                basicUnit: row[11],
                // quantity: row[12],
                importTax: row[12],
                exportTax: row[13],
                abilitySupply: {
                  month: row[14],
                  year: row[15],
                  quarter: row[16],
                },
                exportMarket: row[17],
                excelProductPrice: {
                  price1: row[18],
                  minQuantity1: row[19],
                  price2: row[20],
                  minQuantity2: row[21],
                  price3: row[22],
                  minQuantity3: row[23],
                },
                defaultCommission: row[24],
                flexCommissionByPercent: {
                  revenue1: row[25],
                  commission1: row[26],
                  revenue2: row[27],
                  commission2: row[28],
                  revenue3: row[29],
                  commission3: row[30],
                },
                flexCommissionByCash: {
                  revenue1: row[31],
                  commission1: row[32],
                  revenue2: row[33],
                  commission2: row[34],
                  revenue3: row[35],
                  commission3: row[36],
                },
              })))
            : (res = rows
              .filter((rowExcel, index) => index >= 2)
              .map((row, i) => ({
                index: i + 1,
                category: {
                  level1: row[0],
                  level2: row[1],
                  level3: row[2],
                  level4: row[3],
                  level5: row[4],
                },
                barcode: row[5] !== null ? String(row[5]) : null,
                name: row[6],
                description: row[7],
                brand: row[8],
                supplierName: row[9],
                origin: row[10],
                basicUnit: row[11],
                // quantity: row[12],
                price: row[12],
                importTax: row[13],
                exportTax: row[14],

              })));
          setDataExcel(res);
        });
      });
    }
  }, [change]);

  return (
    <div className="wrapper">
      <div
        // name="files"
        // multiple={true}
        // // action={action}
        // accept="image/*,.pdf"
        // onChange={handleChange}
        // onDrop={onDrop}
        // listType="picture"
        // beforeUpload={beforeUpload}
        // onRemove={handleRemove}
        // onPreview={handlePreview}
        // showUploadList={showUploadList}
        className="text-center border-2 p-[42px] border-dashed rounded-md"
      // fileList={fileList}
      // customRequest={dummyRequest}
      // progress={{
      //   strokeColor: {
      //     '0%': '#108ee9',
      //     '100%': '#87d068',
      //   },
      //   strokeWidth: 3,
      //   format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
      // }}
      >
        <p className="ant-upload-drag-icon">
          <svg
            width="68"
            height="68"
            viewBox="0 0 68 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-5"
          >
            <path
              d="M23.0333 19.7003L30.6666 12.0336V44.0003C30.6666 44.8844 31.0178 45.7322 31.6429 46.3573C32.2681 46.9824 33.1159 47.3336 34 47.3336C34.884 47.3336 35.7319 46.9824 36.357 46.3573C36.9821 45.7322 37.3333 44.8844 37.3333 44.0003V12.0336L44.9666 19.7003C45.2765 20.0127 45.6452 20.2607 46.0514 20.4299C46.4576 20.5992 46.8933 20.6863 47.3333 20.6863C47.7733 20.6863 48.209 20.5992 48.6152 20.4299C49.0214 20.2607 49.3901 20.0127 49.7 19.7003C50.0124 19.3904 50.2604 19.0218 50.4296 18.6156C50.5988 18.2094 50.686 17.7737 50.686 17.3336C50.686 16.8936 50.5988 16.4579 50.4296 16.0517C50.2604 15.6455 50.0124 15.2768 49.7 14.967L36.3666 1.63364C36.0496 1.33017 35.6758 1.09229 35.2666 0.933639C34.4551 0.600245 33.5448 0.600245 32.7333 0.933639C32.3241 1.09229 31.9503 1.33017 31.6333 1.63364L18.3 14.967C17.9892 15.2778 17.7426 15.6467 17.5744 16.0528C17.4062 16.4589 17.3197 16.8941 17.3197 17.3336C17.3197 17.7732 17.4062 18.2084 17.5744 18.6145C17.7426 19.0205 17.9892 19.3895 18.3 19.7003C18.6108 20.0111 18.9797 20.2576 19.3858 20.4258C19.7919 20.594 20.2271 20.6806 20.6666 20.6806C21.1062 20.6806 21.5414 20.594 21.9475 20.4258C22.3535 20.2576 22.7225 20.0111 23.0333 19.7003ZM64 40.667C63.1159 40.667 62.2681 41.0182 61.6429 41.6433C61.0178 42.2684 60.6666 43.1162 60.6666 44.0003V57.3336C60.6666 58.2177 60.3154 59.0655 59.6903 59.6907C59.0652 60.3158 58.2174 60.667 57.3333 60.667H10.6666C9.78257 60.667 8.93473 60.3158 8.3096 59.6907C7.68448 59.0655 7.33329 58.2177 7.33329 57.3336V44.0003C7.33329 43.1162 6.9821 42.2684 6.35698 41.6433C5.73186 41.0182 4.88401 40.667 3.99996 40.667C3.1159 40.667 2.26806 41.0182 1.64294 41.6433C1.01782 42.2684 0.666626 43.1162 0.666626 44.0003V57.3336C0.666626 59.9858 1.72019 62.5293 3.59556 64.4047C5.47092 66.2801 8.01446 67.3336 10.6666 67.3336H57.3333C59.9855 67.3336 62.529 66.2801 64.4044 64.4047C66.2797 62.5293 67.3333 59.9858 67.3333 57.3336V44.0003C67.3333 43.1162 66.9821 42.2684 66.357 41.6433C65.7319 41.0182 64.884 40.667 64 40.667Z"
              fill="#9CA3AF"
            />
          </svg>
        </p>
        <p className="ant-upload-text mb-4">Tải tệp</p>
        {/* <button
          onClick={() => { }}
          className="bg-teal-900 text-white text-[14px] px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
          id="refusedAllBtn"
        >
          Chọn tệp
        </button> */}
        <input
          type="file"
          id="input"
          onChange={(e) => {
            setchange(!change)
            const file = e.target.files[0]
            if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
              setDisabled(true)
              document.getElementById("input").value = ""
              return Message.error({ text: `Định dạng file không hợp lệ. Vui lòng chỉ tải lên file excel có định dạng xls/xlsx.` });
            }
            setDisabled(false)
          }}
          className="bg-teal-900 text-white text-[14px] px-4 py-2.5 rounded-xl hover:bg-teal-700 items-center hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          ref={inputFile}

        />
        <button
          onClick={() => inputFile.current.click()}
          className="bg-teal-900 text-white text-[14px] px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center mb-3"
          id="refusedAllBtn"
        >
          Chọn tệp
        </button>
        <div id="selected_filename" className="flex items-center justify-center gap-1">
          <img src={excelLogo} alt="logo Excel" className="w-[50px] object-cover" />
          <span className="font-semibold text-teal-800 text-sm">
            {inputFile?.current?.files[0]?.name || 'Chưa tồn tại file tải lên'}
          </span>{' '}
        </div>
      </div>
      {/* <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal> */}
    </div>
  );
};

export default ImportFile;
