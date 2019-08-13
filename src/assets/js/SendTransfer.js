import MatrixTx from 'matrixjs-tx'
import BigNumber from 'bignumber.js'

const SendTransfer = {
  getTxParams: null,
  hexToDecimal: null,
  sanitizeHex: null,
  padLeftEven: null
}

SendTransfer.getTxParams = function (hash, currency) {
  let txData = new MatrixTx(hash, true)
  let newTxData = {
    v: '',
    r: '',
    s: '',
    data: '',
    gasPrice: '',
    gas: '',
    value: '',
    nonce: '',
    currency: '',
    txType: 0,
    lockHeight: 0,
    isEntrustTx: 0,
    txEnterType: 0,
    commitTime: 0,
    extra_to: []
  }
  newTxData.v = '0x' + txData.v.toString('hex')
  newTxData.r = '0x' + txData.r.toString('hex')
  newTxData.s = '0x' + txData.s.toString('hex')
  newTxData.data = '0x' + txData.data.toString('hex')
  newTxData.gasPrice = '0x' + txData.gasPrice.toString('hex')
  newTxData.gas = '0x' + txData.gasLimit.toString('hex')
  newTxData.value = '0x' + txData.value.toString('hex')
  if (newTxData.value === '0x') {
    newTxData.value = '0x0'
  }
  newTxData.nonce = '0x' + txData.nonce.toString('hex')
  if (!currency) {
    if (txData.to.toString() !== '') {
      newTxData.to = txData.to.toString()
      newTxData.currency = txData.to.toString().split('.')[0]
    } else {
      newTxData.currency = 'MAN'
    }
  } else {
    newTxData.currency = currency
  }
  let isEntrustTx = '0x' + txData.IsEntrustTx.toString('hex')
  let txEnterType = '0x' + txData.TxEnterType.toString('hex')
  let commitTime = '0x' + txData.CommitTime.toString('hex')
  let txType = '0x' + txData.extra_to[0][0].toString('hex')
  let lockHeight = '0x' + txData.extra_to[0][1].toString('hex')
  newTxData.txType = txType === '0x' ? 0 : Number(this.hexToDecimal(txType))
  newTxData.lockHeight = lockHeight === '0x' ? 0 : Number(this.hexToDecimal(lockHeight))
  newTxData.isEntrustTx = isEntrustTx === '0x' ? 0 : Number(this.hexToDecimal(isEntrustTx))
  newTxData.txEnterType = txEnterType === '0x' ? 0 : Number(this.hexToDecimal(txEnterType))
  newTxData.commitTime = commitTime === '0x' ? 0 : Number(this.hexToDecimal(commitTime))
  newTxData.extra_to = []
  for (var i = 0, length = txData.extra_to[0][2].length; i < length; i++) {
    newTxData.extra_to.push({
      to: txData.extra_to[0][2][i][0].toString(),
      value: '0x' + txData.extra_to[0][2][i][1].toString('hex')
    })
  }
  return newTxData
}
SendTransfer.hexToDecimal = function (hex) {
  return new BigNumber(this.sanitizeHex(hex)).toString()
}
SendTransfer.sanitizeHex = function (hex) {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
  if (hex === '') return ''
  return '0x' + this.padLeftEven(hex)
}
SendTransfer.padLeftEven = function (hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex
  return hex
}

export default SendTransfer
