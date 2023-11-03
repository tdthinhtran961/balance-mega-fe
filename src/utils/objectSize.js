import { cleanObjectKeyNull } from 'utils';

const Util = (obj, skipKeys = []) => {
  const tempObj = cleanObjectKeyNull(obj);
  let size = 0;
  let key;
  for (key in tempObj) {
    if (Object.prototype.hasOwnProperty.call(tempObj, key) && skipKeys.indexOf(key) === -1) size++;
  }
  return size;
};
export default Util;
