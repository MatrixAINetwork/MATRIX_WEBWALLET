'use strict'
import BigNumber from 'bignumber.js'
import Man from 'aiman'
const manUtil = new Man()

const ManUtils = function () {}

ManUtils.toWei = (number) => {
  try {
    return manUtil.toWei(number)
  } catch (e) {
    return e
  }
}
ManUtils.fromWei = (number) => {
  try {
    return manUtil.fromWei(new BigNumber(number))
  } catch (e) {
    return e
  }
}

ManUtils.fileReaderStream = function (file, opts) {
  opts = opts || {}
  var offset = opts.offset || 0
  var chunkSize = opts.chunkSize || 1024 * 1024 // default 1MB chunk has tolerable perf on large files
  var fileReader = new FileReader(file)
  function source (end, cb) {
    if (end) return cb(end)
    // If finished reading then stop
    let flag = true
    if (offset >= file.size) return cb(flag)

    fileReader.onloadend = function loaded (event) {
      var data = event.target.result
      if (data instanceof ArrayBuffer) {
        data = ManUtils.toBuffer(new Uint8Array(event.target.result))
      }
      cb(null, data)
    }

    fileReader.onerror = function (err) {
      cb(err)
    }

    var endIndex = offset + chunkSize
    var slice = file.slice(offset, endIndex)
    fileReader.readAsArrayBuffer(slice)
    offset = endIndex
  }

  return source
}

ManUtils.toBuffer = function (arr) {
  if (ManUtils.isTypedArray(arr)) {
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
    var buf = Buffer.from(arr.buffer)
    if (arr.byteLength !== arr.buffer.byteLength) {
      // Respect the "view", i.e. byteOffset and byteLength, without doing a copy
      buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
    }
    return buf
  } else {
    // Pass through all other types to `Buffer.from`
    return Buffer.from(arr)
  }
}

ManUtils.isTypedArray = function (arr) {
  return (
    ManUtils.isStrictTypedArray(arr) ||
    ManUtils.isLooseTypedArray(arr)
  )
}

ManUtils.isStrictTypedArray = function (arr) {
  return (
    arr instanceof Int8Array ||
    arr instanceof Int16Array ||
    arr instanceof Int32Array ||
    arr instanceof Uint8Array ||
    arr instanceof Uint8ClampedArray ||
    arr instanceof Uint16Array ||
    arr instanceof Uint32Array ||
    arr instanceof Float32Array ||
    arr instanceof Float64Array
  )
}
ManUtils.isLooseTypedArray = function (arr) {
  return ManUtils.names[toString.call(arr)]
}
ManUtils.names = {
  '[object Int8Array]': true,
  '[object Int16Array]': true,
  '[object Int32Array]': true,
  '[object Uint8Array]': true,
  '[object Uint8ClampedArray]': true,
  '[object Uint16Array]': true,
  '[object Uint32Array]': true,
  '[object Float32Array]': true,
  '[object Float64Array]': true
}

export default ManUtils
