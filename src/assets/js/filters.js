import moment from 'moment'
import Man from 'aiman'
import BigNumber from 'bignumber.js'
import ManUtils from '@/assets/js/ManUtils'

const bs58 = require('bs58')
const polycrc = require('polycrc')
const manUtil = new Man()

const numberToWei = function (value) {
  try {
    return manUtil.toWei(new BigNumber(value))
  } catch (e) {
    return e
  }
}

const getManAddress = function (address) {
  let crc8 = polycrc.crc(8, 0x07, 0x00, 0x00, false)
  if (address.substring(0, 2) === '0x') {
    address = address.substring(2, address.length)
  }
  const bytes = Buffer.from(address, 'hex')
  const manAddress = bs58.encode(bytes)
  let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]
  return ('MAN.' + manAddress) + arr[crc8('MAN.' + manAddress) % 58]
}

const weiToNumber = function (value) {
  try {
    return manUtil.fromWei(new BigNumber(value))
  } catch (e) {
    return e
  }
}

const txTypeFilter = function (value) {
  if (value === 0) {
    return window.i18n.t('transactionnType.commonTransaction')
  } else if (value === 1) {
    return window.i18n.t('transactionnType.radioTransaction')
  } else if (value === 2) {
    return window.i18n.t('transactionnType.minnerTransaction')
  } else if (value === 3) {
    return window.i18n.t('transactionnType.revocableTransaction')
  } else if (value === 4) {
    return window.i18n.t('transactionnType.undoneTransaction')
  } else if (value === 5) {
    return window.i18n.t('transactionnType.authorizedEntrusts')
  } else if (value === 6) {
    return window.i18n.t('transactionnType.cancelEntrusts')
  } else if (value === 7) {
    return window.i18n.t('transactionnType.timeTransaction')
  } else if (value === 8) {
    return window.i18n.t('transactionnType.aiTransaction')
  } else if (value === 9) {
    return window.i18n.t('transactionnType.createCurrency')
  } else if (value === 10) {
    return window.i18n.t('transactionnType.validator')
  } else if (value === 11) {
    return window.i18n.t('transactionnType.interest')
  } else if (value === 12) {
    return window.i18n.t('transactionnType.transactionFee')
  } else if (value === 13) {
    return window.i18n.t('transactionnType.lottery')
  } else if (value === 119) {
    return window.i18n.t('transactionnType.super')
  } else if (value === 120) {
    return window.i18n.t('transactionnType.superblock')
  }
}

const dateFormat = function (date, format) {
  if (date.toString().length < 13) {
    date = date * 1000
  }
  return moment(date).format(format)
}

const incomeFilter = function (data, params) {
  let down = Number(data.split('-')[0])
  let up = Number(data.split('-')[1])
  let result = 0
  params.forEach(item => {
    if ((item.blockNumber <= up && item.blockNumber > down) || item.blockNumber === 0) {
      result += Number(ManUtils.fromWei(item.value))
    }
  })
  return result
}

const isNodeFilter = function (data, address, httpProvider) {
  let down = Number(data.split('-')[0])
  let topologyStatus = httpProvider.man.getTopologyStatus(down + 1)
  let miners = topologyStatus.miners.filter(item => (item.account === address) && (item.online || item.online === true))
  let validators = topologyStatus.validators.filter(item => item.account === address && (item.online || item.online === true))
  let result = '未选中'
  if (miners.length > 0) {
    result = '矿工节点'
  }
  if (validators.length > 0) {
    result = '验证者节点'
  }
  return result
}

// 分页
const pageFilter = function (data, pageNumber, pageSize) {
  let arr = data.filter(item => {
    if ((item.index >= ((pageNumber - 1) * pageSize) && item.index < (pageNumber * pageSize))) {
      return item
    }
  })
  return arr
}
export default {
  numberToWei,
  weiToNumber,
  dateFormat,
  incomeFilter,
  isNodeFilter,
  pageFilter,
  txTypeFilter,
  getManAddress
}
