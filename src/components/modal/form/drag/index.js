import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, FormDrag } from 'components';

const Hook = forwardRef(
  (
    {
      onReload,
      title = () => null,
      isLoading,
      setIsLoading,
      Get,
      SaveAll,
      id,
      widthModal = 800,
      isReloadLoadToSave = false,
      idElement,
      ...prop
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({ handleShow, handleSave }));

    const [data, set_data] = useState([]);

    const handleShow = async () => {
      setIsLoading(true);
      onReload && (await onReload());
      const res = await Get(id && id());
      setIsLoading(false);
      set_data(res);
      await modal?.current?.handleShow();
    };

    const handleSave = async (items) => {
      if (isReloadLoadToSave) {
        setIsLoading(true);
        const data = await Get(id && id());
        set_data(data);
        setIsLoading(false);
      } else {
        set_data(items);
      }
    };

    const modal = useRef();

    return (
      <Modal
        ref={modal}
        widthModal={widthModal}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        idElement={'modal-drag-' + idElement}
        title={(data) => title(data)}
        onOk={SaveAll}
      >
        <FormDrag idElement={idElement} items={data.length ? data : []} onSave={handleSave} {...prop} />
      </Modal>
    );
  },
);
Hook.displayName = 'HookModalDrag';
export default Hook;
