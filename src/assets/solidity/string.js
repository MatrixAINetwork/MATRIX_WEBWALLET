import f from './formatters'
import SolidityType from './type'

var SolidityTypeString = function () {
  this._inputFormatter = f.formatInputString
  this._outputFormatter = f.formatOutputString
}

SolidityTypeString.prototype = new SolidityType({})
SolidityTypeString.prototype.constructor = SolidityTypeString

SolidityTypeString.prototype.isType = function (name) {
  return !!name.match(/^string(\[([0-9]*)\])*$/)
}

SolidityTypeString.prototype.isDynamicType = function () {
  return true
}

export default SolidityTypeString
