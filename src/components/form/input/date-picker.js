import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

const Component = ({ form, name, ...props }) => {
  if (!props.id) {
    props.id = 'date-picker-' + v4();
  }
  return (
    <DatePicker
      {...props}
      onOpenChange={(e) => {
        if (!e) {
          const value = document.getElementById(props.id).value;
          const selectDate = moment(value, props.format || 'DD/MM/YYYY');
          if (
            selectDate.isValid() &&
            props.onChange &&
            (!form ||
              (form.getFieldValue(name) &&
                form.getFieldValue(name).format(props.format || 'DD/MM/YYYY') !==
                  selectDate.format(props.format || 'DD/MM/YYYY')))
          ) {
            props.onChange(selectDate, value);
          }
        }
      }}
    />
  );
};
export default Component;
