import React, { useState, useRef, useEffect } from 'react';
import { Progress, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import classNames from 'classnames';
import { v4 } from 'uuid';

import { useAuth } from 'global';
import { linkApi } from 'variable';
import { Avatar, Message, Spin } from 'components';

import RemoveIcon from 'assets/svg/remove';
import DownloadIcon from 'assets/svg/download';

const Component = ({
  value = [],
  onChange,
  deleteFile,
  showBtnUpload = true,
  showBtnDownload = () => true,
  showBtnDelete = () => true,
  method = 'post',
  maxSize = 20,
  multiple = true,
  right = false,
  action = linkApi + '/File',
  maxCount,
  indexFile = {},
  onlyImage = false,
  keyImage = 'url',
  accept = 'image/*',
  extendButton = () => null,
  validation = async () => true,
  viewGrid = false,
  isProduct = false,
  importExcel = false,
  ...prop
}) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, set_isLoading] = useState(false);
  const ref = useRef();
  let [listFiles, set_listFiles] = useState(
    !onlyImage && typeof value === 'object'
      ? value.map((_item) => {
          if (_item.status) return _item;
          return {
            ..._item,
            status: 'done',
          };
        })
      : typeof value === 'string'
      ? [{ [keyImage]: value }]
      : value,
  );

  const handleDownload = async (file) => {
    const response = await axios.get(file[keyImage], { responseType: 'blob' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    link.target = '_blank';
    link.download = file.fileName || file.name;
    link.click();
  };

  useEffect(() => {
    const tempData =
      !onlyImage && typeof value === 'object'
        ? value.map((_item) => {
            if (_item.status) return _item;
            return {
              ..._item,
              status: 'done',
            };
          })
        : typeof value === 'string'
        ? [{ [keyImage]: value }]
        : value;
    if (
      JSON.stringify(listFiles) !== JSON.stringify(tempData) &&
      listFiles.filter((item) => item.status === 'uploading').length === 0
    ) {
      set_listFiles(tempData);
      setTimeout(() => {
        import('glightbox').then(({ default: GLightbox }) => GLightbox());
      });
    }
  }, [value, onlyImage]);

  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => GLightbox());
    });
  }, []);

  const onUpload = async ({ target }) => {
    indexFile.current = 0;
    // set_isLoading(true);
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files[i];
      // let max = maxSize;
      if (
        // maxSize && 
        file.size > maxSize * (1024 * 1024)) {
        await Message.error({
          text: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}mb): 
          ${t('Bạn chỉ có thể tải lên ảnh tối đa {{max}}Mb!', { max: maxSize })}`,
        });
        set_isLoading(false);
        return false;
      }
      // ${t('Bạn chỉ có thể tải lên tối đa {{max}}mb!'
      if (!(await validation(file, listFiles))) {
        return false;
      }

      const thumbUrl = await new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
      });
      const dataFile = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file,
        thumbUrl,
        id: v4(),
        percent: 0,
        status: 'uploading',
      };
      if (onlyImage) {
        listFiles[0] = dataFile;
      } else {
        listFiles.push(dataFile);
      }
      set_listFiles(listFiles);

      if (action) {
        set_isLoading(true);
        if (typeof action === 'string') {
          const bodyFormData = new FormData();
          bodyFormData.append('file', file);

          try {
            const { data } = await axios({
              method,
              url: action,
              data: bodyFormData,
              onUploadProgress: (event) => {
                listFiles = listFiles.map((item) => {
                  if (item.id === dataFile.id) {
                    item.percent = parseInt((event.loaded / event.total) * 100);
                    item.status = item.percent === 100 ? 'done' : 'uploading';
                  }
                  return item;
                });
                set_listFiles(listFiles);
              },
            });
            listFiles = !onlyImage
              ? listFiles.map((item) => {
                  if (item.id === dataFile.id) {
                    item = { ...item, ...data.data, status: 'done' };
                  }
                  return item;
                })
              : [{ ...data.data, status: 'done' }];
            set_listFiles(listFiles);
            await onChange(listFiles);
          } catch (e) {
            // if (e.response.data.message) Message.error({ text: e.response.data.message });
            set_listFiles(listFiles.filter((_item) => _item.id !== dataFile.id));
          }
        } else {
          try {
            const data = await action(file, {
              onUploadProgress: (event) => {
                listFiles = listFiles.map((item) => {
                  if (item.id === dataFile.id) {
                    item.percent = parseInt((event.loaded / event.total) * 100);
                    item.status = item.percent === 100 ? 'done' : 'uploading';
                  }
                  return item;
                });
                set_listFiles(listFiles);
              },
            });
            listFiles = !onlyImage
              ? listFiles.map((item) => {
                  if (item.id === dataFile.id) {
                    item = { ...item, ...data.data, status: 'done' };
                  }
                  return item;
                })
              : [{ ...data.data, status: 'done' }];
            set_listFiles(listFiles);
            await onChange(listFiles);
          } catch (e) {
            set_listFiles(listFiles.filter((_item) => _item.id !== dataFile.id));
          }
          set_isLoading(false);
        }
        setTimeout(() => {
          import('glightbox').then(({ default: GLightbox }) => new GLightbox());
        });
      }
    }
    // set_isLoading(false);
    // ref.current.value = '';
  };
  return (
    <Spin spinning={isLoading}>
      <div className={classNames({ 'text-right': right })}>
        <input
          type="file"
          className={'hidden'}
          accept={accept}
          multiple={!onlyImage && multiple}
          ref={ref}
          onChange={onUpload}
        />
        <span onClick={() => ref.current.click()}>
          {onlyImage || accept === 'image/*' || importExcel ? (
            <div>
              {prop.children ? (
                prop.children
              ) : listFiles.length > 0 ? (
                <Avatar size={150} src={listFiles[0][keyImage] || listFiles[0].thumbUrl} />
              ) : (
                <div className="border-dashed border border-gray-300 rounded-2xl w-40 h-40 flex items-center justify-center">
                  <i className="las la-plus la-3x" />
                </div>
              )}
            </div>
          ) : (
            showBtnUpload && (
              <button
                type={'button'}
                className="bg-blue-500 text-white px-4 h-10 rounded-xl hover:bg-blue-400 inline-flex items-center mb-3"
              >
                <i className="las la-upload mr-1" /> {t('components.form.Upload')}
              </button>
            )
          )}
        </span>
      </div>

      <div
        className={classNames({
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4':
            viewGrid,
        })}
      >
        {!onlyImage && !isProduct &&
          listFiles.map((file, index) => (
            <div
              key={index}
              className={classNames({
                'bg-yellow-100': file.status === 'error',
                'flex items-center py-1': !viewGrid,
                'pb-6': viewGrid,
              })}
            >
              <div className={classNames({ 'w-20': !viewGrid })}>
                <a href={file[keyImage]} className="glightbox">
                  <img
                    className={classNames({ 'object-cover object-center h-20 w-20': !viewGrid })}
                    src={file[keyImage] ? file[keyImage] : file.thumbUrl}
                    alt={file.name}
                  />
                  {/* <i className="las la-play-circle text-8xl px-6 mr-1" /> */}
                </a>
              </div>
              <div className={classNames('relative', { 'flex-1 flex items-center': !viewGrid })}>
                {!viewGrid && (
                  <div className={'pl-5'}>
                    <strong>{file?.fileName ? file.fileName : file.name}</strong>
                    {file.status === 'error' && <span className={'px-2 py-1 bg-red-500 text-white'}>Upload Error</span>}
                    {(file?.createdDate || file.lastModified) && (
                      <div>
                        Added{' '}
                        {moment(file?.createdDate ? file.createdDate : file.lastModified).format(
                          formatDate + ' - HH:mm',
                        )}{' '}
                        |&nbsp;
                        {typeof file.size === 'number' ? (file.size / (1024 * 1024)).toFixed(2) + 'MB' : file.size}
                      </div>
                    )}
                    {file.status === 'uploading' && <Progress percent={file.percent} />}
                  </div>
                )}

                {(file.status === 'done' || !file.status) && (
                  <div className={classNames('absolute right-0 flex', { 'w-full justify-center top-1': viewGrid })}>
                    {extendButton(file)}
                    {!!showBtnDownload(file) && (
                      <button
                        type={'button'}
                        className="embed border border-gray-300 text-xs rounded-lg mr-2"
                        onClick={() => handleDownload(file)}
                      >
                        <DownloadIcon />
                      </button>
                    )}
                    {!!showBtnDelete(file) && (
                      <Popconfirm
                        placement="left"
                        title={t('components.datatable.areYouSureWant')}
                        icon={
                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                        }
                        onConfirm={async () => {
                          if (deleteFile && file?.id) {
                            const data = await deleteFile(file?.id);
                            if (!data) {
                              return false;
                            }
                          }
                          onChange && onChange(listFiles.filter((_item) => _item.id !== file.id));
                        }}
                        okText={t('components.datatable.ok')}
                        cancelText={t('components.datatable.cancel')}
                      >
                        <button
                          type={'button'}
                          className={classNames('embed border border-gray-300 text-xs rounded-lg', {
                            'mr-2': !viewGrid,
                          })}
                        >
                          <RemoveIcon />
                        </button>
                      </Popconfirm>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </Spin>
  );
};
export default Component;
