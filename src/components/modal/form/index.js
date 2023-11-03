import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form as FormAnt } from 'antd';

import { Modal, Form } from 'components/index';
import { convertFormValue } from 'utils';

const Hook = forwardRef(
  (
    {
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
      className = '',
      footerCustom,
      ...propForm
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({ handleEdit, handleDelete, form }));

    const [form] = FormAnt.useForm();
    const [firstChange, set_firstChange] = useState(false);
    const [data, set_data] = useState({});

    const handleEdit = async (item = {}) => {
      set_firstChange(false);
      !!firstRun && (await firstRun(item));

      if (item && item.id && GetById) {
        setIsLoading(true);
        const { data } = await GetById(item.id, parentID(), item);
        item = { ...item, ...data };
        setIsLoading(false);
      }
      set_data(item);
      await modal?.current?.handleShow(item);
    };
    const handleDelete = async (id, item) => {
      Delete && (await Delete(id, parentID(), item));
      handleChange && (await handleChange());
    };
    const modal = useRef();

    return (
      <Modal
        ref={modal}
        widthModal={widthModal}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        firstChange={firstChange}
        idElement={'modal-form-' + idElement}
        textSubmit={textSubmit}
        className={className}
        footerCustom={footerCustom}
        title={(data) => title(data)}
        onOk={async (data) => {
          return form
            .validateFields()
            .then(async (values) => {
              values = convertFormValue(columns, values, form);
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
              return true;
            })
            .catch(() => false);
        }}
      >
        <Form
          {...propForm}
          onFirstChange={() => set_firstChange(true)}
          values={data}
          form={form}
          columns={columns}
          readOnly={readOnly}
        />
      </Modal>
    );
  },
);
Hook.displayName = 'HookModalForm';
export default Hook;
