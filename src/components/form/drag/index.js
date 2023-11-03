import React, { useState, Fragment, useRef } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ModalForm } from 'components';
import Nestable from './Nestable';
import EditIcon from 'assets/svg/edit';
import RemoveIcon from 'assets/svg/remove';

const Component = ({
  condition,
  onDelete,
  items,
  onSave,
  onMoreAdd,
  renderLeftButton,
  showName,
  conditionDelete = () => true,
  conditionDrag = () => true,
  conditionEdit = () => true,
  GetById,
  Post,
  Put,
  Delete,
  renderHeader,
  widthForm = 800,
  readOnly = false,
  showAddNew = true,
  showList = true,
  maxDepth = 1,
  columns,
  disabledDrag = false,
  allowActions = true,
  changeTitleConfirmDelete,
  extendButton,
  isAllowDrag = () => false,
  initAddNew = {},
  idElement,
  ...propForm
}) => {
  const { t } = useTranslation();
  const [titleConfirmDelete, set_titleConfirmDelete] = useState(t('components.datatable.areYouSureWant'));
  let position = 0;
  const [isLoading, setIsLoading] = useState(false);

  const handChangePosition = ({ items, item }) => {
    position = 0;
    items = loop(items, 0, item);
    return onSave && onSave(items);
  };

  const loop = (array, parentId, item) => {
    for (let i = 0; i < array.length; i++) {
      position++;
      array[i].position = position;
      array[i].parent_id = parentId;
      if (array[i].children.length > 0) {
        array[i].children = loop(array[i].children, array[i].id, item);
      }
    }
    return array;
  };

  const findItemById = (newItem, id, array) => {
    return array.map((item) => {
      if (item.id === id) {
        return { ...item, ...newItem };
      } else if (item.children) {
        item.children = findItemById(newItem, id, item.children);
      }
      return item;
    });
  };

  const handleSubmit = async (values, id) => {
    if (id !== undefined) {
      onSave && onSave(findItemById(values, id, items), id, values);
    } else if (typeof values === 'object') {
      if (!values?.id) {
        values.id = v4() + '-11c';
      }
      items.push(values);
      onSave && onSave(items, null, values);
    } else {
      onSave && onSave(items);
    }
  };

  const handleDelete = async (id, item) => {
    if (Delete) {
      await Delete(id, item);
    }
    return onSave && onSave(deleteItem(items, id), id, null, true);
  };

  const deleteItem = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        if (onDelete) {
          array[i] = onDelete(array[i]);
        } else {
          array[i] = null;
        }
      } else if (array[i].children) {
        array[i].children = deleteItem(array[i].children, id);
      }
    }
    return array.filter((item) => !!item);
  };

  const modalForm = useRef();

  const renderRow = (item, collapseIcon) =>
    (!condition || condition(item)) && (
      <div className="item-drag flex justify-between items-center" key={item.id}>
        <div className="flex flex-1 items-center justify-between py-2 pl-3">
          {!!collapseIcon && <div className="w-7">{collapseIcon}</div>}
          {showName ? showName(item, modalForm?.current?.handleEdit) : item.name}
        </div>
        {!readOnly && (
          <div
            className={classNames('pr-1 flex items-center justify-end pt-1', {
              'w-20': !!conditionDelete(item),
              'w-10': !conditionDelete(item),
            })}
          >
            {extendButton && extendButton(item)}
            {((!!allowActions && !item.allowActions) ||
              !!item.allowActions?.allowEdit ||
              (typeof item.id === 'string' && item.id.length === 40)) &&
              conditionEdit(item) && (
                <Tooltip title={t('routes.admin.Layout.Edit')}>
                  <button
                    type={'button'}
                    className={classNames('embed border border-gray-300 text-xs rounded-lg', {
                      'mr-2': !!conditionDelete(item),
                    })}
                    onClick={() => modalForm?.current?.handleEdit(item)}
                  >
                    <EditIcon />
                  </button>
                </Tooltip>
              )}
            {((!!allowActions && !item.allowActions) ||
              !!item.allowActions?.allowDelete ||
              (typeof item.id === 'string' && item.id.length === 40)) &&
              conditionDelete(item) && (
                <Tooltip title={t('routes.admin.Layout.Delete')}>
                  <Popconfirm
                    onVisibleChange={(visible) =>
                      changeTitleConfirmDelete && changeTitleConfirmDelete(visible, item, set_titleConfirmDelete)
                    }
                    title={titleConfirmDelete}
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                    okText={t('components.datatable.ok')}
                    cancelText={t('components.datatable.cancel')}
                    onConfirm={() => handleDelete(item.id, item)}
                  >
                    <button type={'button'} className="embed border border-gray-300 text-xs rounded-lg">
                      <RemoveIcon />
                    </button>
                  </Popconfirm>
                </Tooltip>
              )}
          </div>
        )}
      </div>
    );
  return items ? (
    <Fragment>
      <div className="flex justify-between items-center mb-3">
        <div>{renderLeftButton && renderLeftButton(items)}</div>
        <div className="flex justify-end">
          {!readOnly && !!showAddNew && (
            <button
              type={'button'}
              className={classNames(
                'bg-blue-500 text-white px-4 h-10 rounded-xl hover:bg-blue-400 inline-flex items-center',
                { 'mr-2': !!onMoreAdd },
              )}
              onClick={() => modalForm?.current?.handleEdit(initAddNew)}
            >
              <i className="las la-plus mr-1" />
              {t('routes.admin.Layout.Add')}
            </button>
          )}
          {onMoreAdd && onMoreAdd(items)}
        </div>
      </div>
      {!!showList && (
        <Fragment>
          {renderHeader && renderHeader({})}
          {items.map((item) => !isAllowDrag(item) && renderRow(item))}
          <Nestable
            className={classNames({ disabled: readOnly || disabledDrag })}
            maxDepth={maxDepth}
            items={items}
            collapsed={true}
            confirmChange={(item) => conditionDrag(item)}
            onChange={handChangePosition}
            renderItem={({ item, collapseIcon }) => isAllowDrag(item) && renderRow(item, collapseIcon)}
          />
        </Fragment>
      )}
      <ModalForm
        ref={modalForm}
        title={(data) => (!data?.id ? t('routes.admin.Layout.Add') : t('routes.admin.Layout.Edit'))}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleChange={(values, oldData) => handleSubmit(values, oldData?.id)}
        columns={columns}
        GetById={GetById}
        Post={Post}
        Put={Put}
        widthModal={widthForm}
        idElement={idElement}
        {...propForm}
      />
    </Fragment>
  ) : (
    <div>No Data</div>
  );
};
export default Component;
