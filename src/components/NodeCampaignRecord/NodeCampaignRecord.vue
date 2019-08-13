<template>
  <div class="node-campaign-record"
       v-if="tableData.length > 0">
    <div class="title">{{$t('nodeCampaignRecord.tittle')}}</div>
    <div class="commonTable">
      <el-table :data="tableData | pageFilter(pageNumber, pageSize)"
                style="width: 100%">
        <el-table-column prop="blockHeight"
                         :label="$t('nodeCampaignRecord.blockHeight')"
                         width="340">
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="date"-->
        <!--label="时间"-->
        <!--width="268">-->
        <!--</el-table-column>-->
        <el-table-column :label="$t('nodeCampaignRecord.isNode')"
                         width="416">
          <template slot-scope="scope">
            <!--<div>{{aaa(scope.row.blockHeight) | isNodeFilter(address, httpProvider)}}</div>-->
            <div>{{scope.row.status}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cycleIncome"
                         :label="$t('nodeCampaignRecord.cycle_revenue')">
          <template slot-scope="scope">
            <div>{{scope.row.blockHeight | incomeFilter(incomeList)}} MAN</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :current-page="pageNumber"
                     @current-change="currentChange"
                     :total="tableData.length">
      </el-pagination>
    </div>
    <!--<div class="has-more">-->
    <!--<i class="el-icon-plus"></i>-->
    <!--查看更多记录-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: 'NodeCampaignRecord',
  data () {
    return {
      tableData: [],
      address: this.$store.state.wallet.address,
      // address: 'MAN.4TPTF3HDjTqU7baTpGwNm6fNWnfB3',
      pageSize: 5,
      pageNumber: 1,
      incomeList: [],
      miners: [],
      validators: [],
      cycle: 100,
      blockNumber: 0
    }
  },
  mounted () {
    // this.getTopologyStatus()
    this.getIncomeList()
  },
  methods: {
    getStatus (index) {
      let down = Number(index.split('-')[0])
      let topologyStatus = this.httpProvider.man.getTopologyStatus(down + 1)
      let miners = topologyStatus.miners.filter(item => (item.account === this.address) && (item.online || item.online === true))
      let validators = topologyStatus.validators.filter(item => item.account === this.address && (item.online || item.online === true))
      let result = '未选中'
      if (miners.length > 0) {
        result = '矿工节点'
      }
      if (validators.length > 0) {
        result = '验证者节点'
      }
      return result
    },
    currentChange (status) {
      this.pageNumber = status
      for (let i = (status - 1) * 5; i < 5 * status; i++) {
        let status = this.getStatus(this.tableData[i].blockHeight)
        this.tableData[i].status = status
      }
    },
    getBlockNumber () {
      this.blockNumber = this.httpProvider.man.blockNumber
      let row = Number(Math.ceil(this.blockNumber / 300))
      let count = 0
      for (let i = 0; i < row; i++) {
        let down = i * 300
        let up = (i + 1) * 300
        if (this.isIncome(down, up)) {
          this.tableData.push({
            blockHeight: down + '-' + up,
            index: count,
            status: ''
          })
          count = count + 1
        }
      }
      if (this.isIncome(row * 300, this.blockNumber)) {
        this.tableData.push({
          blockHeight: (row * 300) + '-' + (this.blockNumber),
          index: count,
          status: ''
        })
        count = count + 1
      }
      for (let i = 0; i < 5; i++) {
        if (this.tableData.length > 0) {
          let status = this.getStatus(this.tableData[i].blockHeight)
          this.tableData[i].status = status
        }
      }
      this.$emit('incomeList', this.tableData.length)
    },
    getTopologyStatus () {
      let data = this.httpProvider.man.getTopologyStatus('latest')
      this.miners = data.miners.filter(item => item.account === this.address)
      this.validators = data.validators.filter(item => item.account === this.address)
    },
    getIncomeList () { // 获取抵押资产
      this.$http.get('findHistoryIncomeByBlockNumber/' + this.address + '/' + this.cycle * 100).then(res => {
        if (res.data.status === 200) {
          this.incomeList = res.data.result
          this.getBlockNumber()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    isIncome (down, up) {
      return this.incomeList.some(result => {
        return result.blockNumber >= down && result.blockNumber < up
      })
    }
  }
}
</script>

<style scoped lang="less">
.node-campaign-record {
  border-bottom: 1px solid #d5d7de;
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin: 1.94rem 0 0.94rem 0;
  }
  .has-more {
    font-size: 0.88rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    text-align: center;
    margin: 1.51rem 0 2.38rem 0;
  }
  .el-pagination {
    // float: right;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
}
</style>
