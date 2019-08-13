var BigNumber = require('bignumber.js')
var ETH_UNITS = [
  'wei',
  'kwei',
  'Mwei',
  'Gwei',
  'szabo',
  'finney',
  'nano',
  'micro',
  'milli',
  'grand'
]

export default {
  ETH_PADDING: 32,
  ETH_SIGNATURE_LENGTH: 4,
  ETH_UNITS: ETH_UNITS,
  ETH_BIGNUMBER_ROUNDING_MODE: {
    ROUNDING_MODE: BigNumber.ROUND_DOWN
  },
  ETH_POLLING_TIMEOUT: 1000 / 2,
  defaultBlock: 'latest',
  defaultAccount: undefined
}
