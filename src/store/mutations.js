import * as types from './mutation-types'

// import {generateMixed} from './../common/js/common'
// 同步方法
const mutations = {
  [types.UPDATE_WALLET] (state, status) {
    state.wallet = status
  },
  [types.UPDATE_MNEMONIC] (state, status) {
    state.mnemonic = status
  },
  [types.UPDATE_HISTORYURL] (state, status) {
    state.historyUrl = status
  },
  [types.UPDATE_BEFOREURL] (state, status) {
    state.beforeUrl = status
  },
  [types.UNLOCK_WALLET] (state, status) {
    state.unlockWallet = status
  },
  [types.BALANCE] (state, status) {
    state.balance = status
  },
  [types.OFFLINE] (state, status) {
    state.offline = status
  },
  [types.MODE] (state, status) {
    state.mode = status
  }
}

export default mutations
