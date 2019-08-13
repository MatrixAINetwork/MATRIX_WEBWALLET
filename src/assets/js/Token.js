'use strict'
import BigNumber from 'bignumber.js'
import WalletUtil from '@/assets/js/WalletUtil.js'
var Token = function (contractAddress, userAddress, symbol, decimal, currency, type) {
  this.contractAddress = contractAddress
  this.userAddress = userAddress
  this.symbol = symbol
  this.decimal = decimal
  this.type = type
  this.currency = currency
}
Token.balanceHex = '0x70a08231'
Token.transferHex = '0xa9059cbb'
Token.popTokens = []
Token.prototype.getContractAddress = function () {
  return this.contractAddress
}
Token.prototype.getUserAddress = function () {
  return this.userAddress
}
Token.prototype.setUserAddress = function (address) {
  this.userAddress = address
}
Token.prototype.getSymbol = function () {
  return this.symbol
}
Token.prototype.getDecimal = function () {
  return this.decimal
}

Token.prototype.getBalanceBN = function () {
  return this.balanceBN
}

Token.prototype.setBalance = function (callback) {
  var balanceCall = this.getDataObj(this.contractAddress, Token.balanceHex, [this.userAddress.toLowerCase().replace('0x', '')])
  return balanceCall
}

Token.prototype.getData = function (toAdd, value) {
  try {
    value = this.padLeft(new BigNumber(value).times(new BigNumber(10).pow(this.getDecimal())).toString(16), 64)
    toAdd = this.padLeft(toAdd.toLowerCase().replace('0x', ''), 64)
    var data = Token.transferHex + toAdd + value
    return {
      isError: false,
      data: data
    }
  } catch (e) {
    return {
      isError: true,
      error: e
    }
  }
}
Token.prototype.padLeft = function (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
Token.prototype.getDataObj = function (to, func, arrVals) {
  var val = ''
  for (var i = 0; i < arrVals.length; i++) val += this.padLeft(arrVals[i], 64)
  let manAddress = WalletUtil.getManAddress(to)
  let toAddress = WalletUtil.getCurrencyAddress(manAddress, this.currency)
  return {
    to: toAddress,
    data: func + val
  }
}

export default Token
