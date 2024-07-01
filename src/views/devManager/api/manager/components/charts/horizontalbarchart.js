import {HorizontalBar} from 'vue-chartjs'

export default {
  extends: HorizontalBar,
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
          let height = chartInstance.chartArea.bottom
          let datasets = chartInstance.data.datasets
          if (datasets[0].data) {
            if (datasets[0].data.length > 0) {
              datasets.forEach(function (dataset, datasetIndex) {
                let datasetMeta = chartInstance.getDatasetMeta(datasetIndex);
                datasetMeta.data.forEach(function (segment, segmentIndex) {
                  let height = segment._model.height,
                    posX = segment.tooltipPosition().x,
                    posY = segment.tooltipPosition().y - (height / 2);
                  ctx.save();
                  ctx.fillStyle = '#E9EAEE';
                  ctx.fillRect(posX, posY, width - posX, height);
                  ctx.restore()

                  //ctx.font = chartInstance.chart.helpers.fontString(chartInstance.chart.global.defaultFontSize, chartInstance.chart.defaults.global.defaultFontStyle, chartInstance.chart.defaults.global.defaultFontFamily);
                  ctx.textAlign = "left";
                  ctx.textBaseline = "center";
                  let data = dataset.data[segmentIndex];
                  ctx.fillText(data, width + 13, posY + height - 3);
                });
              });
            } else {
              chartInstance.clear();
              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = '20px PingFangSC-Medium';
              ctx.fillStyle = '#646464';
              ctx.fillText('暂无数据', Math.ceil(width / 2), Math.ceil(height / 2));
              ctx.restore();
            }
          }
        }
      }
    )
  }
}
