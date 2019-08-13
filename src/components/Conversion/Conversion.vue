<template>
  <div class="conversion">
    <el-card class="card-width">
      <div class="conversion-table">
        <div class="lable-width">
          <label>{{$t('conversion.moreCoinChange')}}:</label>
        </div>
        <el-input v-model="changeAddress"
                  :placeholder="$t('conversion.manAddress')"
                  class="input1">
        </el-input>
        <el-input v-model="changeName"
                  :placeholder="$t('conversion.currencyName')"
                  class="input2">
        </el-input>
        <button class="common-button button-width"
                @click="change()">{{$t('conversion.change')}}</button>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.addressChange')}}:</label>
        </div>
        <el-input readonly
                  v-model="changeResult"
                  class="input3">
        </el-input>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.moreCoinAddress')}}:</label>
        </div>
        <el-input :placeholder="$t('conversion.pleaseEnter')"
                  v-model="content.moreCoinAddress"
                  class="input3">
        </el-input>
        <button class="common-button button-width"
                @click="conversion('more')">{{$t('conversion.change')}}</button>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.manAddress')}}:</label>
        </div>
        <el-input :placeholder="$t('conversion.pleaseEnter')"
                  v-model="content.manAddress"
                  class="input3">
        </el-input>
        <button class="common-button button-width"
                @click="conversion('man')">{{$t('conversion.change')}}</button>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.ethaddress')}}:</label>
        </div>
        <el-input :placeholder="$t('conversion.pleaseEnter')"
                  v-model="content.ethAddress"
                  class="input3">
        </el-input>
        <button class="common-button button-width"
                @click="conversion('eth')">{{$t('conversion.change')}}</button>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.text')}}:</label>
        </div>
        <el-input :placeholder="$t('conversion.pleaseEnter')"
                  v-model="content.text"
                  class="input3">
        </el-input>
        <button class="common-button button-width"
                @click="conversion('text')">{{$t('conversion.change')}}</button>
      </div>
      <div class="conversion-table conversion-table-dis">
        <div class="lable-width">
          <label>{{$t('conversion.hex')}}:</label>
        </div>
        <el-input :placeholder="$t('conversion.pleaseEnter')"
                  v-model="content.hex"
                  class="input3">
        </el-input>
        <button class="common-button button-width"
                @click="conversion('hex')">{{$t('conversion.change')}}</button>
      </div>
    </el-card>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'conversion',
  data () {
    return {
      changeAddress: '',
      changeName: '',
      changeResult: '',
      content: {
        manAddress: '',
        ethAddress: '',
        text: '',
        hex: '',
        moreCoinAddress: ''
      }
    }
  },
  methods: {
    change () {
      this.changeAddress = this.changeAddress.trim()
      this.changeName = this.changeName.trim()
      if (/^[A-Z]{2,8}\.[0-9a-zA-Z]{17,36}$/.test(this.changeAddress) && this.changeAddress.split('.')[0] === 'MAN') {
        if (/^[A-Z]{2,8}$/.test(this.changeName)) {
          this.changeResult = WalletUtil.getCurrencyAddress(this.changeAddress, this.changeName)
        } else {
          this.$message.error(this.$t('errorMsgs.invalidCoinName'))
        }
      } else {
        this.$message.error(this.$t('errorMsgs.invalidManAddress'))
      }
    },
    conversion (type) {
      this.content.manAddress = this.content.manAddress.trim()
      this.content.ethAddress = this.content.ethAddress.trim()
      this.content.text = this.content.text.trim()
      this.content.hex = this.content.hex.trim()
      this.content.moreCoinAddress = this.content.moreCoinAddress.trim()
      if (type === 'man') {
        if ((/^[A-Z]{2,8}\.[0-9a-zA-Z]{17,36}$/.test(this.content.manAddress))) {
          this.content.ethAddress = WalletUtil.getAddress(this.content.manAddress)
        } else {
          this.$message.error(this.$t('errorMsgs.invalidManAddress'))
        }
      } else if (type === 'eth') {
        if ((/^(0x)?[0-9a-fA-F]{40}$/i.test(this.content.ethAddress))) {
          let ethAddress = this.content.ethAddress
          if (this.content.ethAddress.substring(0, 2) === '0x') {
            ethAddress = this.content.ethAddress.substring(2, this.content.ethAddress.length)
          }
          this.content.manAddress = WalletUtil.getManAddress(ethAddress)
        } else {
          this.$message.error(this.$t('errorMsgs.invalidETH'))
        }
      } else if (type === 'text') {
        if (this.content.text !== '') {
          this.content.hex = '0x' + WalletUtil.str2hex(this.content.text)
        } else {
          this.$message.error(this.$t('errorMsgs.invalidText'))
        }
      } else if (type === 'hex') {
        if (this.content.hex !== '' && this.content.hex.substring(0, 2) === '0x') {
          this.content.text = WalletUtil.hex2str(this.content.hex.substring(2, this.content.hex.length))
        } else {
          this.$message.error(this.$t('errorMsgs.invalidHex'))
        }
      } else if (type === 'more') {
        if (/^[A-Z]{2,8}\.[0-9a-zA-Z]{17,29}$/.test(this.content.moreCoinAddress)) {
          this.content.manAddress = WalletUtil.getCurrencyAddress(this.content.moreCoinAddress, 'man')
        } else {
          this.$message.error(this.$t('errorMsgs.invalidHex'))
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.conversion {
  .card-width{
    margin: auto;
  }
  /deep/.el-card__body {
    padding: 2rem 70px 2.5rem;
    text-align: left;
  }
  .contain-left {
    text-align: left;
  }
  .conversion-table {
    display: flex;
    .lable-width {
      width: 150px;
    }
    label {
      line-height: 2rem;
    }
    .input1 {
      width: 400px;
      margin-right: 0.5rem;
    }
    .input2 {
      width: 200px;
      margin-right: 0.5rem;
    }
    .input3 {
      width: 604px;
      margin-right: 1rem;
    }
    .button-width {
      width: 134px;
    }
  }
  .conversion-table-dis {
    margin-top: 1rem;
  }
}
</style>
