import React from 'react';
import { FormDrag } from 'components';
import { HookModal } from 'hooks';

const Hook = ({
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
}) => {
  const [onShowModal, Modal, set_data] = HookModal({
    widthModal,
    isLoading,
    setIsLoading,
    title: (data) => title(data),
    onOk: SaveAll,
    idElement: 'modal-drag-' + idElement,
  });

  const handleShow = async () => {
    setIsLoading(true);
    onReload && (await onReload());
    const data = await Get(id && id());
    setIsLoading(false);
    await onShowModal(data);
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

  return [
    handleShow,
    () =>
      Modal((data) => <FormDrag idElement={idElement} items={data.length ? data : []} onSave={handleSave} {...prop} />),
    handleSave,
  ];
};
export default Hook;
