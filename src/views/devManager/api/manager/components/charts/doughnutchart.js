import {Doughnut} from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ['data', 'options'],
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    }
  },
  mounted() {
    this.addPlugin({
        id: 'bar_background_plugin',
        afterDatasetsDraw: function (chartInstance) {
          let ctx = chartInstance.chart.ctx
          let width = chartInstance.chartArea.right
          let datasets = chartInstance.data.datasets
          if (datasets[0].data) {
            if (datasets[0].data.length === 0) {
              chartInstance.clear();
              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '20px PingFangSC-Medium';
              ctx.fillStyle = '#646464';
              ctx.fillText('暂无数据', width / 2, 150);
              ctx.restore();
            }
          }
        }
      }
    )
  }
}
