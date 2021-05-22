<template>
  <div class="my-assets">
    <div class=" account-info">
      <label class="title_font">MAN {{$t('myWallet.assets')}}</label>
      <label class="transfer_font"
             @click="goTransfer(balance[0].balance, 'MAN')">{{$t('myWallet.transfer')}}</label>
      <label class="transfer_font"
             @click="goPage('undo')">{{$t('record.undo')}}</label>
      <div class="money_font">
        <template v-for="(item, index) in balance">
          <label v-if="item.accountType == 0"
                 :key='index'>
            {{$t('myWallet.availableAssets')}}
            : {{item.balance | weiToNumber}} (MAN)
          </label>
          <label v-if="item.accountType == 3"
                 :key='index'>
            {{$t('myWallet.revocableAssets')}}
            : {{item.balance | weiToNumber}} (MAN)
          </label>
        </template>
        <label>
          {{$t('myWallet.stakedAssets')}}
          : 0 (MAN)
        </label>
      </div>
      <table class="tab_info">
        <tbody>
          <tr class="tr1_info">
            <td>MAN{{$t('myWallet.walletAddress')}}<span class="matrix_fontSmall">({{$t('myWallet.addressTip1')}}MAN{{$t('myWallet.addressTip2')}})</span></td>
            <!-- <td>{{$t('myWallet.accountName')}}</td>
            <td>{{$t('myWallet.browserLink')}}</td> -->
          </tr>
          <tr class="tr2_info">
            <td>{{address}}<a href="javascript:void(0)"
                 v-clipboard="address"
                 @success="copySuccess"
                 @error="copyError">{{$t('createWallet.copy')}}</a></td>
            <!-- <td>man.1380013800</td>
            <td><a>8888.matrix.io</a></td> -->
          </tr>
        </tbody>
      </table>
      <hr class="bottom_hr">
      <!-- <div class="two-input"> -->
        <div class="token_btn"
            @click="goPage('token')">+ {{$t('myWallet.addToken')}}</div>
        <!-- <div class="token_btn" style="width: 48%"
            @click="goPage('nftoken')">+ {{$t('myWallet.addNFToken')}}</div> -->
      <!-- </div> -->
      <div class="token_btn"
           @click="goPage('createCoin')">+ {{$t('createCoin.tittle')}}</div>
    </div>
    <div class="account-info"
         v-if="matrixCoin != null">
      <div class="account-header">
        <label class="title_font">{{currency}}{{$t('myWallet.assets')}}</label>
        <label class="transfer_font"
               @click="goTransfer(selectedCurrency.balance[0].balance, currency)">{{$t('myWallet.transfer')}}</label>
        <el-select v-model="currency"
                   :placeholder="$t('CampaignNode.select')"
                   @change="changeCurrency">
          <el-option v-for="item in matrixCoin"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
          <!-- <el-option class="optionBtn">
             +添加token
          </el-option> -->
        </el-select>
      </div>
      <div class="money_font">
        <template v-for="(item, index) in selectedCurrency.balance">
          <label v-if="item.accountType == 0"
                 :key='index'>
            {{$t('myWallet.availableAssets')}}
            : {{item.balance | weiToNumber}} ({{currency}})
          </label>
          <label v-if="item.accountType == 3"
                 :key='index'>
            {{$t('myWallet.revocableAssets')}}
            : {{item.balance | weiToNumber}} ({{currency}})
          </label>
        </template>
        <label>
          {{$t('myWallet.stakedAssets')}}
          : 0 ({{currency}})
        </label>
      </div>
      <table class="tab_info">
        <tbody>
          <tr class="tr1_info">
            <td>{{currency}}{{$t('myWallet.walletAddress')}}<span class="matrix_fontSmall">({{$t('myWallet.addressTip1')}}{{currency}}{{$t('myWallet.addressTip2')}})</span></td>
            <!-- <td>{{$t('myWallet.accountName')}}</td>
            <td>{{$t('myWallet.browserLink')}}</td> -->
          </tr>
          <tr class="tr2_info">
            <td>{{selectedCurrency.address}}<a v-clipboard="selectedCurrency.address"
                 @success="copySuccess"
                 @error="copyError"
                 href="javascript:void(0)">{{$t('createWallet.copy')}}</a></td>
            <!-- <td>man.1380013800</td>
            <td><a>8888.matrix.io</a></td> -->
          </tr>
        </tbody>
      </table>
      <hr class="bottom_hr">
      <div class="token_btn"
           @click="goPage('token')">+ {{$t('myWallet.addToken')}}
      </div>
    </div>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'my-assets',
  data () {
    return {
      address: '',
      balance: [],
      currency: '',
      selectedCurrency: {
        address: '',
        balance: []
      },
      matrixCoin: null
    }
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('myWallet.copySuccess'))
    },
    copyError () {
      this.$message.error(this.$t('myWallet.copyFile'))
    },
    getBalance (address) {
      try {
        return this.httpProvider.man.getBalance(address)
      } catch (e) {
        this.$message.error(e.message)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
        this.$store.commit('OFFLINE', null)
        this.$store.commit('UPDATE_WALLET', null)
      }
    },
    goTransfer (balance, currency) {
      this.$router.push({ name: 'OnlineTransfer', params: { balance: balance, currency: currency } })
    },
    goPage (route) {
      this.$router.push({ path: '/my-wallet/openWallet/' + route })
    },
    changeCurrency () { // 选择币种查看余额
      let address = WalletUtil.getCurrencyAddress(this.address, this.currency)
      this.selectedCurrency.address = address
      this.selectedCurrency.balance = this.getBalance(address)
    },
    getMatrixCoin () { // 获取链的多币种
      try {
        this.matrixCoin = this.httpProvider.man.getMatrixCoin('latest')
        // this.matrixCoin = ['AAA', 'NNNN']
        if (this.matrixCoin != null && this.matrixCoin.length !== 0) {
          this.currency = this.matrixCoin[0]
          let address = WalletUtil.getCurrencyAddress(this.address, this.matrixCoin[0])
          this.selectedCurrency.address = address
          this.selectedCurrency.balance = this.getBalance(address)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    this.balance = this.getBalance(this.address)
    this.getMatrixCoin()
  }
}
</script>
<style scoped lang="less">
.my-assets {
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .query_assets_top {
    text-align: left;
  }
  .two-input {
    /deep/ .el-select {
      width: 100% !important;
    }
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .account-info {
    text-align: left;
    margin-top: 2rem;
    .account-header {
      .el-select {
        float: right;
      }
    }
    .title_font {
      font-size: 1.25rem;
      color: #2c365c;
      letter-spacing: 0.18px;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    .transfer_font {
      font-size: 0.875rem;
      color: #1c51dd;
      margin-left: 1.5rem;
      cursor: pointer;
    }
    .money_font {
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0.11px;
      margin: 1rem 0;
      text-align: left;
      label:not(:first-child) {
        margin-left: 2.63rem;
      }
    }
    .tab_info {
      width: 100%;
      margin-top: 1rem;
      border-spacing: 0px;
      .tr1_info {
        background: rgba(242, 244, 248, 0.8);
        height: 2.5rem;
        font-size: 0.88rem;
        color: #2c365c;
        letter-spacing: 0.15px;
        td:first-of-type {
          padding-left: 1rem;
          width: 64%;
          .matrix_fontSmall {
            font-size: 0.625rem;
            color: #9298ae;
            letter-spacing: 0.13px;
            line-height: 1.25rem;
            opacity: 0.5;
            margin-left: 0.31rem;
          }
        }

        td:nth-of-type(2) {
          width: 16.6%;
        }
      }

      .tr2_info {
        color: #2c365c;
        letter-spacing: 0.13px;
        height: 3rem;
        font-size: 0.75rem;
        background: rgba(242, 244, 248, 0.3);
        td:first-of-type {
          padding-left: 1rem;
          a {
            margin-left: 1.25rem;
          }
        }
        a {
          color: #1989fa;
          text-decoration: none;
        }
      }
    }
  }
  .bottom_hr {
    margin: 1rem 0;
  }
  .token_btn {
    text-align: center;
    background: #f2f4f8;
    font-size: 14px;
    letter-spacing: 0.13px;
    margin-top: 2rem;
    height: 2.625rem;
    line-height: 2.625rem;
    color: #1c51dd;
    cursor: pointer;
  }
  .active {
    color: #2c365c;
  }
  .optionBtn {
    text-align: center;
    color: #1c51dd;
  }
}
</style>
