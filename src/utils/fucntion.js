import moment from "moment";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "utils";
import copy from 'copy-to-clipboard';
moment.locale('vi')

export const isNullOrUndefinedOrEmpty = (v) => v === null || v === undefined || v === ''

export const isNullOrUndefined = (v) => v === null || v === undefined

export const formatDate = (date, formatType) => {
  if (!date) return null;
  return moment(date).utcOffset(0).format(formatType)
}


export const formatPrice = (value) => {
  return (value || value === 0) ? formatCurrency(value, ' ') : null
}

export const formatPercent = (value) => {
  if (!value) return null;
  return `${value}%`
}

export const blockInvalidChar = (e) =>
{
  let chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    '.',
    'ArrowRight',
    'ArrowLeft',
    'Enter',
    'Tab',
  ];
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  return !chars.includes(e.key) && e.preventDefault();
}



export const copyToClipboard = (value) => {
  if (!value) return null;
  return <button onClick={() =>
    copy(value, {
      debug: true,
    })
  }>{value}</button>

}



export const useFetch = ({ apiFunction, params = {}, condition = true }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { options } = params
  useEffect(() => {
    let flag = true;
    async function fetchData() {
      setLoading(true)
      if (!params) return;
      try {
        const result = await apiFunction(options);
        flag && setData(result ?? []);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    condition && fetchData();
    return () => {
      flag = false;
    }
  }, []);

  return { loading, data };
}


export const approximateAmount = (amount) => {
  if (isNullOrUndefined(amount)) return 0
  const roundedAmount = Math.round(amount / 1000) * 1000;
  return roundedAmount;
}
