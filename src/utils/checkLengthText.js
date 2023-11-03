const Util = (text, length = 40) => {
  return text && text.length < length ? text : text.substr(0, length - 3) + '...';
};
export default Util;
