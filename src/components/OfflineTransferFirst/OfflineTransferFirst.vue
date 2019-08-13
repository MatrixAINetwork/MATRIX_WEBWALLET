<template>
  <div class="offline-transfer-first align-center">
    <el-form :model="ruleForm"
             :rules="rules">
      <div class="form-item">
        <div class="input-name">{{$t('offline.getInformation')}}</div>
        <div class="common-input">
          <el-form-item prop="wallet">
            <el-input :placeholder="$t('offline.inputAddress')"
                      v-model="ruleForm.address"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="account-info"
         v-if="balanceShow">
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
    </div>
    <div class="next-step"
         v-if="!balanceShow">
      <button class="common-button"
              @click="getWalletBlance">{{$t('offline.get')}}</button>
    </div>
    <div class="next-step"
         v-if="balanceShow">
      <button class="common-button"
              @click="nextStep">{{$t('offline.next')}}</button>
    </div>
    <offline-dialog :confirmVisible="confirmTransfer"
                    :width="'800px'"
                    :msg="$t('offline.hint')"
                    @confirmSend="confirmSend"></offline-dialog>
  </div>
</template>

<script>
import OfflineDialog from '@/components/TransferDialog/offlineDialog'
import Bus from '@/assets/js/Bus'
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'OfflineTransferFirst',
  data () {
    return {
      ruleForm: {
        address: ''
      },
      rules: {
        address: [
          { required: true, message: this.$t('offline.addressError'), trigger: 'blur' }
        ]
      },
      balanceShow: false,
      balance: 0,
      nonce: '',
      confirmTransfer: false
    }
  },
  methods: {
    nextStep () {
      this.$router.push({ name: 'OfflineTransferSecond', params: { balance: this.balance, address: this.ruleForm.address, nonce: this.nonce } })
    },
    getWalletBlance () {
      try {
        if (!WalletUtil.validateManAddress(this.ruleForm.address)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        this.balance = this.httpProvider.man.getBalance(this.ruleForm.address)
        this.nonce = this.httpProvider.man.getTransactionCount(this.ruleForm.address)
        this.balanceShow = true
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    confirmSend (state) {
      if (state === 'cancel') {
        this.$router.back()
      } else {
        this.$store.commit('UPDATE_WALLET', null)
        Bus.$emit('openWallet', 'close')
      }
      this.confirmTransfer = false
    }
  },
  mounted () {
    if (this.$store.getters.wallet == null) {
      this.confirmTransfer = false
    } else {
      this.confirmTransfer = true
    }
  },
  components: {
    OfflineDialog
  }
}
</script>

<style scoped lang="less">
.offline-transfer-first {
  padding: 0 3.25rem;
  .form-item {
    text-align: left;
    margin-left: 16rem;
    margin-bottom: 55px;
  }
  .el-form {
    border-bottom: 1px #d5d7de solid;
  }
  .next-step {
    text-align: center;
    margin: 2rem 0 3rem 0;
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
