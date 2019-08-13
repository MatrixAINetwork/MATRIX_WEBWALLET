'use strict'
import MatrixTx from 'matrixjs-tx'
import BigNumber from 'bignumber.js'
import WalletUtil from '@/assets/js/WalletUtil'
import {
  chainId
} from '@/assets/js/config' // 配置

import Man from 'aiman'
const manUtil = new Man()

const TradingFuns = function () { }
TradingFuns.getTxData = function (tradingObj) {
  if (JSON.stringify(tradingObj.extra_to[0][2]) != null) {
    for (var i = 0, length = tradingObj.extra_to[0][2].length; i < length; i++) {
      let weiValue = new BigNumber(String(tradingObj.extra_to[0][2][i][1])).times(new BigNumber(manUtil.toWei('1'), 10))
      let value = new BigNumber(weiValue.toString(10)).toString(16)
      tradingObj.extra_to[0][2][i][1] = '0x' + value
    }
  }
  return {
    to: tradingObj.to,
    value: '0x' + WalletUtil.toWeiHex(tradingObj.value),
    gasLimit: '0x' + new BigNumber(tradingObj.gasLimit).toString(16),
    data: (tradingObj.data !== '' || tradingObj.data !== null) ? ('0x' + WalletUtil.str2hex(tradingObj.data)) : '0x',
    gasPrice: '0x' + new BigNumber(tradingObj.gasPrice).toString(16),
    CommitTime: parseInt(new Date().getTime() / 1000),
    IsEntrustTx: tradingObj.IsEntrustTx,
    TxEnterType: '',
    chainId: chainId,
    extra_to: tradingObj.extra_to,
    nonce: tradingObj.nonce
  }
}

TradingFuns.signRawTx = (rawTx) => {
  return new MatrixTx(rawTx, true)
}

TradingFuns.getContractData = function (contractObj) {
  return {
    gasLimit: '0x' + new BigNumber(contractObj.gasLimit).toString(16),
    data: contractObj.byteCode.substring(0, 2) === '0x' ? contractObj.byteCode : '0x' + contractObj.byteCode,
    gasPrice: '0x' + new BigNumber(contractObj.gasPrice).toString(16),
    CommitTime: parseInt(new Date().getTime() / 1000),
    IsEntrustTx: '',
    TxEnterType: '',
    chainId: chainId,
    extra_to: [
      [0, 0, []]
    ],
    nonce: contractObj.nonce,
    currency: contractObj.address.split('.')[0]
  }
}

TradingFuns.getEntrustData = function (tradingObj) {
  return {
    to: tradingObj.to,
    value: '0x',
    gasLimit: '0x' + new BigNumber(tradingObj.gasLimit).toString(16),
    data: tradingObj.data !== '' || tradingObj.data !== null ? '0x' + WalletUtil.str2hex(tradingObj.data) : '',
    gasPrice: '0x' + new BigNumber(tradingObj.gasPrice).toString(16),
    CommitTime: parseInt(new Date().getTime() / 1000),
    IsEntrustTx: '',
    TxEnterType: '',
    chainId: chainId,
    extra_to: [
      [5, 0, []]
    ],
    nonce: tradingObj.nonce
  }
}
export default TradingFuns
