import React, { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
// import classNames from 'classnames';
// import { routerLinks } from 'utils';
import { Spin } from 'components';
import SearchBar from '../search';
import './index.less';

const Hook = ({
  className,
  title,
  widthModal = 800,
  onOk,
  onCancel,
  keyWord,
  GetById,
  Get,
  isLoading,
  setIsLoading,
  // firstChange = true,
  textSubmit,
  textCancel,
  showSubmitButton = true,
  search = false,
  searchHolder,
  idSearch,
  // navigate,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [data, set_data] = useState({});
  const handleCancel = () => {
    setIsVisible(false);
    !!onCancel && onCancel(data);
  };
  const handleOk = async () => {
    // console.log(navigate);
    setIsLoading && setIsLoading(true);
    if (!!onOk && (await onOk(data)) === false) {
      setIsLoading && setIsLoading(false);
      return false;
    }
    setIsLoading && setIsLoading(false);
    handleCancel();
  };

  const handleShow = async (item = {}) => {
    if (GetById) {
      setIsLoading(true);
      const { data } = await GetById(item.id);
      item = { ...item, ...data };
      setIsLoading(false);
    }
    if (Get) {
      setIsLoading(true);
      const { data } = await Get(keyWord);
      item = { ...data };
      setIsLoading(false);
    }
    set_data(item);
    setIsVisible(true);
  };

  const handleChange = async (searchKey, item = {}) => {
    // if (GetById) {
    //   setIsLoading(true);
    //   const { data } = await GetById(item.id);
    //   item = { ...item, ...data };
    //   setIsLoading(false);
    // }
    if (Get) {
      setIsLoading(true);
      const { data } = await Get(searchKey);
      item = { ...data };
      setIsLoading(false);
    }
    set_data(item);
    setIsVisible(true);
  };

  return [
    handleShow,
    (children) => (
      <Modal
        className={className}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={widthModal}
        title={<h3 className="title">{title(data)}</h3>}
        open={isVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          !!onOk && (
            <div className="flex justify-center gap-5 buttonGroup">
              <button
                type={'button'}
                className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
                text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
                onClick={handleCancel}
              >
                {textCancel || 'Hủy'}
              </button>
              {showSubmitButton && (
                <button
                  type={'button'}
                  // disabled={!firstChange}
                  // className={classNames('px-4 py-2.5 rounded-xl inline-flex items-center', {
                  //   'bg-gray-100 hover:bg-gray-300 hover:text-white text-gray-400 border border-gray-200 border-solid':
                  //     !firstChange,
                  //   'px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1': firstChange,
                  // })}
                  className={
                    'py-2.5 px-2 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1 w-[166px] text-center'
                  }
                  onClick={handleOk}
                >
                  {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
                  {textSubmit || t('components.form.modal.save')}
                </button>
              )}
            </div>
          )
        }
      >
        {search && <SearchBar onChange={handleChange} searchHolder={searchHolder} idSearch={idSearch} />}
        <Spin spinning={isLoading}>{children(data, set_data, setIsVisible)}</Spin>
      </Modal>
    ),
    set_data,
    data,
    handleCancel,
    handleChange,
  ];
};
export default Hook;
