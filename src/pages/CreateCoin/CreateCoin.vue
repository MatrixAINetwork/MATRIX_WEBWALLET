<template>
  <div class="createCoin align-center">
    <div class="title">{{$t('createCoin.tittle')}}</div>
    <div class="form">
      <h5>{{$t('createCoin.currencyName')}}</h5>
      <el-input v-model="createObj.currencyName">
      </el-input>
      <div v-for="(item,index) in createObj.addAddress"
           :key="index">
        <div class="hint-error"
             @click="delCreate(index)"
             v-if="index>0">{{$t('createCoin.delCreate')}}</div>
        <h5>{{$t('createCoin.address')}}</h5>
        <el-input v-model="item.createAddress">
        </el-input>
        <h5>{{$t('createCoin.value')}}</h5>
        <el-input v-model="item.createValue"
                  type="number">
        </el-input>
      </div>
      <div class="addButton"
           @click="addAddress">{{$t('createCoin.addButton')}}</div>
    </div>

    <button class="common-button"
            @click="signTransfer">{{$t('createCoin.confirm')}}</button>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TradingFuns from '@/assets/js/TradingFuns'
import ManUtils from '@/assets/js/ManUtils'

export default {
  name: 'createCoin',
  data () {
    return {
      needMan: 100000,
      address: '',
      createObj: {
        value: 100000,
        to: 'MAN.3GJF5vPbrmbUG7ZTFyFogdiuXY3Lp',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[9, 0, []]],
        data: '',
        nonce: '',
        currencyName: '',
        addAddress: [{
          createAddress: '',
          createValue: ''
        }]
      },
      newTxData: ''
    }
  },
  methods: {
    signTransfer () {
      if (WalletUtil.validateManAddress(this.createObj.createAddress)) {
        this.$message.error(this.$t('transfer.addressTip'))
        return false
      }
      if (!/^[A-Z]{2,8}$/.test(this.createObj.currencyName)) {
        this.$message.error(this.$t('errorMsgs.coinName'))
        return
      }
      if (this.createObj.currencyName.indexOf('MAN') > -1) {
        this.$message.error('errorMsgs.coinName2')
        return
      }
      try {
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        this.createObj.nonce = WalletUtil.numToHex(nonce)
        let tempData = {}
        for (let i = 0, length = this.createObj.addAddress.length; i < length; i++) {
          if (this.createObj.addAddress[i].createValue !== '' && this.createObj.addAddress[i].createAddress !== '') {
            if (!/^[A-Z]{2,8}\.[0-9a-zA-Z]{18,29}$/.test(this.createObj.addAddress[i].createAddress)) {
              this.$message.error(this.$t('createCoin.addressError'))
              return
            }
            if (this.createObj.addAddress[i].createAddress.split('.')[0] !== this.createObj.currencyName) {
              this.$message.error(this.$t('createCoin.nameError'))
              return
            }
            if (this.createObj.addAddress[i].createValue <= 0) {
              this.$message.error(this.$t('createCoin.valueError'))
              return
            }
            tempData[this.createObj.addAddress[i].createAddress] = SendTransfer.sanitizeHex(WalletUtil.decimalToHex(Number(ManUtils.toWei(Number(this.createObj.addAddress[i].createValue)))))
          }
        }
        let jsonObj = TradingFuns.getTxData(this.createObj)
        jsonObj.data = SendTransfer.sanitizeHex(WalletUtil.str2hex(JSON.stringify({
          CoinName: this.createObj.currencyName,
          AddrAmount: tempData
        })))
        if (this.$store.state.wallet != null) {
          if (this.$store.state.wallet.privateKey) {
            let tx = WalletUtil.createTx(jsonObj)
            let privateKey = this.$store.state.wallet.privateKey
            privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
            tx.sign(privateKey)
            let serializedTx = tx.serialize()
            this.newTxData = SendTransfer.getTxParams(serializedTx)
            this.$router.push({ name: 'CreateCoinSecond', params: { newTxData: this.newTxData } })
          } else {
            this.jsonObj = JSON.stringify(jsonObj)
            this.$router.push({ name: 'CreateCoinSecond', params: { newTxData: this.jsonObj } })
          }
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.$router.push({ name: 'CreateCoinSecond', params: { newTxData: this.jsonObj } })
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    addAddress () {
      this.createObj.addAddress.push({
        createAddress: '',
        createValue: ''
      })
    },
    delCreate (index) {
      this.createObj.addAddress.splice(index, 1)
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  }
}
</script>

<style scoped lang="less">
.createCoin {
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin-top: 2.06rem;
  }
  .form {
    width: 26.5rem;
    text-align: left;
    .input-title {
      font-size: 0.88rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      margin: 24px 0 16px 0;
    }
  }
  .common-button {
    margin: 32px 0 48px 0;
  }
  .addButton {
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    cursor: pointer;
    margin: 1rem 0 2rem;
    text-align: center;
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
