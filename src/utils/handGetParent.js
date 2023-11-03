import axios from 'axios';

const Util = async (url) => {
  let { data } = await axios.get(url);
  data = data.data;
  const findChildren = (data, children) => {
    if (data.children && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        if (data.id === children.parent_id) {
          data.children.push(children);
          return data.children;
        } else data.children[i].children = findChildren(data.children[i], children);
      }
      return data.children;
    } else if (data.id === children.parent_id) return [children];
  };
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].parent_id || data[i].parent_id === '0') {
      data[i].children = [];
      newData.push(data[i]);
    } else {
      newData[newData.length - 1].children = findChildren(newData[newData.length - 1], data[i]);
    }
  }
  return newData;
};
export default Util;
