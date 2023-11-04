// import moment from 'moment';
import { DatePicker, Space } from 'antd';
import { getFormattedDate, formatDateString } from 'utils';
import React from 'react';
import './index.less';
import dayjs from 'dayjs';

const DateFilterBar = ({ onChangeDateFrom, onChangeDateTo, showValidateFilter, firstDay, date }) => {
  return (
    <div className="sm:relative sm:mt-0 mt-4">
      <div className="sm:flex gap-4 items-end justify-end">
        <Space direction="vertical" className="flex items-center gap-2 lg:w-[223px] xl:ml-4">
          <p className="text-[12px] text-left sm:mr-0 mr-4 lg:w-[56px] w-auto">Từ ngày</p>{' '}
          {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
            <DatePicker
              onChange={onChangeDateFrom}
              format="DD/MM/YYYY"
              defaultValue={dayjs(getFormattedDate(firstDay), 'DD/MM/YYYY')}
              disabledDate={(current) => {
                return current && current.valueOf() > Date.now();
              }}
              size={'middle'}
            />
          ) : (
            <DatePicker
              onChange={onChangeDateFrom}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current.valueOf() > Date.now();
              }}
              size={'middle'}
            />
          )}
        </Space>
        <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[233px] datepicker-to">
          <p className="text-[12px] text-left lg:w-[56px] w-auto">Đến ngày</p>
          <DatePicker
            onChange={onChangeDateTo}
            format="DD/MM/YYYY"
            defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')}
            disabledDate={(current) => {
              return current && current.valueOf() > Date.now();
            }}
            className={'sm:ml-0 datepicker-to-input'}
            size={'middle'}
          />
        </Space>
      </div>
      {showValidateFilter && (
        <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10">
          Ngày kết thúc phải lớn hơn ngày bắt đầu
        </span>
      )}
    </div>
  );
};

export default DateFilterBar;
