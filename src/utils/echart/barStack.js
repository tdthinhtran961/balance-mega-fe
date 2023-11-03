const Util = ({ id }) => {
  import('echarts').then((echarts) => {
    const element = document.getElementById(id);
    if (element) {
      const label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'];
      const data = {
        korea: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
        japan: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
        china: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
        unitedStates: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
        vietnam: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
        global: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
        malaysia: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
        india: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
      };
      const values = Object.values(data);
      const transposed = values[0].map((r, i) => values.map((c) => c[i]));
      const total = transposed.map((row) => row.reduce((a, b) => a + b));

      const color = [
        '#2563EB',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#6B7280',
        '#EC4899',
        '#8B5CF6',
        '#6366F1',
        'rgba(59, 130, 246, 0.5)',
      ];
      echarts.init(element).setOption({
        color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          icon: 'circle',
          orient: 'horizontal',
          data: ['Korea', 'Japan', 'China', 'United States', 'Vietnam', 'Global', 'Malaysia', 'India'],
        },
        grid: {
          left: '20px',
          right: '0',
          bottom: '0',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: false,
            data: label,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: false,
          },
        ],
        series: [
          {
            name: 'Korea',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            itemStyle: { borderRadius: [0, 0, 0, 0] },
            data: data.korea,
          },
          {
            name: 'Japan',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            data: data.japan,
          },
          {
            name: 'China',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            itemStyle: { borderRadius: [0, 0, 0, 0] },
            data: data.china,
          },
          {
            name: 'United States',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            itemStyle: { borderRadius: [0, 0, 0, 0] },
            data: data.unitedStates,
          },
          {
            name: 'Vietnam',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            data: data.vietnam,
          },
          {
            name: 'Global',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            itemStyle: { borderRadius: [0, 0, 0, 0] },
            data: data.global,
          },
          {
            name: 'Malaysia',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            data: data.malaysia,
          },
          {
            name: 'India',
            type: 'bar',
            stack: '2021',
            barWidth: 20,
            itemStyle: { borderRadius: [20, 20, 0, 0] },
            data: data.india,
          },
          {
            name: 'Total',
            type: 'line',
            smooth: true,
            showAllSymbol: false,
            symbolSize: 0,
            lineStyle: {
              width: 0,
              color: 'rgba(59, 130, 246, 0.5)',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  { offset: 0, color: 'rgba(59, 130, 246,0.5)' },
                  { offset: 1, color: 'rgba(59, 130, 246,0.05)' },
                ],
                false,
              ),
            },
            data: total,
            z: 0,
          },
        ],
      });
    }
  });
};
export default Util;
