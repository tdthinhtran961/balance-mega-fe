import { Form, Input, Table } from 'antd';
import { Message, Upload } from 'components';
// import { Upload } from 'components';
import React, { Fragment } from 'react';
import { UtilService } from 'services/util';
import '../index.less';
import FileAndImageItemRow from './FileAndImageItemRow';
// import FileUpload from './FileUpload';
// import { v4 as uuidv4 } from 'uuid';
const EditableContext = React.createContext(null);
export const blockInvalidChar = (e) =>
{
  let chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    '.',
    'ArrowRight',
    'ArrowLeft',
    'Enter',
    'Tab',
  ];
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  return !chars.includes(e.key) && e.preventDefault();
}
export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const TableImageAndFile = ({ dataSource, setDataSource, pageType, roleCode, errorContentList, defaultImage }) => {
  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.index !== key);
    setDataSource(newData);
  };

  // const [errorContentList, setErrorContentList]=useState([])



  const handleDeleteItemInfo = (index, indexRow) => {
    const newData = JSON.parse(JSON.stringify(dataSource));
    const newDataq = dataSource[indexRow]?.productInformation?.filter((item, i) => i !== index);
    const item = newData[indexRow];
    newData.splice(indexRow, 1, { ...item, productInformation: newDataq });
    setDataSource(newData);
  };

  const handleDeleteItemPhoto = (index, indexRow) => {
    const newData = JSON.parse(JSON.stringify(dataSource));
    const newDataq = dataSource[indexRow]?.photos?.filter((item, i) => i !== index);
    const item = newData[indexRow];
    newData.splice(indexRow, 1, { ...item, photos: newDataq });
    setDataSource(newData);
  };
  // const [isActive, setIsActive] = useState(false)

  const defaultColumnsDetail =
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR')
      ? [
        {
          title: 'STT',
          dataIndex: 'index',
          width: 50,
          // align: 'center',
          // render: (text, record, index) => index + 1,
        },
        {
          title: 'Mã vạch',
          dataIndex: 'barcode',
          // align: 'center',
          render: (text, record, index) => text,
        },
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          // align: 'center',
          render: (text, record, index) => text,
        },
        {
          title: 'Ảnh',
          dataIndex: 'image',
          align: 'center',
          render: (text, record, index) => {
            record?.photos.length === 0 && defaultImage !== '' && record?.photos.push(defaultImage);
            let itemPhoto = record?.photos[0] === defaultImage ? [] : record?.photos;
            let isError = false;
            const maxCount = 4;
            return (
              <div className="w-[85%] m-auto">
                <ul>
                  {record?.photos?.map((photo, i) => {
                    return (
                      <FileAndImageItemRow
                        key={i}
                        photo={photo}
                        handleDeleteItem={() => handleDeleteItemPhoto(i, index)}
                        index={i}
                      />
                    );
                  })}
                </ul>
                <div>
                    <Upload
                      onlyImage={false}
                      isProduct={true}
                      importExcel={true}
                      maxSize={20}
                      action={async (file) => {
                        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                          return Message.error({
                            text: 'Định dạng file không hợp lệ. Vui lòng chỉ tải lên file ảnh có định dạng jpg/jpeg/png.',
                          });
                        }
                        const urlArr = await UtilService.post(file, 'PRODUCT');
                        itemPhoto.push(urlArr[0]);
                        
                        if (itemPhoto?.length > maxCount && !isError) {
                          Message.error({ text: `Vui lòng chỉ chọn tối đa ${maxCount} hình ảnh.` });
                          isError = true;
                        }
                        itemPhoto = itemPhoto.slice(0, maxCount);
                        const newData = [...dataSource];
                        const index = newData.findIndex((item) => record.index === item.index);
                        const item = newData[index];
                        newData.splice(index, 1, { ...item, photos: itemPhoto });
                        // setIsActive(true)
                        setDataSource(newData);
                      }}
                    >
                      <button className="border-teal-900 border text-center h-9 w-[87px] rounded-[10px]  border-solid flex justify-center items-center cursor-pointer mx-auto text-teal-900 absolute top-[25%] right-[24%]">
                        Chọn tệp
                      </button>

                      {/* <div>{photos[0]}</div> */}
                    </Upload>
                </div>
              </div>
            );
          },
        },
        // roleCode === 'OWNER_SUPPLIER' &&
        {
          title: 'Nội dung',
          dataIndex: 'content',
          align: 'start',
          render: (text, record, indexR) => {
            return (
              <div className="flex flex-col gap-2 absolute top-0">
                {record?.productInformation?.map((item, i) => (
                  <div key={i}>
                    {pageType !== 'detail' ? (
                      <Form.Item
                        style={{
                          margin: 0,
                        }}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input
                          // value={text}
                          onChange={(e) => {
                            handleSave(e.target.value, record.index, i);
                          }}
                          onPressEnter={(e) => handleSave(e.target.value, record.index, i)}
                          onBlur={(e) => handleSave(e.target.value, record.index, i)}
                          className="h-9 !w-full !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 mt-1 px-1"
                          placeholder="Nhập nội dung"
                        />
                      </Form.Item>
                    ) : (
                      <span> {record.content ?? ''}</span>
                    )}
                    {errorContentList.find((error) => error.rowTable === indexR && error.indexContent === i) !==
                      undefined && record?.productInformation[i].content === '' ? (
                      <p className="text-red-500">Vui lòng nhập nội dung.</p>
                    ) : null}
                  </div>
                ))}
              </div>
            );
          },
        },
        // roleCode === 'OWNER_SUPPLIER' &&
        {
          title: 'File đính kèm',
          align: 'center',
          dataIndex: 'url',

          render: (text, record, index) => {
            let itemPhoto = record.productInformation;
            let isError = false;
            const maxCount = 2;
            return (
              <div className="w-[85%] m-auto flex flex-col gap-2">
                <ul>
                  {record?.productInformation?.map((photo, i) => {
                    return (
                      <FileAndImageItemRow
                        key={i}
                        photo={photo.url}
                        handleDeleteItem={() => handleDeleteItemInfo(i, index)}
                        index={i}
                      />
                    );
                  })}
                </ul>
                <div className="upload-section-wrapper">
                  <Upload
                    className="upload-section"
                    onlyImage={false}
                    accept=".pdf,image/*"
                    importExcel={true}
                    isProduct={true}
                    maxSize={20}
                    action={async (file) => {
                      if (
                        ![
                          'application/pdf',
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'image/png',
                          'image/jpeg',
                          'image/jpg',
                        ].includes(file.type)
                      ) {
                        return Message.error({
                          text: `Định dạng file không hợp lệ. Vui lòng chỉ tải lên file đính kèm có định dạng PDF/ jpg/jpeg/png.`,
                        });
                      }
                      const urlArr = await UtilService.post(file, 'PRODUCT');

                      itemPhoto.push({ url: urlArr[0], content: '' });

                      if (itemPhoto?.length > maxCount && !isError) {
                        Message.error({ text: `Vui lòng chỉ chọn tối đa ${maxCount} tệp.` });
                        isError = true;
                      }
                      itemPhoto = itemPhoto.slice(0, maxCount);
                      const newData = [...dataSource];
                      const index = newData.findIndex((item) => record.index === item.index);
                      const item = newData[index];
                      newData.splice(index, 1, { ...item, productInformation: itemPhoto });
                      setDataSource(newData);
                    }}
                  >
                    <button className="border-teal-900 border text-center h-9 w-[87px] rounded-[10px]  border-solid flex justify-center items-center cursor-pointer mx-auto text-teal-900 absolute top-[25%] right-[24%]">
                      Chọn tệp
                    </button>

                    {/* <div>{photos[0]}</div> */}
                  </Upload>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          align: 'center',
          render: (value, record, index) => {
            return (
              <div className="flex items-center justify-center">
                {record?.photos?.length > 0 ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 0.25C4.60059 0.25 0.25 4.60059 0.25 10C0.25 15.3994 4.60059 19.75 10 19.75C15.3994 19.75 19.75 15.3994 19.75 10C19.75 8.95117 19.6094 7.90527 19.2344 6.92969L18.0156 8.125C18.165 8.72559 18.25 9.32617 18.25 10C18.25 14.5762 14.5762 18.25 10 18.25C5.42383 18.25 1.75 14.5762 1.75 10C1.75 5.42383 5.42383 1.75 10 1.75C12.25 1.75 14.2715 2.64648 15.6953 4.07031L16.75 3.01562C15.0244 1.29004 12.625 0.25 10 0.25ZM18.4609 3.46094L10 11.9219L6.78906 8.71094L5.71094 9.78906L9.46094 13.5391L10 14.0547L10.5391 13.5391L19.5391 4.53906L18.4609 3.46094Z"
                      fill="#16A34A"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 0.25C4.62402 0.25 0.25 4.62402 0.25 10C0.25 15.376 4.62402 19.75 10 19.75C15.376 19.75 19.75 15.376 19.75 10C19.75 4.62402 15.376 0.25 10 0.25ZM10 1.75C14.5645 1.75 18.25 5.43555 18.25 10C18.25 14.5645 14.5645 18.25 10 18.25C5.43555 18.25 1.75 14.5645 1.75 10C1.75 5.43555 5.43555 1.75 10 1.75ZM7.16406 6.08594L6.08594 7.16406L8.92188 10L6.08594 12.8359L7.16406 13.9141L10 11.0781L12.8359 13.9141L13.9141 12.8359L11.0781 10L13.9141 7.16406L12.8359 6.08594L10 8.92188L7.16406 6.08594Z"
                      fill="#EF4444"
                    />
                  </svg>
                )}
              </div>
            );
          },
        },
        {
          title: '',
          dataIndex: 'action',
          width: 40,
          fixed: 'right',
          align: 'center',
          render: (_, record) =>
            dataSource.length >= 1 && pageType !== 'detail' ? (
              <>
                <button className="text-2xl mr-2 text-red-500" onClick={() => handleDelete(record.index)}>
                  <i className="las la-trash-alt"></i>
                </button>
              </>
            ) : null,
        },
      ]
      : [
        {
          title: 'STT',
          dataIndex: 'key',
          width: 50,
          // align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Mã vạch',
          dataIndex: 'barcode',
          // align: 'center',
          render: (text, record, index) => text,
        },
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          // align: 'center',
          render: (text, record, index) => text,
        },
        {
          title: 'Ảnh',
          dataIndex: 'image',
          align: 'center',
          render: (text, record, index) => {
                    
            record?.photos.length === 0 && defaultImage !== '' && record?.photos.push(defaultImage);
            let itemPhoto = record?.photos[0] === defaultImage ? [] : record?.photos;
            let isError = false;
            const maxCount = 4;
            return (
              <div className="w-[85%] m-auto">
                <ul>
                  {record?.photos?.map((photo, i) => {
                    return (
                      <FileAndImageItemRow
                        key={i}
                        photo={photo}
                        handleDeleteItem={() => handleDeleteItemPhoto(i, index)}
                        index={i}
                      />
                    );
                  })}
                </ul>
                <div>
                  <Upload
                    onlyImage={false}
                    isProduct={true}
                    importExcel={true}
                    maxSize={20}
                    action={async (file) => {
                      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                        return Message.error({
                          text: 'Định dạng file không hợp lệ. Vui lòng chỉ tải lên file ảnh có định dạng jpg/jpeg/png.',
                        });
                      }
                      const urlArr = await UtilService.post(file, 'PRODUCT');
                      itemPhoto.push(urlArr[0]);
                        
                      if (itemPhoto?.length > maxCount && !isError) {
                        Message.error({ text: `Vui lòng chỉ chọn tối đa ${maxCount} hình ảnh.` });
                        isError = true;
                      }
                      itemPhoto = itemPhoto.slice(0, maxCount);
                      const newData = [...dataSource];
                      const index = newData.findIndex((item) => record.index === item.index);
                      const item = newData[index];
                      newData.splice(index, 1, { ...item, photos: itemPhoto });
                      setDataSource(newData);
                      
                    }}
                  >
                    <button 
                    className="border-teal-900 border text-center h-9 w-[87px] rounded-[10px]  border-solid flex justify-center items-center cursor-pointer mx-auto text-teal-900 absolute top-[25%] right-[24%]">
                      Chọn tệp
                    </button>

                    {/* <div>{photos[0]}</div> */}
                  </Upload>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          align: 'center',
          render: (value, record, index) => {
            return (
              <div className="flex items-center justify-center">
                {record?.photos?.length > 0 ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 0.25C4.60059 0.25 0.25 4.60059 0.25 10C0.25 15.3994 4.60059 19.75 10 19.75C15.3994 19.75 19.75 15.3994 19.75 10C19.75 8.95117 19.6094 7.90527 19.2344 6.92969L18.0156 8.125C18.165 8.72559 18.25 9.32617 18.25 10C18.25 14.5762 14.5762 18.25 10 18.25C5.42383 18.25 1.75 14.5762 1.75 10C1.75 5.42383 5.42383 1.75 10 1.75C12.25 1.75 14.2715 2.64648 15.6953 4.07031L16.75 3.01562C15.0244 1.29004 12.625 0.25 10 0.25ZM18.4609 3.46094L10 11.9219L6.78906 8.71094L5.71094 9.78906L9.46094 13.5391L10 14.0547L10.5391 13.5391L19.5391 4.53906L18.4609 3.46094Z"
                      fill="#16A34A"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 0.25C4.62402 0.25 0.25 4.62402 0.25 10C0.25 15.376 4.62402 19.75 10 19.75C15.376 19.75 19.75 15.376 19.75 10C19.75 4.62402 15.376 0.25 10 0.25ZM10 1.75C14.5645 1.75 18.25 5.43555 18.25 10C18.25 14.5645 14.5645 18.25 10 18.25C5.43555 18.25 1.75 14.5645 1.75 10C1.75 5.43555 5.43555 1.75 10 1.75ZM7.16406 6.08594L6.08594 7.16406L8.92188 10L6.08594 12.8359L7.16406 13.9141L10 11.0781L12.8359 13.9141L13.9141 12.8359L11.0781 10L13.9141 7.16406L12.8359 6.08594L10 8.92188L7.16406 6.08594Z"
                      fill="#EF4444"
                    />
                  </svg>
                )}
              </div>
            );
          },
        },
        {
          title: '',
          dataIndex: 'action',
          width: 40,
          fixed: 'right',
          align: 'center',
          render: (_, record) =>
            dataSource.length >= 1 && pageType !== 'detail' ? (
              <>
                <button className="text-2xl mr-2 text-red-500" onClick={() => handleDelete(record.index)}>
                  <i className="las la-trash-alt"></i>
                </button>
              </>
            ) : null,
        },
      ];
  const handleSave = (value, key, i) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.index);
    newData[index].productInformation[i].content = value;
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      // cell: EditableCell,
    },
  };
  const columns =
    pageType !== 'detail'
      ? defaultColumnsDetail.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      })
      : defaultColumnsDetail.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      });
  return (
    <Fragment>
      <div className="overflow-x-auto">
        <Table
          className={`w-[1400px] max-w-max`}
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: '100%', y: 500 }}
          size="small"
        />
      </div>
    </Fragment>
  );
};

export default TableImageAndFile;
