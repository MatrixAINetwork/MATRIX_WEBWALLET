import f from './formatters'
import SolidityType from './type'

/**
 * SolidityTypeBytes is a prototype that represents the bytes type.
 * It matches:
 * bytes
 * bytes[]
 * bytes[4]
 * bytes[][]
 * bytes[3][]
 * bytes[][6][], ...
 * bytes32
 * bytes8[4]
 * bytes[3][]
 */
var SolidityTypeBytes = function () {
  this._inputFormatter = f.formatInputBytes
  this._outputFormatter = f.formatOutputBytes
}

SolidityTypeBytes.prototype = new SolidityType({})
SolidityTypeBytes.prototype.constructor = SolidityTypeBytes

SolidityTypeBytes.prototype.isType = function (name) {
  return !!name.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/)
}

export default SolidityTypeBytes
