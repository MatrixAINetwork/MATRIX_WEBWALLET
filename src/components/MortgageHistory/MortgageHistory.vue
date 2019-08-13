<template>
  <div class="mortgage-history">
    <div class="title">{{$t('mortgageHistory.mortgageHistory')}}</div>
    <div class="commonTable">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column :label="$t('mortgageHistory.mortgageTime')"
                         width="150">
          <template slot-scope="scope">
            <!-- <div>{{((scope.row.input.substring(0, scope.row.input.length-64) === '0x3eb61dd9' || scope.row.input.substring(0, scope.row.input.length-64) === '0x80932275') ? (scope.row.timestamp | dateFormat('MM.DD.YYYY hh:ss')) : '----')}}</div> -->
            <div v-if="scope.row.input.substring(0, scope.row.input.length-64) === '0x3eb61dd9' || scope.row.input.substring(0, scope.row.input.length-64) === '0x80932275'">{{scope.row.timestamp | dateFormat('MM.DD.YYYY HH:ss')}}</div>
            <div v-else>———————</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('mortgageHistory.mortgageValue')"
                         width="153">
          <template slot-scope="scope">
            <div class="hash">{{scope.row.value | weiToNumber}} MAN</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('mortgageHistory.mortgageWallet')"
                         width="314">
          <template>
            <div>{{address}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('mortgageHistory.cancelMortgageTime')"
                         width="167">
          <template slot-scope="scope">
            <!-- <div>{{'aaa' === 'bbb' ? '----' : scope.row.timestamp | dateFormat('MM.DD.YYYY HH:ss')}}</div> -->
            <div v-if="scope.row.input.substring(0, scope.row.input.length-64) === '0x3eb61dd9' || scope.row.input.substring(0, scope.row.input.length-64) === '0x80932275'">———————</div>
            <div v-else>{{scope.row.timestamp | dateFormat('MM.DD.YYYY HH:ss')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         :label="$t('mortgageHistory.state')">
          <template slot-scope="scope">
            <div>{{scope.row.input.length &lt; 6 ?
              $t('mortgageHistory.unknown') :
              ((scope.row.input.substring(0, scope.row.input.length-64) === '0x3eb61dd9' || scope.row.input.substring(0, scope.row.input.length-64) === '0x80932275')
              ? $t('mortgageHistory.mortgageSuccess')
              :(scope.row.input==='0x3ccfd60b'?$t('mortgageHistory.alreadyWithdrawal'):$t('mortgageHistory.alreadyRefund')))}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="top_spacing"
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :current-page="pageNumber"
                     @current-change="currentChange"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MortgageHistory',
  data () {
    return {
      address: this.$store.state.wallet.address,
      // address: 'MAN.FHRbr5iA6ujMC7YR2pTPbz2urri9',
      tableData: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0
    }
  },
  mounted () {
    this.getMortgageHistory()
  },
  methods: {
    currentChange (num) {
      this.pageNumber = num
      this.getMortgageHistory()
    },
    getMortgageHistory () { // 获取抵押资产
      this.$http.get('findTxByAddressAndTxType/' + this.address + '/MAN.1111111111111111111B8/0/0/1/10').then(res => {
        if (res.data.status === 200) {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  components: {}
}
</script>

<style scoped lang="less">
.mortgage-history {
  border-bottom: 1px solid #d5d7de;
  padding-bottom: 12.06rem;
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin: 1.94rem 0 0.94rem 0;
  }
  .hash {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  }
}
</style>
