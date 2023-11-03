import React, { Fragment } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';

const Component = ({
  name,
  column = [],
  textAdd = 'Thêm dòng',
  onAdd = () => {},
  generateForm,
  form,
  isTable = true,
  showRemove = () => true,
}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) =>
        isTable ? (
          <Fragment>
            <div className={'table w-full border-collapse addable'}>
              <div className="table-row">
                <div className={'table-cell border bg-gray-300 font-bold p-1 text-center w-10'}>STT</div>
                {column.map((col, index) => (
                  <div
                    key={index}
                    className={classNames('table-cell border bg-gray-300 font-bold p-1 text-center', {
                      'w-full': column.length === 1,
                      'w-1/2': column.length === 2,
                      'w-1/3': column.length === 3,
                      'w-1/4': column.length === 4,
                      'w-1/5': column.length === 5,
                      'w-1/6': column.length === 6,
                    })}
                  >
                    {col.title}
                  </div>
                ))}
                <div className={'w-8 h-1'} />
              </div>
              {fields.map(({ key, name: n, ...restField }, i) => (
                <div className="table-row" key={i}>
                  <div className={'table-cell border bg-gray-300 text-center'}>{i + 1}</div>
                  {column.map((col, index) => (
                    <div className={'table-cell border'} key={index}>
                      {generateForm(col, index + '_' + i, false, [n, col.name])}
                    </div>
                  ))}
                  <div className={'table-cell align-middle w-8'}>
                    {showRemove(form.getFieldValue([[name], n]), n) && (
                      <i
                        className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                        onClick={() => {
                          remove(n);
                          onAdd(form.getFieldValue(name), form);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={'flex justify-end'}>
              <button
                type="button"
                className="rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-400 py-1.5 px-4 my-2 addable-add"
                onClick={() => {
                  add();
                  onAdd(form.getFieldValue(name), form);
                }}
              >
                <i className="las la-plus mr-1 text-lg" />
                <span className={'relative -top-0.5'}>{textAdd}</span>
              </button>
            </div>
          </Fragment>
        ) : (
          <div className={'addable'}>
            {fields.map(({ key, name: n, ...restField }, i) => (
              <div className={'grid gap-x-5 grid-cols-12'} key={i}>
                {column.map((col, index) => (
                  <div
                    className={classNames(
                      col?.formItem?.classItem,
                      'col-span-12' +
                        (' sm:col-span-' +
                          (col?.formItem?.colTablet
                            ? col?.formItem?.colTablet
                            : col?.formItem?.col
                            ? col?.formItem?.col
                            : 12)) +
                        (' lg:col-span-' + (col?.formItem?.col ? col?.formItem?.col : 12)),
                    )}
                    key={index}
                  >
                    {generateForm(col, index + '_' + i, true, [n, col.name])}
                  </div>
                ))}
                <div className={'table-cell align-middle w-8'}>
                  {showRemove(form.getFieldValue([[name], n]), n) && (
                    <i
                      className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                      onClick={() => {
                        remove(n);
                        onAdd(form.getFieldValue(name), form);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div className={'flex justify-end'}>
              <button
                type="button"
                className="rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-400 py-1.5 px-4 my-2 addable-add"
                onClick={() => {
                  add();
                  onAdd(form.getFieldValue(name), form);
                }}
              >
                <i className="las la-plus mr-1 text-lg" />
                <span className={'relative -top-0.5'}>{textAdd}</span>
              </button>
            </div>
          </div>
        )
      }
    </Form.List>
  );
};
export default Component;
