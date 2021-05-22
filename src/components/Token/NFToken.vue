<template>
  <div class="nftoken">
    <h1>{{$t('nftoken.tittle')}}</h1>
    <h5 class="h-dis">{{$t('nftoken.hint')}}</h5>
    <el-form :model="nftoken"
             :rules="rules"
             ref="token"
             label-width="100px">
      <div class="input-left">
        <div class="font-style font-spacing">
          {{$t('nftoken.tokenContract')}}
        </div>
        <div class="common-input">
          <el-form-item prop="nftContract">
            <el-input v-model="nftoken.nftContract"></el-input>
          </el-form-item>
        </div>
        <div class="font-style">
          {{$t('nftoken.symbol')}}
        </div>
        <div class="common-input">
          <el-form-item prop="nftName">
            <el-input v-model="nftoken.nftName"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="button-div">
      <button class="common-button btn-spacing"
              @click="addNFToken">{{$t('nftoken.save')}}</button>
    </div>

  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import store from 'store'
export default {
  name: 'nftoken',
  data () {
    let validtokenContract = function (rule, address, callback) {
      if (!WalletUtil.validateManAddress(address)) {
        callback(new Error(window.i18n.t('errorMsgs.invalidContractAddress')))
      } else {
        let tokenArray = store.get('nftoken')
        if (typeof (tokenArray) === 'string') {
          tokenArray = JSON.parse(tokenArray)
        }
        if (tokenArray == null) {
          tokenArray = []
        }
        tokenArray.forEach(e => {
          if (e.tokenContract === address) callback(new Error(window.i18n.t('errorMsgs.invalidContractAddress')))
        })
        callback()
      }
    }
    let validTokenName = function (rule, tokenName, callback) {
      if (!WalletUtil.isTokenName(tokenName) || tokenName === 'MAN') {
        callback(new Error(window.i18n.t('errorMsgs.invalidTokenName')))
      } else {
        let tokenArray = store.get('nftoken')
        if (typeof (tokenArray) === 'string') {
          tokenArray = JSON.parse(tokenArray)
        }
        if (tokenArray == null) {
          tokenArray = []
        }
        tokenArray.forEach(e => {
          if (e.tokenName === tokenName) callback(new Error(window.i18n.t('errorMsgs.exsitTokenName')))
        })
        callback()
      }
    }
    // let validDigits = function (rule, digits, callback) {
    //   if (digits < 0) {
    //     callback(new Error(window.i18n.t('errorMsgs.digitsError')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      nftoken: {
        nftContract: '',
        nftName: ''
      },
      localToken: [],
      rules: {
        nftContract: [
          { validator: validtokenContract, trigger: 'change' }
        ],
        nftName: [
          { validator: validTokenName, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addNFToken () {
      this.$refs['token'].validate((valid) => {
        if (valid) {
          let tokenArray = store.get('nftoken')
          if (typeof (tokenArray) === 'string') {
            tokenArray = JSON.parse(tokenArray)
          }
          if (tokenArray == null) {
            tokenArray = []
          }
          tokenArray.push(this.nftoken)
          store.set('nftoken', tokenArray)
          this.$message.success(this.$t('token.tokenSuccess'))
          this.$router.back()
        } else {
          this.$message.success(this.$t('token.tokenFail'))
        }
      })
    },
    getNFTList () {

    }
  },
  mounted () {
    this.getNFTList()
  }
}
</script>

<style scoped lang="less">
.nftoken {
  .h-dis {
    margin-left: 40px;
    width: 26.5rem;
  }
  .greetings_input {
    border-radius: 2px;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  .error_font {
    font-size: 12px;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    width: 27.56rem;
    text-align: left;
  }

  .greetings_btn {
    width: 12.5rem;
    height: 2.625rem;
    line-height: 2.625rem;
    background: #415eaa;
    border-radius: 2px;
    cursor: pointer;
    font-size: 0.875rem;
    color: #ffffff;
    letter-spacing: 0.11px;
    text-align: center;
    margin-top: 1.5rem;
  }
  .btn_spacing {
    margin-left: 1.5rem;
  }
  .common-input {
    width: 26.5rem;
    height: 2.5rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .font-style {
    font-size: 14px;
    color: #2c365c;
    letter-spacing: 0.13px;
  }
  .font-spacing {
    margin-top: 2rem;
  }
  .input-left {
    text-align: left;
    padding-left: 280px;
  }
  .btn-spacing {
    margin-top: 0.5rem;
    cursor: pointer;
  }
  /deep/.el-form-item__content {
    margin: 0 !important;
  }
  .button-div {
    padding-left: 25px;
  }
}
</style>
