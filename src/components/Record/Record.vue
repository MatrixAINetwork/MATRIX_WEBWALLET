<template>
  <div class="record">
    <div class="content-left">
      <div class="commonTable top-spacing">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column type="index"
                           :label="$t('record.index')"
                           width="150">
          </el-table-column>
          <el-table-column :label="$t('record.time')"
                           width="147">
            <template slot-scope="scope">
              <div>{{scope.row.newTxData.commitTime | dateFormat('MM.DD.YYYY HH:mm')}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('record.transactionType')"
                           width="160">
            <template slot-scope="scope">
              <div class="font-color">{{scope.row.newTxData.txType | txTypeFilter}}</div>
              <!-- <div class="font-color">{{scope.row}}</div> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('record.transactionDetails')">
            <template slot-scope="scope">
              <div class="font-color hash"
                   @click="openBrowser(scope.row.hash)">{{scope.row.hash}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <div class="hint_font top_spacing"
               @click="openBrowser('')">{{$t('record.browser_detailed')}}</div>
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
    </div>
  </div>
</template>
<script>
import { browserUrl } from '@/assets/js/config'
import store from 'store'

export default {
  name: 'record',
  data () {
    return {
      pageNumber: 1,
      pageSize: 10,
      address: '',
      tableData: [],
      total: 0,
      hash: '',
      visible: false,
      localData: []
    }
  },
  mounted () {
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    let data = store.get(this.address)
    if ((typeof (data) === 'string')) {
      data = JSON.parse(data)
    }
    if (data) {
      this.localData = store.get(this.address)
      if ((typeof (this.localData) === 'string')) {
        this.localData = JSON.parse(this.localData)
      }
      if (this.localData != null) {
        this.total = this.localData.length
        this.getTableData()
      }
    }
  },
  methods: {
    currentChange (status) {
      this.pageNumber = status
      this.getTableData()
    },
    getTableData () {
      this.tableData = []
      let arrayLength = 0
      let i = 0
      if (this.localData !== undefined && this.localData.length > 0) {
        if (this.localData.length - this.pageNumber * this.pageSize > 0) {
          arrayLength = this.localData.length - this.pageNumber * this.pageSize - 1
          i = this.localData.length - (this.pageNumber - 1) * this.pageSize - 1
        } else {
          arrayLength = -1
          i = this.localData.length - (this.pageNumber - 1) * this.pageSize - 1
        }
        for (let index = i; index > arrayLength; index--) {
          this.tableData.push(this.localData[index])
        }
      }
    },
    openBrowser (hash) {
      if (hash === '') {
        window.open(browserUrl + '/addr/' + this.address)
      } else {
        window.open(browserUrl + '/tx/' + hash)
      }
    }
  }
}
</script>

<style scoped lang="less">
.record {
  .content-left {
    text-align: left;
  }
  .hash {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  }
  .span-font {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0;
    text-align: right;
    font-weight: bold;
  }
  .span-spacing {
    margin-right: 1rem;
  }
  .select-spacing {
    margin-right: 2.75rem;
  }
  /deep/ .el-button-group > .el-button:not(:last-child) {
    margin-right: -1px;
    width: 102px;
    height: 28px;
    text-align: left;
    padding: 0 0 0 0.5rem;
    background: rgba(44, 54, 92, 0.03);
  }
  /deep/ .el-button-group > .el-button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 32px;
    height: 28px;
    padding: 0;
  }
  /deep/ .el-button:active {
    border: 1px solid #dcdfe6 !important;
    color: #606266 !important;
  }
  /deep/ .el-button:focus,
  /deep/ .el-button:hover {
    border: 1px solid #dcdfe6 !important;
    color: #606266 !important;
  }
  .top-spacing {
    margin-top: 2rem;
  }
  .font-color {
    color: #1c51dd;
    cursor: pointer;
  }
  .content-between {
    display: flex;
    justify-content: space-between;
  }
  .hint_font {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    cursor: pointer;
  }
  .top_spacing {
    margin-top: 1.5rem;
  }
  .amount {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
