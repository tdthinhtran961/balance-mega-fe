import axios from 'axios';
import { Message } from 'components';

const Util = async (url, { data, requestDelete }) => {
  const requestPut = [];
  const requestPost = [];
  let index = 0;
  const loop = async (array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].children && array[i].children.length > 0) {
        array[i].children = await loop(array[i].children);
      }
      const dataRequest = { ...array[i] };
      delete dataRequest.children;
      if (dataRequest.id.length === 40) {
        delete dataRequest.id;
      }
      // delete dataRequest.id;
      // if (dataRequest.id.length === 36) {
      //   requestPut.push(dataRequest);
      // } else {
      //   requestPost.push(dataRequest);
      // }
      index += 1;
      dataRequest.position = index;
      requestPut.push(dataRequest);
    }
    return array;
  };
  const newData = await loop(data);
  if (requestPut.length > 0) {
    const { data } = await axios.put(url, requestPut);
    if (data.message) await Message.success({ text: data.message });
  }
  if (requestPost.length > 0) {
    const { data } = await axios.post(url, requestPost);
    if (data.message) await Message.success({ text: data.message });
  }
  if (requestDelete.length > 0) {
    const { data } = await axios.delete(url, { params: requestDelete });
    if (data.message) await Message.success({ text: data.message });
  }
  return newData;
};
export default Util;
