import { colorGlobal, letterGlobal } from 'variable';

const Util = (text) => {
  text = text.trim();
  return colorGlobal[letterGlobal.indexOf(text.charAt(0).toUpperCase()) % (colorGlobal.length - 1)];
};
export default Util;
