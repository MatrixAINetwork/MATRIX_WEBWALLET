<template>
  <div class="my-WalletFirst">
    <el-card class="box-card">
      <unlock-wallet :title="$t('myWallet.queryWallet')"
                     @openWallet="openWallet('openWallet')"></unlock-wallet>
      <div>
        <span class="keyStoneHintFont">{{$t('myWallet.msg1')}}&nbsp; <a @click="goPage('createWallet')">{{$t('myWallet.create')}}</a></span>
      </div>
    </el-card>
  </div>
</template>

<script>
import UnlockWallet from '@/components/UnlockWallet/UnlockWallet'
import store from '@/store'
import WalletUtil from '@/assets/js/WalletUtil'
import { mortgage } from '@/assets/js/config'
import filter from '@/assets/js/filters'
import * as storeLocal from 'store'
export default {
  name: 'MyWallet',
  data () {
    return {
      copyData: '',
      address: ''
    }
  },
  mounted () {
    // this.test()
    try {
      let address
      if (this.$store.state.offline != null) {
        address = this.$store.state.offline
      } else {
        address = this.$store.getters.wallet.address
      }
      if (address) {
        this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
      }
    } catch (error) {
    }
  },
  methods: {
    goPage (route) {
      this.$router.push({ path: '/my-wallet/' + route })
    },
    openWallet () {
      try {
        let historyUrl = store.state.historyUrl
        if (historyUrl === '/my-wallet/myWalletFirst' && store.state.beforeUrl != null) {
          historyUrl = store.state.beforeUrl
        }
        this.address = this.$store.getters.wallet.address
        let balance = this.httpProvider.man.getBalance(this.address)
        let walletBlance = filter.weiToNumber(balance[0].balance)
        this.$store.commit('BALANCE', walletBlance)
        let greetings = storeLocal.get('greetings')
        let msg = this.$t('unlock.unlockSuccess')
        if (greetings != null) {
          let address = this.$store.state.wallet.address
          // greetings = JSON.parse(greetings)
          if (typeof (greetings) === 'string') {
            greetings = JSON.parse(greetings)
          }
          for (let i = 0, length = greetings.length; i < length; i++) {
            if (greetings[i].address === address) {
              msg += ' ' + greetings[i].content
              break
            }
          }
        }
        this.$message({
          message: msg,
          duration: 3000,
          type: 'success',
          showClose: true
        })
        if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('ai-application') > -1 || historyUrl.indexOf('contract') > -1 || historyUrl.indexOf('jointMining') > -1) {
          if (historyUrl.indexOf('jointMining') > -1) {
            this.$router.push({ path: '/jointMining/jointMiningfirst' })
            return
          }
          if (historyUrl.indexOf('green-mining') > -1) {
            if (this.$store.state.wallet != null) {
              this.$router.push({ path: '/green-mining/digAccount' })
            }
          } else {
            this.$router.push({ path: historyUrl })
          }
        } else {
          this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
        }
      } catch (e) {
        this.$message.error(e.message)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
        this.$store.commit('OFFLINE', null)
        this.$store.commit('UPDATE_WALLET', null)
      }
    },
    getDepositInfo () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let abiArray = JSON.parse(mortgage.abi)
      let contractAddress = mortgage.address
      let contract = this.httpProvider.man.contract(abiArray)
      let myContractInstance = contract.at(contractAddress)
      let deposit = myContractInstance.getDepositInfo(WalletUtil.getAddress(store.state.wallet.address), { currency: 'MAN' })
      this.deposit = deposit
      loading.close()
      if (deposit[1] !== '0x') {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    UnlockWallet
  }
}
</script>

<style scoped lang="less">
.my-WalletFirst {
  .keyStoneHintFont {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
    text-align: center;
  }
  a {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
  }
  /deep/.el-card__body {
    width: 1042px;
    padding: 2.5rem 0 3rem 0;
  }
}
</style>
