import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  props: ['data', 'options'],
  watch: {
    data() {
      // if (this.data) {
      this.renderChart(this.data, this.options)
      // }
    }
  },
  mounted() {
    this.addPlugin({
        id: 'line_background_plugin',
        afterDatasetsDraw: function (chartInstance) {
          let ctx = chartInstance.chart.ctx
          let width = chartInstance.chartArea.right
          let height=chartInstance.chartArea.bottom
          let datasets = chartInstance.data.datasets
          let data = datasets[0].data
          if (data.length === 0) {
            chartInstance.clear();
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '20px PingFangSC-Medium';
            ctx.fillStyle = '#646464';
            ctx.fillText('暂无数据', Math.ceil(width / 2), 150);
            ctx.restore();
          }
        }
      }
    )
  }
}
