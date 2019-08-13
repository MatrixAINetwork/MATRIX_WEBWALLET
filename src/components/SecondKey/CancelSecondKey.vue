<template>
  <div class="CancelSecondKey">
    <div class="content-left">
      <div class="commonTable">
        <div class="cannel-div">
          <button class="common-button button-width"
                  @click="cannel">{{$t('cancel.cancelAssociate1')}}</button>
          <div>
            <span class="back-tittle"
                  @click="backPage">
              <i class="el-icon-arrow-left"></i>
              {{$t('openWallet.back')}}
            </span>
          </div>
        </div>
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column type="index"
                           :label="$t('cancelEntrust.index')"
                           width="150">
          </el-table-column>
          <el-table-column :label="$t('cancelEntrust.authorization')"
                           width="300"
                           prop="EntrustAddres">
          </el-table-column>
          <el-table-column prop="setUp"
                           :label="$t('cancelEntrust.authorizationSetUp')">
            <template slot-scope="scope">
              <div v-if="scope.row.EnstrustSetType==0">{{scope.row.StartHeight}}————{{scope.row.EndHeight}}</div>
              <div v-if="scope.row.EnstrustSetType==1">{{scope.row.StartTime | dateFormat('MM.DD.YYYY HH:mm')}} ———— {{scope.row.EndTime | dateFormat('MM.DD.YYYY HH:mm')}}</div>
              <div v-if="scope.row.EnstrustSetType==2">{{scope.row.EntrustCount + $t('associate.times')}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('cancelEntrust.useRecord')">
            <template slot-scope="scope">
              <div class="font-color hash"><button @click="search(scope.$index)">{{$t('cancelEntrust.query')}}</button></div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TradingFuns from '@/assets/js/TradingFuns'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import store from 'store'

export default {
  name: 'CancelSecondKey',
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
      },
      currency: 'MAN',
      matrixCoins: [],
      msg: '',
      hash: '',
      visible: false,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: ''
    }
  },
  activated () {
    this.tableData = []
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.tradingObj.to = this.address
    let array = this.httpProvider.man.getEntrustList(this.address)
    if (array.length > 0) {
      this.tableData = []
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
    }
    this.matrixCoins = this.httpProvider.man.getMatrixCoin('latest')
  },
  methods: {
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeVisible (state) {
      this.visible = state
    },
    search (index) {
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    cannel () {
      try {
        if (this.multipleSelection.length === 0) {
          this.$message.error(this.$t('errorMsgs.cancelError1'))
          return
        }
        if (JSON.stringify(this.multipleSelection) === '[]') {
          this.$message.error(this.$t('errorMsgs.selectCancelist'))
          return
        }
        let nowAddress = WalletUtil.getCurrencyAddress(this.address, this.currency)
        this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(nowAddress)
        this.tradingObj.nonce = WalletUtil.numToHex(this.tradingObj.nonce)
        let dataArray = []
        this.multipleSelection.forEach(item => {
          dataArray.push(item.id)
        })
        this.tradingObj.to = nowAddress
        this.tradingObj.data = JSON.stringify(dataArray)
        let jsonObj = TradingFuns.getTxData(this.tradingObj)
        if (this.$store.state.wallet != null) {
          jsonObj.currency = this.currency
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          let newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
          this.visible = true
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          // let commitTime = (new Date()).getTime() / 1000
          recordArray.push({ hash: this.hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
        this.msg = this.$t('cancel.cancelAssociate1')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    changeCoin () {
      let nowAddress = WalletUtil.getCurrencyAddress(this.address, this.currency)
      let array = this.httpProvider.man.getEntrustList(nowAddress)
      this.tableData = []
      for (let i = 0, length = array.length; i < length; i++) {
        let item = array[i]
        if (item.IsEntrustGas) {
          item.id = i
          if (item.EnstrustSetType === 1) {
            item.StartTime = new Date(item.StartTime * 1000)
            item.EndTime = new Date(item.EndTime * 1000)
          }
          this.tableData.push(item)
        }
      }
    },
    backPage () {
      this.$router.back()
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>

<style scoped lang="less">
.CancelSecondKey {
  margin-top: 2rem;
  padding: 0 0 2.5rem;
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
    justify-content: space-between;
  }
  .button-width {
    width: 10rem;
    margin-bottom: 1.5rem;
  }
  .back-tittle {
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
