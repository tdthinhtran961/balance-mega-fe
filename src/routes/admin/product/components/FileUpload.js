import { Upload } from 'antd';
// import { Message } from 'components';
import React from 'react';
const { Dragger } = Upload;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const FileUpload = ({
  beforeUpload,
  handleRemove,
  handleChange,
  handleChangeUpload,
  showUploadList,
  fileList,
  dummyRequest,
}) => {
  //   const [previewVisible, setPreviewVisible] = useState(false);
  //   const [previewImage, setPreviewImage] = useState('');
  //   const [previewTitle, setPreviewTitle] = useState('');

  // const action = async (file) => {
  //   console.log(file)
  //   if (Number(file?.file?.size) > 10485760) {
  //     Message.error({ text: 'File đăng tải phải có kích thước dưới 10MB' });
  //     return false;
  //   }
  // };

  const onDrop = (event) => {
    handleChangeUpload(event.dataTransfer.files);
  };
  //   const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    // setPreviewImage(file.url || file.preview);
    // setPreviewVisible(true);
    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  return (
    <div className="wrapper">
      <Dragger
        name="files"
        multiple={true}
        // action={action}
        accept="image/*"
        // accept="image/*,.pdf"
        onChange={handleChange}
        onDrop={onDrop}
        listType="picture"
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        onPreview={handlePreview}
        showUploadList={showUploadList}
        className="flex justify-center items-center"
        fileList={fileList}
        customRequest={dummyRequest}
        progress={{
          strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
          },
          strokeWidth: 3,
          format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        }}
      >
        <button className="h-9 w-[87px] rounded-[10px] border border-solid border-teal-900 flex justify-center items-center cursor-pointer mx-auto">
          <span className="text-teal-900 font-normal text-sm">Chọn tệp</span>
        </button>
      </Dragger>
      {/* <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
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

export default FileUpload;
