const Util = ({ id, label, series, color, legend, grid = {}, xAxis = {} }) => {
  import('echarts').then((echarts) => {
    const element = document.getElementById(id);
    if (element) {
      echarts.init(element).setOption({
        color,
        legend,
        grid: {
          top: '0',
          left: '0',
          bottom: '0',
          right: '0',
          ...grid,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            ...xAxis,
            data: label,
          },
        ],
        yAxis: [
          {
            boundaryGap: false,
            type: 'value',
            axisLabel: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
          },
        ],
        series,
      });
    }
  });
};
export default Util;
