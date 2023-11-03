const Util = (object) => {
  const newObject = {};
  const keys = [];

  for (const key in object) {
    keys.push(key);
  }

  for (let i = keys.length - 1; i >= 0; i--) {
    newObject[keys[i]] = object[keys[i]];
  }

  return newObject;
};
export default Util;
