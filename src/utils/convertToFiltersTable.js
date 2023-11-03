const Util = (array) => {
  const _temp = [];
  if (array) {
    const loop = (array) => {
      for (let i = 0; i < array.length; i++) {
        _temp.push({ value: array[i].id, label: array[i].name });
        if (array[i].children && array[i].children.length > 0) {
          loop(array[i].children);
        }
      }
    };
    loop(array);
  }
  return _temp;
};
export default Util;
