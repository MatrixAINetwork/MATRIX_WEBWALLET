<template>
  <div class="online-transfer-form align-center">
    <el-form :rules="rules"
             ref="ruleForm"
             :model="ruleForm"
             class="demo-ruleForm">
      <div class="form-item">
        <div class="input-name"
             style="margin-top: 4px;">{{$t('transfer.Beneficiary')}}：</div>
        <div class="common-input">
          <el-form-item prop="to">
            <el-input :placeholder="$t('transfer.enterRecipient')"
                      v-model="ruleForm.to"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="form-item">
        <div class="input-name">{{$t('transfer.transferAmount')}}：</div>
        <div class="input-money">
          <div class="common-input">
            <el-form-item prop="value">
              <el-input :placeholder="$t('transfer.enter') + ruleForm.token.toLocaleUpperCase() + $t('transfer.amount')"
                        v-model="ruleForm.value"
                        class="input-with-select"
                        type="number">
                <el-select v-model="ruleForm.token"
                           slot="append">
                  <el-option label="MAN"
                             value="MAN"
                             @click.native="getTokenOrMoreBalance('')"></el-option>
                  <el-option v-for="(item, index) in matrixCoin"
                             :key="index"
                             :label="item.name"
                             :value="item.name"
                             @click.native="getTokenOrMoreBalance(item)"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="balance-height">
            <span class="balance-font font-dis">{{$t('myWallet.balance')}}：{{balance | weiToNumber}}({{ruleForm.token.toLocaleUpperCase()}})</span>
            <a class="sendBalance-font font-dis"
               @click="sendAll"
               v-show="ruleForm.addressList.length === 0">{{$t('transfer.allAsset')}}</a>
          </div>
        </div>
      </div>
      <hr style="border:0.5px #d5d7de dashed">

      <div v-if="ruleForm.addressList.length > 0"
           v-for="(item,index) in ruleForm.addressList"
           :key="index">
        <div class="form-item">
          <div class="input-name"
               style="margin-top: 4px;">{{$t('transfer.Beneficiary')}}：</div>
          <div class="common-input">
            <el-form-item prop="to">
              <el-input :placeholder="$t('transfer.enterRecipient')"
                        v-model="item.to"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="form-item">
          <div class="hint-error"
               @click="delrecords(index)">{{$t('transfer.deleteAddress')}}</div>
          <div class="input-name">{{$t('transfer.transferAmount')}}：</div>
          <div class="input-money">
            <div class="common-input">
              <el-form-item prop="amount">
                <el-input :placeholder="$t('transfer.enter') + ' ' + ruleForm.token.toLocaleUpperCase() + ' ' + $t('transfer.amount')"
                          v-model="item.value"
                          type="number">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <hr style="border:0.5px #d5d7de dashed">
      </div>

      <div class="add-receipt"
           @click="addAccount()"
           v-if="coinType!='token'">
        <i class="el-icon-plus"></i>
        {{$t('transfer.addAddress')}}
      </div>
      <div class="form-item">
        <div class="two-input">
          <div>
            <div class="input-name">{{$t('transfer.estimatedGas')}}：
              <a class="sendBalance-font font-dis"
                 @click="estimate">{{$t('transfer.estimate')}}</a>
            </div>
            <div class="common-input">
              <el-input v-model="ruleForm.gas"></el-input>
            </div>
          </div>
          <div>
            <div class="input-name">{{$t('transfer.gasMethod')}}：</div>
            <div class="common-input">
              <el-select v-model="ruleForm.IsEntrustTx">
                <el-option :label="$t('transfer.selfPay')"
                           :value="''"></el-option>
                <el-option :label="$t('transfer.otherPay')"
                           :value="1"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="input-name">{{$t('transfer.transferMethod')}}：</div>
        <div class="common-input">
          <el-radio v-model="ruleForm.ExtraTimeTxType"
                    label="0">{{$t('transfer.realTime')}}</el-radio>
          <el-radio v-model="ruleForm.ExtraTimeTxType"
                    label="3">{{$t('transfer.scheduled')}}</el-radio>
        </div>
        <div class="block"
             v-if="ruleForm.ExtraTimeTxType==3">
          <el-date-picker v-model="timingTime"
                          type="datetime"
                          :placeholder="$t('transfer.selectTime')">
          </el-date-picker>
        </div>
      </div>
      <div class="form-item">
        <div class="message-type">
          <div :class="{'active': messageType === 'text'}"
               @click="changeMessageType('text')">{{$t('transfer.message')}}</div>
          <div :class="{'active': messageType === 'richText'}"
               @click="changeMessageType('richText')">{{$t('transfer.advancedMessage')}}</div>
          <div :class="{'active': messageType === 'distributedStorage'}"
               @click="changeMessageType('distributedStorage')">{{$t('transfer.ipfs')}}</div>
        </div>
        <el-input type="textarea"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  v-if="messageType === 'text'"
                  v-model="ruleForm.data"></el-input>
        <rich-text v-if="messageType === 'richText'"
                   @editData="editData"></rich-text>
        <distributed-storage @inputData="inputData"
                             v-if="messageType === 'distributedStorage'"></distributed-storage>
      </div>
    </el-form>
    <div class="step-button">
      <button class="common-button"
              @click="generateTx">{{$t('transfer.confirm')}}</button>
    </div>
    <transfer-dialog :transferDialogVisible="transferDialogVisible"
                     :width="'800px'"
                     :status="$t('transfer.success')"
                     :msg="$t('transfer.transferComplete')"
                     :amount="ruleForm.value"
                     :from="address"
                     :to="ruleForm.to"
                     :addressList="ruleForm.addressList"
                     :hash="hash"
                     :sendCoin="sendCoin"
                     @transferDialogVisible="changeTransferDialogVisible"></transfer-dialog>
    <confirm-transfer-dialog :confirmVisible="confirmTransfer"
                             :width="'800px'"
                             :status="$t('transfer.success')"
                             :msg="$t('transfer.confirmTransfer')"
                             :amount="ruleForm.value"
                             :from="address"
                             :to="ruleForm.to"
                             @confirmVisible="changeDialogVisible"
                             :addressList="ruleForm.addressList"
                             :sendCoin="sendCoin"
                             @confirmSend="confirmSend"></confirm-transfer-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
    <transfer-success :successVisible="successVisible"
                      :width="'800px'"
                      :status="$t('transfer.success')"
                      :msg="$t('transfer.transferComplete')"
                      :amount="ruleForm.value"
                      :from="address"
                      :to="ruleForm.to"
                      :addressList="ruleForm.addressList"
                      :hash="hash"
                      :sendCoin="sendCoin"
                      @changeSuccess="changeSuccess">
    </transfer-success>
  </div>
</template>
<script>
import RichText from '@/components/RichText/RichText'
import DistributedStorage from '@/components/DistributedStorage/DistributedStorage'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TransferDialog from '@/components/TransferDialog/TransferDialog'
import confirmTransferDialog from '@/components/TransferDialog/confirmTransferDialog'
import Token from '@/assets/js/Token'
import BigNumber from 'bignumber.js'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import transferSuccess from '@/components/TransferDialog/transferSuccess'
import store from 'store'
export default {
  name: 'OfflineTransferForm',
  data () {
    return {
      address: '',
      messageType: 'text',
      ruleForm: {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      },
      timingTime: '',
      rules: {
        value: [
          { required: true, message: this.$t('transfer.amountTip'), trigger: 'change' }
        ],
        to: [
          { validator: this.validAddress, trigger: 'change' }
        ]
      },
      balance: 0,
      matrixCoin: [],
      transferDialogVisible: false,
      confirmTransfer: false,
      newTxData: {},
      coinType: '',
      sendTokenObj: {},
      tokenObj: {},
      manBalance: 0,
      hash: '',
      moreType: '',
      sendCoin: 'MAN',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false
    }
  },
  mounted () {
    this.balance = this.$route.params.balance
    this.manBalance = this.balance
    this.ruleForm.token = this.$route.params.currency
    if (this.ruleForm.token !== 'MAN') {
      this.coinType = 'more'
      this.moreType = this.ruleForm.token
      this.sendCoin = this.ruleForm.token
    }
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    this.getToken()
  },
  methods: {
    changeSuccess () {
      this.successVisible = false
      this.ruleForm = {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      }
      this.ruleForm.token = 'MAN'
      this.coinType = ''
      this.moreType = ''
      this.sendCoin = 'MAN'
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.successVisible = true
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    getMatrixCoin () { // 获取链的多币种
      try {
        let matrixCoin = this.httpProvider.man.getMatrixCoin('latest')
        if (matrixCoin != null) {
          let matrixCoinArray = []
          matrixCoin.forEach(e => {
            matrixCoinArray.push({
              name: e,
              type: 'more'
            })
          })
          this.matrixCoin = matrixCoin
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getToken () { // 获本地token代币
      let tokenArray = store.get('token')
      if (typeof (tokenArray) === 'string') {
        tokenArray = JSON.parse(tokenArray)
      }
      if (tokenArray != null) {
        // tokenArray = JSON.parse(tokenArray)
        tokenArray.forEach(e => {
          this.matrixCoin.push({
            name: e.tokenName,
            type: 'token',
            tokenContract: e.tokenContract,
            tokenName: e.tokenName,
            digits: e.digits
          })
        })
      }
      let matrixCoins = this.httpProvider.man.getMatrixCoin('latest')
      if (matrixCoins != null && JSON.stringify(matrixCoins) !== '[]') {
        matrixCoins.forEach(e => {
          this.matrixCoin.push({
            name: e,
            type: 'more'
          })
        })
      }
    },
    getTokenOrMoreBalance (item) {
      try {
        if (item.type === 'token') {
          let currency = item.tokenContract.split('.')[0]
          let tokenObj = new Token(WalletUtil.getAddress(item.tokenContract), WalletUtil.getAddress(this.address), item.tokenName, item.digits, currency)
          this.tokenObj = tokenObj
          let sendTokenBalance = tokenObj.setBalance()
          sendTokenBalance.currency = currency
          let result = this.httpProvider.man.call(sendTokenBalance)
          this.coinType = 'token'
          this.sendTokenObj = item
          if (result === '0x') {
            this.balance = 0
          } else {
            this.balance = result
          }
          this.ruleForm.addressList = []
          this.sendCoin = item.name
        } else {
          if (item !== '') {
            let address = WalletUtil.getCurrencyAddress(this.address, item.name)
            this.balance = this.httpProvider.man.getBalance(address)[0].balance
            this.coinType = 'more'
            this.moreType = item.name
            this.sendCoin = item.name
          } else {
            this.coinType = ''
            this.balance = this.httpProvider.man.getBalance(this.address)[0].balance
            this.sendCoin = 'MAN'
          }
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    changeMessageType (status) {
      if (this.messageType !== status) {
        this.messageType = status
      }
    },
    changeDialogVisible (val) {
      this.confirmTransfer = val
    },
    changeTransferDialogVisible (val) {
      this.transferDialogVisible = val
      this.ruleForm = {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      }
      this.ruleForm.token = 'MAN'
      this.coinType = ''
      this.moreType = ''
      this.sendCoin = 'MAN'
    },
    queryRecordOrBalance (type) {
      this.balanceShow = type
    },
    generateTx () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          try {
            this.ruleForm.to = this.ruleForm.to.trim()
            if (this.coinType === 'more') {
              let address = WalletUtil.getCurrencyAddress(this.address, this.moreType)
              this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(address)
              this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            } else {
              this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(this.address)
              this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            }
            if (new BigNumber(this.ruleForm.gas).comparedTo(this.httpProvider.fromWei(210000 * 18000000000)) === 1) {
              let gasNumber = new BigNumber(this.httpProvider.toWei(this.ruleForm.gas))
              this.ruleForm.gasLimit = parseInt(gasNumber.div(new BigNumber(18000000000)).toString(10)) + 1
            }
            let arr = []
            let extraObj = []
            if (this.ruleForm.value < 0) {
              this.$message.error(this.$t('errorMsgs.valueError'))
              return
            }
            if (this.ruleForm.addressList.length > 0) {
              for (let i = 0; i < this.ruleForm.addressList.length; i++) {
                let arrTemp = []
                let item = this.ruleForm.addressList[i]
                if (this.coinType === 'more' && item.to.split('.')[0] !== this.moreType) {
                  this.$message.error(this.$t('transfer.addressTip'))
                  return false
                }
                item.to = item.to.trim()
                if (!WalletUtil.validateManAddress(item.to)) {
                  this.$message.error(this.$t('transfer.addressTip'))
                  return false
                }
                if (item.to === this.ruleForm.to) {
                  this.$message.error(this.$t('transfer.addressRepetition'))
                  return false
                }
                arr.forEach(e => {
                  if (e.indexOf(item.to) > -1) {
                    this.$message.error(this.$t('transfer.addressRepetition'))
                    return false
                  }
                })
                arrTemp.push(item.to)
                arrTemp.push(item.value)
                arrTemp.push(0)
                arr.push(arrTemp)
              }
              extraObj = [[parseInt(this.ruleForm.ExtraTimeTxType), 0, arr]]
            }
            if (arr.length > 0) {
              this.ruleForm.extra_to = extraObj
            } else {
              this.ruleForm.extra_to = [[parseInt(this.ruleForm.ExtraTimeTxType), 0, []]]
            }
            if (this.coinType === 'more' && this.ruleForm.to.split('.')[0] !== this.moreType) {
              this.$message.error(this.$t('transfer.addressTip'))
              return false
            }
            let jsonObj = TradingFuns.getTxData(this.ruleForm)
            if (this.ruleForm.ExtraTimeTxType === '3') {
              if (this.timingTime !== '' && new Date(this.timingTime).getTime() > new Date().getTime()) {
                jsonObj.CommitTime = parseInt(new Date(this.timingTime).getTime() / 1000)
              } else {
                this.$message.error(this.$t('errorMsgs.timingError'))
                return
              }
            }
            if (this.messageType === 'distributedStorage') {
              let dataStr = WalletUtil.str2hex(this.ruleForm.data)
              let crcNum = WalletUtil.crc32(this.ruleForm.data)
              let crcHex = (crcNum < 0 ? -crcNum : crcNum).toString(16)
              let data = '0x6d61747269780000' + dataStr + crcHex
              this.ruleForm.data = data
            }
            // 发送token代币
            if (this.coinType === 'token') {
              jsonObj.data = this.tokenObj.getData(WalletUtil.getAddress(jsonObj.to), this.ruleForm.value).data
              jsonObj.to = this.sendTokenObj.tokenContract
              jsonObj.value = '0x0'
            }
            if (this.$store.state.wallet != null) {
              if (this.$store.state.wallet.privateKey) {
                let tx = WalletUtil.createTx(jsonObj)
                let privateKey = this.$store.state.wallet.privateKey
                privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
                tx.sign(privateKey)
                let serializedTx = tx.serialize()
                this.newTxData = SendTransfer.getTxParams(serializedTx)
                this.confirmTransfer = true
              } else {
                this.confirmOffline = true
                this.jsonObj = JSON.stringify(jsonObj)
              }
            } else {
              this.confirmOffline = true
              this.jsonObj = JSON.stringify(jsonObj)
            }
          } catch (e) {
            this.$message.error(e.message)
          }
        } else {
          return false
        }
      })
    },
    addAccount () {
      this.ruleForm.addressList.push({
        value: '',
        to: ''
      })
    },
    delrecords (index) {
      this.ruleForm.addressList.splice(index, 1)
    },
    editData (data) {
      this.ruleForm.data = data
    },
    confirmSend (state) {
      try {
        if (state === 'ok') {
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
          // store.set(this.address, recordArray)
          this.transferDialogVisible = true
          this.hash = hash
          this.confirmTransfer = false
        } else {
          this.confirmTransfer = false
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    validAddress (rule, address, callback) {
      if (!WalletUtil.validateAddress(address.trim())) {
        callback(new Error(window.i18n.t('transfer.addressTip')))
      } else if (this.coinType === 'more' && address.split('.')[0] !== this.moreType) {
        callback(new Error(window.i18n.t('transfer.addressTip')))
      } else {
        callback()
      }
    },
    inputData (data) {
      this.ruleForm.data = JSON.stringify(data)
    },
    estimate (val) { // 预估gas
      try {
        this.ruleForm.to = this.ruleForm.to.trim()
        let to = this.ruleForm.to
        if (val === '0') {
          this.ruleForm.value = 0
          this.ruleForm.to = this.address
        }
        if (this.ruleForm.value >= 0 && WalletUtil.validateManAddress(this.ruleForm.to)) {
          let sendObj = TradingFuns.getTxData(this.ruleForm)
          let arr = []
          // let extraObj = []
          let gasObj = []
          if (this.ruleForm.addressList.length > 0) {
            for (let i = 0; i < this.ruleForm.addressList.length; i++) {
              let arrTemp = []
              let item = this.ruleForm.addressList[i]
              item.to = item.to.trim()
              if (this.coinType === 'more' && item.to.split('.')[0] !== this.moreType) {
                this.$message.error(this.$t('transfer.addressTip'))
                return
              }
              if (!WalletUtil.validateManAddress(item.to)) {
                this.$message.error(this.$t('transfer.addressTip'))
                return
              }
              if (item.to === this.ruleForm.to) {
                this.$message.error(this.$t('transfer.addressRepetition'))
                return
              }
              arr.forEach(e => {
                if (e.indexOf(item.to) > -1) {
                  // this.$message.error(this.$t('transfer.addressRepetition'))
                  throw new Error(this.$t('transfer.addressRepetition'))
                }
              })
              arrTemp.push(item.to)
              arrTemp.push(item.value)
              arrTemp.push(0)
              arr.push(arrTemp)
              gasObj.push({
                to: item.to,
                value: '0x' + WalletUtil.toWeiHex(item.value),
                input: (this.ruleForm.data !== '' || this.ruleForm.data !== null) ? ('0x' + WalletUtil.str2hex(this.ruleForm.data)) : '0x'
              })
            }
            // extraObj = [[parseInt(this.ruleForm.ExtraTimeTxType), 0, gasObj]]
          }
          // this.ruleForm.extra_to = extraObj
          // let jsonObj = TradingFuns.getTxData(this.ruleForm)
          let estObj = {
            from: this.address,
            to: sendObj.to,
            gasLimit: sendObj.gasLimit,
            gasPrice: sendObj.gasPrice,
            value: sendObj.value,
            data: sendObj.data,
            currency: this.ruleForm.to.split('.')[0],
            extra_to: gasObj
          }
          let result = this.httpProvider.man.estimateGas(estObj)
          // this.ruleForm.gas = this.httpProvider.fromWei(Number(result), 'gwei')
          let getGas = new BigNumber(result) * new BigNumber(this.ruleForm.gasPrice)
          this.ruleForm.gasLimit = result
          this.ruleForm.gas = this.httpProvider.fromWei(getGas)
        } else {
          this.$message.warning(this.$t('transfer.warningGas'))
        }
        if (val === '0') {
          this.ruleForm.to = to
        }
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    sendAll () { // 发送余额
      if (this.balance === 0) {
        this.ruleForm.value = '0'
      } else {
        this.estimate('0')
        let balance = new BigNumber(this.httpProvider.fromWei(this.balance))
        this.ruleForm.value = balance.minus(new BigNumber(this.ruleForm.gas)).toString()
      }
    }
  },
  components: {
    RichText,
    DistributedStorage,
    TransferDialog,
    confirmTransferDialog,
    OfflineDialog,
    sendSign,
    transferSuccess
  }
  // watch: {
  //   ruleForm: {
  //     handler: function (val, oldval) {
  //
  //     },
  //     deep: true // 对象内部的属性监听，也叫深度监听
  //   }
  // }
}
</script>

<style scoped lang="less">
.online-transfer-form {
  text-align: left;
  .first_hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .el-form {
    padding-bottom: 2rem;
    border-bottom: 1px #d5d7de solid;
  }
  .input-name {
    font-size: 14px;
    color: #2c365c;
    letter-spacing: 0.13px;
    margin-top: 1.94rem;
    margin-bottom: 1rem;
  }
  .input-money {
    display: flex;
  }
  .common-input {
    width: 26.5rem;
    height: 2.5rem;
  }
  /deep/ .el-select {
    width: 63px;
    .el-input__inner {
      padding-right: 0 !important;
      padding-left: 5px !important;
    }
  }
  hr {
    margin: 31px 0 15px 0;
  }
  .add-receipt {
    text-align: center;
    font-size: 0.88rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    cursor: pointer;
  }
  .two-input {
    /deep/ .el-select {
      width: 100% !important;
    }
  }
  .message-type {
    display: flex;
    margin-bottom: 1.63rem;
    div {
      width: 7.25rem;
      height: 2.25rem;
      line-height: 2.25rem;
      text-align: center;
      background: #f8f8fa;
      border-radius: 1px;
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0;
      cursor: pointer;
    }
    .active {
      color: #1c51dd;
      background: #fff;
    }
  }
  .step-button {
    text-align: center;
    .common-button {
      margin: 2rem 0 3rem 0;
    }
  }
  .balance-font {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
  }
  .sendBalance-font {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    cursor: pointer;
  }
  .balance-height {
    line-height: 60px;
  }
  .font-dis {
    margin-left: 1rem;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    float: right;
    cursor: pointer;
  }
  /deep/.el-select {
    min-width: 114px;
  }
}
/deep/.el-card__body {
  padding: 1.625rem 0 3rem 0;
}
/deep/.el-input__prefix {
  display: none;
}
.block {
  margin: 1rem 0;
}
</style>
