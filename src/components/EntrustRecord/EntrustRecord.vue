<template>
  <div class="EntrustRecord">
    <div class="content-left">
      <div class="commonTable">
        <div class="cannel-div">
          <button class="common-button button-width"
                  @click="cannel">{{$t('cancel.cancelAssociate')}}</button>
        </div>
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column type="index"
                           label="$t('cancelEntrust.index')"
                           width="200">
          </el-table-column>
          <el-table-column label="$t('cancelEntrust.authorization')"
                           width="300"
                           prop="EntrustAddres">
          </el-table-column>
          <el-table-column prop="setUp"
                           label="$t('cancelEntrust.setUp')"
                           >
            <template slot-scope="scope">
              <div v-if="scope.row.EnstrustSetType==0">{{scope.row.StartHeight}}————{{scope.row.EndHeight}}</div>
              <div v-if="scope.row.EnstrustSetType==1">{{scope.row.StartTime | dateFormat('MM.DD.YYYY HH:mm')}} ———— {{scope.row.EndTime | dateFormat('MM.DD.YYYY HH:mm')}}</div>
              <div v-if="scope.row.EnstrustSetType==2">{{scope.row.EntrustCount + $t('associate.times')}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="$t('cancelEntrust.useRecord')">
            <template slot-scope="scope">
              <div class="font-color hash"><button @click="search(scope.$index)">{{$t('cancelEntrust.query')}}</button></div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>

  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TradingFuns from '@/assets/js/TradingFuns'

export default {
  name: 'EntrustRecord',
  data () {
    return {
      address: '',
      tableData: [],
      multipleSelection: [],
      tradingObj: {
        to: '',
        IsEntrustTx: '',
        gasLimit: 210000,
        gasPrice: 18000000000,
        data: '',
        nonce: '',
        extra_to: [[6, 0, []]],
        value: 0
      }
    }
  },
  mounted () {
    this.address = this.$store.getters.wallet.address
    this.tradingObj.to = this.address
    let array = this.httpProvider.man.getEntrustList(this.address)
    for (let i = 0, length = array.length; i < length; i++) {
      let item = array[i]
      if (item.IsEntrustSign) {
        item.id = i
        if (item.EnstrustSetType === 1) {
          item.StartTime = new Date(item.StartTime * 1000)
          item.EndTime = new Date(item.EndTime * 1000)
        }
        this.tableData.push(item)
      }
    }
  },
  methods: {
    search (index) {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cannel () {
      try {
        if (this.multipleSelection.length === 0) {
          this.$message.error(this.$t('errorMsgs.cancelError'))
          return
        }
        this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(this.address)
        this.tradingObj.nonce = WalletUtil.numToHex(this.tradingObj.nonce)
        let dataArray = []
        this.multipleSelection.forEach(item => {
          dataArray.push(item.id)
        })
        this.tradingObj.data = JSON.stringify(dataArray)
        let jsonObj = TradingFuns.getTxData(this.tradingObj)
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        let newTxData = SendTransfer.getTxParams(serializedTx)
        this.httpProvider.man.sendRawTransaction(newTxData)
        this.$message.success(this.$t('cancel.hint'))
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style scoped lang="less">
.EntrustRecord {
  padding: 1.5rem 0 2.5rem;
  .content-left {
    text-align: left;
  }
  .hash {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  }
  .cannel-div {
    display: flex;
    justify-content: flex-end;
  }
  .button-width {
    width: 10rem;
    margin-bottom: 1.5rem;
  }
}
</style>
