<template>
  <div class="CampaignNode">
    <div class="addForm">
      <div>
        <div class="first-left">
        </div>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <h1>{{$t('CampaignNode.mortgage')}}</h1>
        <div class="flex-style">
          <div>
            <el-checkbox v-model="isEdit"></el-checkbox><span class="check-font">{{$t('CampaignNode.onlyChange')}}</span>
          </div>
        </div>
        <div v-if="!isEdit">
          <h5>{{$t('CampaignNode.mortgage')}}</h5>
          <div>
            <el-select v-model="mortgageWay"
                       :placeholder="$t('CampaignNode.selectMortgageWay')">
              <el-option v-for="item in mortgageWayList"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div v-show="mortgageWay==='regular'">
            <el-select v-model="timeLimit"
                       :placeholder="$t('CampaignNode.selectTimeLimit')">
              <el-option v-for="item in timeLimitList"
                         :key="item.key"
                         :label="item.name"
                         :value="item.key">
              </el-option>
            </el-select>
          </div>
          <el-input v-model="value"
                    type="number"
                    :placeholder="$t('CampaignNode.mortgage_man')"></el-input>
        </div>
      </div>
      <h5>{{$t('CampaignNode.Mining_type')}}</h5>
      <el-select v-model="mortgageType"
                 :placeholder="$t('CampaignNode.select')">
        <el-option v-for="item in mortgageList"
                   :key="item.key"
                   :label="item.name"
                   :value="item.key">
        </el-option>
      </el-select>
      <h5>{{$t('CampaignNode.dig_address')}}</h5>
      <el-input v-model="mortgageAddrress"></el-input>
      <div v-if="!isEdit"
           style="display: flex; justify-content: center;">
        <div style="text-align:left">
          <p>{{$t('CampaignNode.mortgage_hint2')}}</p>
          <p>{{$t('digAccount.tips1')}}</p>
          <p>{{$t('digAccount.tips2')}}</p>
          <p>{{$t('digAccount.tips3')}}</p>
          <p>{{$t('digAccount.tips4')}}</p>
          <p>{{$t('digAccount.tips5')}}</p>
          <!--<h4 class="h4-botDis"
            v-html="$t('CampaignNode.mortgage_hint2')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips1')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips2')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips3')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips4')"></h4> -->
        </div>
      </div>
      <hr>
      <button class="common-button"
              @click="getTxData">{{$t('CampaignNode.mortgage-button')}}</button>
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
import { mortgage, contract } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'
import AllDialog from '@/components/TransferDialog/AllDialog'
import GreenDialog from '@/components/TransferDialog/GreenDialog'
import BigNumber from 'bignumber.js'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import transferSuccess from '@/components/TransferDialog/transferSuccess'
import store from 'store'
import filter from '@/assets/js/filters'
import Bus from '@/assets/js/Bus'
export default {
  name: 'campaignNode',
  data () {
    return {
      isEdit: false,
      mortgageTypeAgo: '',
      address: '',
      mortgageList: [{ name: this.$t('CampaignNode.Mining_mortgage'), key: 'minerDeposit' }, { name: this.$t('CampaignNode.Validator_mortgage'), key: 'valiDeposit' }],
      mortgageWayList: [{ name: this.$t('CampaignNode.regular'), key: 'regular' }, { name: this.$t('CampaignNode.current'), key: 'current' }],
      timeLimitList: [{ name: this.$t('CampaignNode.oneMonth'), key: '1' }, { name: this.$t('CampaignNode.threeMonth'), key: '3' }, { name: this.$t('CampaignNode.sixMonth'), key: '6' }, { name: this.$t('CampaignNode.oneYear'), key: '12' }],
      timeLimit: '',
      mortgageWay: '',
      mortgageType: '',
      functions: [],
      value: '',
      mortgageAddrress: '',
      hash: '',
      msg: '',
      visible: false,
      alertable: true,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false,
      isDeposit: false,
      number: 0,
      depositTotal: new BigNumber(0)
    }
  },
  methods: {
    changeSuccess () {
      this.successVisible = false
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
        this.mortgageAddrress = ''
        this.value = ''
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeAlertable () {
      this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
    },
    changeVisible (state) {
      this.visible = state
      this.mortgageAddrress = ''
      this.value = ''
    },
    changeType () {
      if (this.mortgageType === 'minerDeposit') {
        this.mortgageType = 'valiDeposit'
      } else {
        this.mortgageType = 'minerDeposit'
      }
    },
    initContract () {
      this.functions = []
      let tAbi = JSON.parse(mortgage.abi)
      for (var i in tAbi) {
        if (tAbi[i].type === 'function') {
          tAbi[i].inputs.map(function (i) {
            i.value = ''
          })
          this.functions.push(tAbi[i])
        }
      }
    },
    changeDeposit () {
      try {
        this.mortgageAddrress = this.mortgageAddrress.trim()
        if (!WalletUtil.validateManAddress(this.mortgageAddrress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        let abiArray = JSON.parse(mortgage.abi)
        let contractAddress = mortgage.address
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let inputData = ''
        if (this.mortgageTypeAgo === 'valiDeposit') {
          inputData = contract.minerDeposit.getData(WalletUtil.getAddress(this.mortgageAddrress), 0)
        } else {
          inputData = contract.valiDeposit.getData(WalletUtil.getAddress(this.mortgageAddrress), 0)
        }
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: contractAddress,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = inputData
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.visible = true
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
        this.msg = this.$t('mortgageHistory.mortgageSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getTxData () {
      try {
        this.mortgageAddrress = this.mortgageAddrress.trim()
        let value = new BigNumber(this.value)
        let totalVal = value.plus(this.depositTotal)
        if (this.isEdit) {
          this.changeDeposit()
          return
        }
        if (!WalletUtil.validateManAddress(this.mortgageAddrress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        if (this.mortgageType === '') {
          this.$message.error(this.$t('CampaignNode.mortgageTypeError'))
          return
        }
        if (this.value.trim() === '') {
          this.$message.error(this.$t('CampaignNode.valueError'))
          return
        }
        if (value.comparedTo(new BigNumber(10000000)) === 1) {
          this.$message.error('金额过大')
          return
        }
        if (this.mortgageWay === '') {
          this.$message.error(this.$t('CampaignNode.selectMortgageWay'))
          return
        } else if (this.mortgageWay === 'regular') {
          if (this.timeLimit === '') {
            this.$message.error(this.$t('CampaignNode.selectTimeLimit'))
            return
          }
          if (this.isDeposit) {
            if (this.mortgageType === 'minerDeposit') {
              if (totalVal.comparedTo(new BigNumber(10000)) === -1) {
                this.$message.error(this.$t('CampaignNode.leastError') + new BigNumber(10000).minus(this.depositTotal).toString(10) + this.$t('CampaignNode.man'))
                return
              }
            } else {
              if (totalVal.comparedTo(new BigNumber(100000)) === -1) {
                this.$message.error(this.$t('CampaignNode.leastError') + new BigNumber(100000).minus(this.depositTotal).toString(10) + this.$t('CampaignNode.man'))
                return
              }
            }
            if (value.comparedTo(new BigNumber(2000)) === -1) {
              this.$message.error(this.$t('CampaignNode.valueLessError1'))
              return
            }
          } else {
            if (this.mortgageType === 'minerDeposit') {
              if (value.comparedTo(new BigNumber(10000)) === -1) {
                this.$message.error(this.$t('CampaignNode.valueLessError2'))
                return
              }
            } else {
              if (value.comparedTo(new BigNumber(100000)) === -1) {
                this.$message.error(this.$t('CampaignNode.valueLessError3'))
                return
              }
            }
          }
        } else {
          if (this.isDeposit) {
            if (this.mortgageType === 'minerDeposit') {
              if (totalVal.comparedTo(new BigNumber(10000)) === -1) {
                this.$message.error(this.$t('CampaignNode.leastError') + new BigNumber(10000).minus(this.depositTotal).toString(10) + this.$t('CampaignNode.man'))
                return
              }
            } else {
              if (totalVal.comparedTo(new BigNumber(100000)) === -1) {
                this.$message.error(this.$t('CampaignNode.leastError') + new BigNumber(100000).minus(this.depositTotal).toString(10) + this.$t('CampaignNode.man'))
                return
              }
            }
            if (value.comparedTo(new BigNumber(100)) === -1) {
              this.$message.error(this.$t('CampaignNode.currentError'))
              return
            }
          } else {
            if (this.mortgageType === 'minerDeposit') {
              if (value.comparedTo(new BigNumber(10000)) === -1) {
                this.$message.error(this.$t('CampaignNode.valueLessError2'))
                return
              }
            } else {
              if (value.comparedTo(new BigNumber(100000)) === -1) {
                this.$message.error(this.$t('CampaignNode.valueLessError3'))
                return
              }
            }
          }
        }
        let balances = this.httpProvider.man.getBalance(this.address)
        let balance = this.httpProvider.fromWei(balances[0].balance)
        let compareBalance = new BigNumber(balance)
        let campaignValue = new BigNumber(this.value)
        let flag = campaignValue.comparedTo(compareBalance)
        if (flag > 0) {
          this.$message.error(this.$t('CampaignNode.campaignvalueError2'))
          return
        }
        let curFunc
        this.functions.forEach(e => {
          if (e.name.indexOf(this.mortgageType) !== -1) {
            curFunc = e
          }
        })
        let addrTemp = this.mortgageAddrress
        curFunc.inputs[0].value = SendTransfer.sanitizeHex(WalletUtil.addressChange(addrTemp.split('.')[1]))

        if (this.mortgageWay === 'current') {
          curFunc.inputs[1].value = '0x' + new BigNumber(0).toString(16)
        } else {
          curFunc.inputs[1].value = '0x' + new BigNumber(parseInt(this.timeLimit)).toString(16)
        }
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = []
        for (var i in curFunc.inputs) {
          if (curFunc.inputs[i].value) {
            if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) {
              values.push(curFunc.inputs[i].value.split(','))
            } else {
              values.push(curFunc.inputs[i].value)
            }
          } else values.push('')
        }
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: contract,
          value: this.value,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = '0x' + funcSig + WalletUtil.solidityCoder.encodeParams(types, values)
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.visible = true
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
        this.msg = this.$t('mortgageHistory.mortgageSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    backPage () {
      this.$router.back()
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('campaignNode') > -1) {
        this.isDeposit = false
        let depositList = this.httpProvider.man.getDepositByAddr(this.address)
        if (depositList != null) {
          this.isDeposit = true
          this.mortgageAddrress = depositList.AddressA1
          let depositTotal = new BigNumber(0)
          for (let index = 0; index < depositList.Dpstmsg.length; index++) {
            const element = depositList.Dpstmsg[index]
            if (index === 0) {
              depositTotal = depositTotal.plus(filter.weiToNumber(element.DepositAmount))
            } else {
              if (!(element.WithDrawInfolist.length > 0)) {
                depositTotal = depositTotal.plus(filter.weiToNumber(element.DepositAmount))
              }
            }
          }
          this.depositTotal = depositTotal
          if (depositList.Role === '0x10') {
            // if (depositList.Role === 16) {
            this.mortgageTypeAgo = 'minerDeposit'
            this.mortgageType = 'minerDeposit'
            this.depositTotal = depositTotal
            if (depositTotal.comparedTo(new BigNumber(100000)) > -1) {
              // this.checkShow = true
            }
          } else {
            if (depositTotal.comparedTo(new BigNumber(10000)) > -1) {
              // this.checkShow = true
            }
            this.mortgageTypeAgo = 'valiDeposit'
            this.mortgageType = 'valiDeposit'
          }
        }
      }
    }
  },
  mounted () {
    let self = this
    Bus.$on('changeLang', (data) => {
      setTimeout(() => {
        self.mortgageList[0].name = self.$t('CampaignNode.Mining_mortgage')
        self.mortgageList[1].name = self.$t('CampaignNode.Validator_mortgage')
        self.mortgageWayList[0].name = self.$t('CampaignNode.regular')
        self.mortgageWayList[1].name = self.$t('CampaignNode.current')
        self.timeLimitList[0].name = self.$t('CampaignNode.oneMonth')
        self.timeLimitList[1].name = self.$t('CampaignNode.threeMonth')
        self.timeLimitList[2].name = self.$t('CampaignNode.sixMonth')
        self.timeLimitList[3].name = self.$t('CampaignNode.oneYear')
      }, 2000)
    })
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.initContract()
    let depositList = this.httpProvider.man.getDepositByAddr(this.address)
    if (depositList != null) {
      this.isDeposit = true
      this.mortgageAddrress = depositList.AddressA1
      let depositTotal = new BigNumber(0)
      for (let index = 0; index < depositList.Dpstmsg.length; index++) {
        const element = depositList.Dpstmsg[index]
        if (index === 0) {
          depositTotal = depositTotal.plus(filter.weiToNumber(element.DepositAmount))
        } else {
          if (!(element.WithDrawInfolist.length > 0)) {
            depositTotal = depositTotal.plus(filter.weiToNumber(element.DepositAmount))
          }
        }
      }
      this.depositTotal = depositTotal
      if (depositList.Role === '0x10') {
        this.mortgageTypeAgo = 'minerDeposit'
        this.mortgageType = 'minerDeposit'
        this.depositTotal = depositTotal
        if (depositTotal.comparedTo(new BigNumber(100000)) > -1) {
          // this.checkShow = true
        }
      } else {
        if (depositTotal.comparedTo(new BigNumber(10000)) > -1) {
          // this.checkShow = true
        }
        this.mortgageTypeAgo = 'valiDeposit'
        this.mortgageType = 'valiDeposit'
      }
    }
  },
  components: {
    AllDialog,
    GreenDialog,
    OfflineDialog,
    sendSign,
    transferSuccess
  }
}
</script>
<style scoped lang="less">
.CampaignNode {
  .first-left {
    text-align: left;
  }
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    cursor: pointer;
  }
  text-align: center;
  padding-bottom: 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
    margin-bottom: 2rem;
  }
  p {
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    font-weight: 400;
    margin-bottom: 0;
  }
  .h1-dis {
    margin: 2rem 0 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 260px;
    margin-bottom: 1rem;
  }
  .h4-delDis {
    margin-bottom: 0;
    margin-left: 129px;
  }
  .h4-botDis {
    margin-bottom: 0;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .flex-style {
    margin: 1.5rem 0;
    display: flex;
    padding-left: 260px;
    .title {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      margin-right: 5rem;
    }
    /deep/.el-checkbox {
      margin-right: 0.5rem;
    }
    .check-font {
      font-size: 0.875rem;
    }
  }
  .back-tittle {
    position: relative;
    left: 446px;
    top: -21px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
