<template>
  <div class="offline-transfer-second align-center">
    <el-form :rules="rules"
             ref="ruleForm"
             :model="ruleForm"
             class="demo-ruleForm">
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
                             @click.native="getTokenOrMoreBalance()"></el-option>
                  <el-option v-for="(item, index) in matrixCoin"
                             :key="index"
                             :label="item.name"
                             :value="item.name"
                             @click.native="getTokenOrMoreBalance(item)"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>
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
      <hr style="border:0.5px #d5d7de dashed">

      <div v-if="ruleForm.addressList.length > 0"
           v-for="(item,index) in ruleForm.addressList"
           :key="index">
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
        <hr style="border:0.5px #d5d7de dashed">
      </div>

      <div class="add-receipt"
           @click="addAccount()">
        <i class="el-icon-plus"></i>
        {{$t('transfer.addAddress')}}
      </div>
      <div class="form-item">
        <div class="two-input">
          <!-- <div>
            <div class="input-name">{{$t('transfer.estimatedGas')}}：</div>
            <div class="common-input">
              <el-input v-model="ruleForm.gas"
                        readonly></el-input>
            </div>
          </div> -->
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
                    label="7">{{$t('transfer.scheduled')}}</el-radio>
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
        <distributed-storage v-if="messageType === 'distributedStorage'"
                             @inputData="inputData"></distributed-storage>
      </div>
    </el-form>
    <div class="step-button">
      <button class="common-button"
              @click="generateTx">{{$t('offline.next')}}</button>
    </div>
  </div>
</template>

<script>
import DistributedStorage from '@/components/DistributedStorage/DistributedStorage'
import RichText from '@/components/RichText/RichText'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import store from 'store'
export default {
  name: 'OfflineTransferSecond',
  data () {
    return {
      messageType: 'text',
      ruleForm: {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: '1MAN',
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [0, 0, []],
        data: '',
        nonce: ''
      },
      matrixCoin: [],
      newTxData: '',
      tokenCoin: [],
      coinType: '',
      sendTokenObj: {},
      tokenObj: {},
      manBalance: 0,
      rules: {
        value: [
          { required: true, message: this.$t('transfer.amountTip'), trigger: 'blur' }
        ],
        to: [
          { validator: this.validAddress, trigger: 'blur' }
        ]
      },
      balance: 0,
      address: '',
      nonce: ''
    }
  },
  mounted () {
    this.balance = this.$route.params.balance
    this.address = this.$route.params.address
    this.nonce = this.$route.params.nonce
    this.getToken()
  },
  methods: {
    editData (data) {
      this.ruleForm.data = data
    },
    inputData (data) {
      this.ruleForm.data = data
    },
    changeMessageType (status) {
      if (this.messageType !== status) {
        this.messageType = status
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
    },
    getTokenOrMoreBalance (item) {
      if (item.type === 'token') {
        this.coinType = 'token'
        this.sendTokenObj = item
      } else {
        this.coinType = 'man'
      }
    },
    validAddress (rule, address, callback) {
      if (!WalletUtil.validateManAddress(address)) {
        callback(new Error(window.i18n.t('transfer.addressTip')))
      } else {
        callback()
      }
    },
    addAccount () {
      this.ruleForm.addressList.push({
        value: '',
        to: ''
      })
    },
    generateTx () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.nonce = WalletUtil.numToHex(this.nonce)
          this.ruleForm.CommitTime = new Date()
          this.ruleForm.from = this.address
          let arr = []
          let extraObj = []
          if (this.ruleForm.addressList.length > 0) {
            for (let i = 0; i < this.ruleForm.addressList.length; i++) {
              let arrTemp = []
              let item = this.ruleForm.addressList[i]
              if (WalletUtil.validateManAddress(item)) {
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
          let jsonObj = TradingFuns.getTxData(this.ruleForm)
          // 发送token代币
          if (this.coinType === 'token') {
            jsonObj.data = this.tokenObj.getData(WalletUtil.getAddress(jsonObj.to), this.ruleForm.value).data
            jsonObj.to = this.sendTokenObj.tokenContract
            jsonObj.value = '0x0'
          }
          this.$router.push({ name: 'OfflineTransferThird', params: { sendJson: jsonObj, ruleForm: this.ruleForm } })
        } else {
          return false
        }
      })
    },
    delrecords (index) {
      this.ruleForm.addressList.splice(index, 1)
    }
  },
  components: {
    RichText,
    DistributedStorage
  }
}
</script>

<style scoped lang="less">
.offline-transfer-second {
  text-align: left;
  padding: 0 3.19rem;
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
  .input-money {
    margin-bottom: 1.5rem;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    float: right;
    cursor: pointer;
  }
}
</style>
