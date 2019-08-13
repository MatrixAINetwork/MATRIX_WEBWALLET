<template>
  <div class="set-greetings card-width">
    <el-card class="box-card">
      <h1>{{$t('setGreeting.tittle')}}</h1>
      <h4>{{$t('setGreeting.hint')}}</h4>
      <input type="text"
             v-model="content"
             class="input_style greetings_input">
      <div class="error_font"
           v-if="contentError">{{$t('setGreeting.error')}}</div>
      <div class="dom_justify_center">
        <div class="greetings_btn"
             @click="goPage">{{$t('setGreeting.skip')}}</div>
        <div class="greetings_btn btn_spacing"
             @click="save">{{$t('setGreeting.save')}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import store from 'store'
export default {
  name: 'SetGreetings',
  data () {
    return {
      content: '',
      address: '',
      contentError: false
    }
  },
  mounted () {
    this.address = this.$store.getters.wallet.address
  },
  methods: {
    save () {
      if (this.address !== '') {
        if (this.content !== '') {
          let greetings = store.get('greetings')
          if (typeof (greetings) === 'string') {
            greetings = JSON.parse(greetings)
          }
          if (greetings == null) {
            greetings = []
            greetings.push({ address: this.address, content: this.content })
          } else {
            // greetings = JSON.parse(greetings)
            let index = -1
            for (let i = 0, length = greetings.length; i < length; i++) {
              if (greetings[i].address === this.address) {
                greetings[i].content = this.content
                index = i
                break
              }
            }
            if (index < 0) {
              greetings.push({ address: this.address, content: this.content })
            }
          }
          store.set('greetings', greetings)
          this.$message.success(this.$t('setGreeting.setSuccess'))
          this.contentError = false
          if (JSON.stringify(this.$route.query) === '{}') {
            this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
          } else {
            this.$store.commit('UPDATE_WALLET', null)
            this.$router.push({ path: '/my-wallet/myWalletFirst' })
          }
        } else {
          this.contentError = true
          this.$message.error(this.$t('setGreeting.pleaseInput'))
        }
      } else {
        this.$message.error(this.$t('setGreeting.setWalletError'))
      }
    },
    goPage () {
      if (JSON.stringify(this.$route.query) === '{}') {
        this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
      } else {
        this.$store.commit('UPDATE_WALLET', null)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
      }
    }
  }
}
</script>

<style scoped lang="less">
.set-greetings {
  /deep/ .el-card__body {
    padding: 2rem 0 3rem 0;
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
}
</style>
