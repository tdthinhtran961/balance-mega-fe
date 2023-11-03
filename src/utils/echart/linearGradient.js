const Util = ({ hex }) => {
  import('echarts').then((echarts) => {
    return new echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        { offset: 0, color: hexToRgba({ hex }) },
        { offset: 1, color: hexToRgba({ hex, alpha: 0.1 }) },
      ],
      false,
    );
  });
};
const hexToRgba = ({ hex, alpha = 1 }) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? 'rgba(' +
        parseInt(result[1], 16) +
        ', ' +
        parseInt(result[2], 16) +
        ', ' +
        parseInt(result[3], 16) +
        ',' +
        alpha +
        ')'
    : '';
};
export default Util;
