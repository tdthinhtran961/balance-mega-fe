import React, { useState } from 'react';
import { Form as FormAnt } from 'antd';
import { Form } from 'components';
import { convertFormValue, routerLinks } from 'utils';
import HookModal from '../index';
import { useNavigate } from 'react-router';

const Hook = ({
  className,
  parentID = () => {},
  title,
  isLoading,
  setIsLoading,
  handleChange,
  Post,
  Put,
  Patch,
  Delete,
  GetById,
  values,
  readOnly,
  firstRun,
  widthModal = 1200,
  columns,
  textSubmit,
  idElement,
  ...propForm
}) => {
  const [form] = FormAnt.useForm();
  const [firstChange, set_firstChange] = useState(false);
  const navigate = useNavigate();

  const [handleShow, Modal] = HookModal({
    className,
    widthModal,
    isLoading,
    setIsLoading,
    firstChange,
    idElement: 'modal-form-' + idElement,
    textSubmit,
    // navigate: propForm?.navigate,
    title: (data) => title(data),
    onOk: async (data) => {
      // console.log(data);
      return form
        .validateFields()
        .then(async (values) => {
          values = convertFormValue(columns, values, form);
          // console.log(values);
          // console.log(!!Put);
          if (!!Post || !!Put) {
            try {
              setIsLoading(true);
              const res = await (data.id === undefined
                ? Post(values, parentID())
                : Put(values, data.id, parentID(), data));
              if (res !== false) {
                values = res?.data;
              } else {
                setIsLoading(false);
                return false;
              }
            } catch (e) {
              setIsLoading(false);
            }
          }
          handleChange && (await handleChange(values, data));
          !!propForm.navigate && navigate(`${routerLinks('ConnectManagement')}`);
          return true;
        })
        .catch(() => false);
    },
  });

  const handleEdit = async (item = {}) => {
    set_firstChange(false);
    !!firstRun && (await firstRun(item));

    if (item && item.id && GetById) {
      setIsLoading(true);
      const { data } = await GetById(item.id, parentID(), item);
      item = { ...item, ...data };
      setIsLoading(false);
    }
    await handleShow(item);
  };
  const handleDelete = async (id, item) => {
    Delete && (await Delete(id, parentID(), item));
    handleChange && (await handleChange());
  };

  return [
    handleEdit,
    () =>
      Modal((data) => (
        <Form
          {...propForm}
          onFirstChange={() => set_firstChange(true)}
          values={data}
          form={form}
          columns={columns}
          readOnly={readOnly}
        />
      )),
    handleDelete,
  ];
};
export default Hook;
