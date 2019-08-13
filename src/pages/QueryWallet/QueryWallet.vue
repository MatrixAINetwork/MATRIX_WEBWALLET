<template>
  <div class="query-wallet card-width">
    <el-card class="box-card">
      <h1>{{$t('queryWallet.tittle')}}</h1>
      <h4>{{$t('queryWallet.inputAddress')}}</h4>
      <input type="text"
             class="input_style greetings_input"
             :placeholder="$t('queryWallet.pleaseInput')"
             v-model="address">
      <div class="error_font"
           v-show="errorHint">{{$t('queryWallet.addressError')}}</div>
      <div class="dom_justify_center">
        <div class="file_btn"
             @click="getWalletBlance">{{$t('HistoricalIncome.determine')}}</div>
      </div>
      <div>
        <span class="keyStoneHintFont">{{$t('queryWallet.havingWallet1')}}&nbsp; <a class="a_font"
             v-on:click="goPage('myWalletFirst')">{{$t('queryWallet.havingWallet2')}}</a></span>
      </div>
      <div>
        <span class="keyStoneHintFont">{{$t('queryWallet.notHaving1')}}&nbsp;<a class="a_font"
             v-on:click="goPage('createWallet')">{{$t('queryWallet.notHaving2')}}</a></span>
      </div>
      <div class="account-info"
           v-show="balanceShow">
        <label class="title_font">{{$t('offline.manAssets')}}</label>
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
              <td>{{$t('myWallet.walletAddress')}}<span class="matrix_fontSmall">({{$t('myWallet.addressTip1')+$t('myWallet.addressTip2')}})</span></td>
            </tr>
            <tr class="tr2_info">
              <td>{{address}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'SetGreetings',
  data () {
    return {
      address: '',
      balance: [],
      balanceShow: false,
      errorHint: false
    }
  },
  methods: {
    goPage (route) {
      this.$router.push({ path: '/my-wallet/' + route })
    },
    getWalletBlance () {
      try {
        if (WalletUtil.validateManAddress(this.address)) {
          this.balance = this.httpProvider.man.getBalance(this.address)
          this.balanceShow = true
          this.errorHint = false
        } else {
          this.errorHint = true
          this.balanceShow = false
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style scoped lang="less">
.query-wallet {
  /deep/.el-card__body {
    padding: 2rem 2rem 3rem;
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
    // position: relative;
    // left: -149px;
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
  .account-info {
    text-align: left;
    margin-top: 2rem;
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
        }
      }
    }
  }
}
</style>
