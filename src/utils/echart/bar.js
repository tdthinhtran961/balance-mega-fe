const Util = ({ id, label, series, tooltip = {}, grid = {}, legend = {}, xAxis = {} }) => {
  import('echarts').then((echarts) => {
    const element = document.getElementById(id);
    if (element) {
      echarts.init(element).setOption({
        tooltip: {
          trigger: 'axis',
          ...tooltip,
        },
        grid: {
          top: '40px',
          left: '40px',
          bottom: '30px',
          right: '40px',
          ...grid,
        },
        legend: {
          show: true,
          ...legend,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#000000',
            },
          },
          ...xAxis,
          data: label,
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series,
      });
    }
  });
};
export default Util;
