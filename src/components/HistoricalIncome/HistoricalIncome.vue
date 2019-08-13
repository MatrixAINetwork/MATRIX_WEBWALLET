<template>
  <div class="historical-income">
    <div class="title">
      <div class="income">
        <span>{{totalIncome}} MAN</span>
        {{$t('HistoricalIncome.total_revenue')}}
      </div>
      <!--<div class="tip">-->
        <!--{{$t('HistoricalIncome.mining_hint')}}-->
      <!--</div>-->
      <div class="change-chart flex">
        <div class="bar-img"
             :class="{'active' : type === 'bar'}"
             @click="changeType('bar')">
          <img :src="type === 'bar' ? require('../../assets/images/bar-active.png') : require('../../assets/images/bar.png')" />
        </div>
        <div class="pie-img"
             :class="{'active' : type === 'pie'}"
             @click="changeType('pie')">
          <img :src="type === 'pie' ? require('../../assets/images/pie-active.png') : require('../../assets/images/pie.png')" />
        </div>
      </div>
      <div class="chart">
        <div v-show="type === 'pie'"
             class="pie-chart"
             ref="pieEchart"></div>
        <div v-show="type === 'bar'"
             class="bar-chart"
             ref="barEchart"></div>
      </div>
    </div>
    <div class="selection"
         v-if="depositShow || cancelDepositShow">
      <button class="common-button"
              @click="openDialog"
              v-if="depositShow">{{$t('HistoricalIncome.remove_mortgage')}}</button>
      <button class="common-button"
              @click="openExitDialog"
              v-if="cancelDepositShow">{{$t('HistoricalIncome.refund')}}</button>
    </div>
    <common-dialog :commonDialogVisible="commonDialogVisible"
                   :address="address"
                   :title="$t('HistoricalIncome.remove_mortgage')"
                   :msg="$t('HistoricalIncome.remove_tittle')"
                   :okText="$t('HistoricalIncome.determine')"
                   :cancelText="$t('HistoricalIncome.cancel')"
                   :width="'365px'"
                   @closeDialog="closeDialog"></common-dialog>
    <common-dialog-cancel :commonDialogExitVisible="commonDialogExitVisible"
                          :address="address"
                          :title="$t('HistoricalIncome.determine_refund')"
                          :msg="$t('HistoricalIncome.refundHint')"
                          :okText="$t('HistoricalIncome.determine')"
                          :cancelText="$t('HistoricalIncome.cancel')"
                          :width="'365px'"
                          @closeExitDialog="closeExitDialog"></common-dialog-cancel>
  </div>
</template>

<script>
import echarts from 'echarts'
import CommonDialog from '@/components/CommonDialog/CommonDialog'
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'

export default {
  name: 'HistoricalIncome',
  data () {
    return {
      address: this.$store.state.wallet.address,
      // address: 'MAN.2LrYy4EbhAi7Az4HdzKHbbyraMPBj',
      commonDialogVisible: false,
      commonDialogExitVisible: false,
      cancelDepositShow: false,
      depositShow: false,
      pieChartData: null,
      barChartData: null,
      type: 'bar',
      exitBlockNumber: 0,
      blockNumber: 0,
      totalIncome: '',
      pieChart: null,
      barChart: null
    }
  },
  beforeDestroy () {
    if (!this.pieChart) {
      return
    }
    this.pieChart.dispose()
    this.pieChart = null
    if (!this.barChart) {
      return
    }
    this.barChart.dispose()
    this.barChart = null
  },
  mounted () {
    this.depositShow = this.$route.query.depositShow
    this.totalIncome = this.$route.query.totalIncome
    this.exitBlockNumber = this.$route.query.exitBlockNumber
    this.cancelDepositShow = this.$route.query.cancelDepositShow
    this.getBarData()
    this.getPieData()
  },
  methods: {
    closeDialog (status) {
      if (status === 'ok') {
        this.depositShow = false
        this.cancelDepositShow = true
      }
      this.commonDialogVisible = false
    },
    openDialog () {
      this.commonDialogVisible = true
    },
    closeExitDialog (status) {
      if (status === 'ok') {
        this.cancelDepositShow = false
      }
      this.commonDialogExitVisible = false
    },
    openExitDialog () {
      this.blockNumber = this.httpProvider.man.blockNumber
      if (this.blockNumber - this.exitBlockNumber > 600) {
        this.commonDialogExitVisible = true
      } else {
        this.$message.error(this.$t('HistoricalIncome.refundError'))
      }
    },
    changeType (status) {
      if (this.type !== status) {
        this.type = status
      }
    },
    getPieData () {
      this.$http.get('findHistoryIncomePie/' + this.address).then(res => {
        if (res.data.status === 200) {
          this.pieChartData = res.data.result
          this.initPie()
        } else {
          this.pieChartData = null
          this.$message.error(res.data.message)
        }
      })
    },
    getBarData () {
      this.$http.get('findHistoryIncomeBar/' + this.address).then(res => {
        if (res.data.status === 200) {
          this.barChartData = res.data.result
          this.initBar()
        } else {
          this.barChartData = null
          this.$message.error(res.data.message)
        }
      })
    },
    initPie () {
      this.pieChart = echarts.init(this.$refs.pieEchart)
      // 把配置和数据放这里
      this.pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          x: 'center',
          bottom: 0,
          data: [this.$t('HistoricalIncome.validator_revenue'), this.$t('HistoricalIncome.minner_revenue'), this.$t('HistoricalIncome.gas')]
        },
        series: [
          {
            name: this.$t('HistoricalIncome.history_revenue'),
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.pieChartData.verifier,
                name: this.$t('HistoricalIncome.validator_revenue'),
                itemStyle: {
                  color: '#0a4d90'
                }
              },
              {
                value: this.pieChartData.miner,
                name: this.$t('HistoricalIncome.minner_revenue'),
                itemStyle: {
                  color: '#1a81b6'
                }
              },
              {
                value: this.pieChartData.gas,
                name: this.$t('HistoricalIncome.gas'),
                itemStyle: {
                  color: '#80d1ee'
                }
              }
            ]
          }
        ]
      })
    },
    initBar () {
      let length = this.barChartData.date.length
      this.barChart = echarts.init(this.$refs.barEchart)
      // 把配置和数据放这里
      this.barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '15%',
          right: '0%',
          bottom: '20%',
          top: '1%'
        },
        calculable: true,
        legend: {
          bottom: 0,
          data: [this.$t('HistoricalIncome.validator_revenue'), this.$t('HistoricalIncome.minner_revenue'), this.$t('HistoricalIncome.gas')]
        },
        xAxis: [
          {
            type: 'category',
            data: this.barChartData.date
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 4
            // max: function(value) {
            //   return Math.ceil(value.max + 50)
            // }
          }
        ],
        dataZoom: [{
          type: 'slider',
          maxSpan: length > 8 ? (8 / length * 100) : 100,
          minSpan: length > 8 ? 0 : 100,
          start: length > 8 ? (100 - (8 / length * 100)) : 0,
          end: 100,
          bottom: 30
        }],
        series: [
          {
            name: this.$t('HistoricalIncome.validator_revenue'),
            type: 'bar',
            barGap: 0,
            barWidth: 12,
            itemStyle: {
              color: '#0a4d90'
            },
            data: this.barChartData.verifier
          },
          {
            name: this.$t('HistoricalIncome.minner_revenue'),
            type: 'bar',
            barGap: 0,
            barWidth: 12,
            itemStyle: {
              color: '#1a81b6'
            },
            data: this.barChartData.miner
          },
          {
            name: this.$t('HistoricalIncome.gas'),
            type: 'bar',
            barGap: 0,
            barWidth: 12,
            itemStyle: {
              color: '#80d1ee'
            },
            data: this.barChartData.gas
          }
        ]
      })
    }
  },
  components: {
    CommonDialog,
    CommonDialogCancel
  }
}
</script>

<style scoped lang="less">
.historical-income {
  text-align: center;
  .title {
    margin-top: 2.06rem;
    .income {
      color: #2c365c;
      font-size: 14px;
      span {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }
    .tip {
      color: #9298ae;
      font-size: 0.75rem;
      margin-top: 15px;
    }
  }
  .change-chart {
    border: 1px solid #f2f4f8;
    border-radius: 2px;
    width: 4.88rem;
    height: 2rem;
    align-items: center;
    float: right;
    margin-right: 11.36rem;
    margin-bottom: 2rem;
    div {
      cursor: pointer;
      width: 50%;
      height: 100%;
      line-height: 1.88rem;
      background: #f2f4f8;
    }
    .active {
      background: #fff;
    }
    img {
      width: 1.13rem;
      height: 1.13rem;
      margin-top: 0.38rem;
    }
  }
  .chart {
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    margin-bottom: 6.25rem;
    margin-top: 2rem;
    .pie-chart {
      width: 36.5rem;
      height: 25rem;
    }
    .bar-chart {
      width: 42.19rem;
      height: 26.44rem;
    }
  }
  .selection {
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    border-top: 1px solid #d5d7de;
    padding-top: 2rem;
    width: 60rem;
    .common-button {
      background: #fff;
      border: 1px solid #1c51dd;
      color: #1c51dd;
      margin-bottom: 3rem;
    }
  }
}
</style>
