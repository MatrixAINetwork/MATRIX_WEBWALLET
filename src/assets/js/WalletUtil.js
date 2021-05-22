import keythereum from 'keythereum'
import BigNumber from 'bignumber.js'
import Man from 'aiman'
import MatrixTx from 'matrixjs-tx'
import solidityCoder from '@/assets/solidity/coder'
import solidityUtils from '@/assets/solidity/utils'
const ethers = require('ethers')
const polycrc = require('polycrc')
const bs58 = require('bs58')
const bip39 = require('bip39')
const util = require('matrixjs-util')
const hdkey = require('hdkey')
const manUtil = new Man()

// const _ = require('lodash')
let WalletUtil = {}

// 创建组记词
WalletUtil.createMnemonic = function () {
  return bip39.generateMnemonic()
}

WalletUtil.entropyToMnemonic = function (entropy) {
  return bip39.entropyToMnemonic(entropy)
}

// 组记词获取私钥
WalletUtil.mnemonicToPrivateKey = function (mnemonic) {
  let seed = bip39.mnemonicToSeed(mnemonic)

  let hdWallet = hdkey.fromMasterSeed(seed)
  let key = hdWallet.derive("m/44'/60'/0'/0/0")
  return key._privateKey
}

// 组记词获取私钥
WalletUtil.mnemonicToKeyStore = function (mnemonic, password) {
  let seed = bip39.mnemonicToSeed(mnemonic)
  let hdWallet = hdkey.fromMasterSeed(seed)
  let key = hdWallet.derive("m/44'/60'/0'/0/0")
  let params = {
    keyBytes: 32,
    ivBytes: 16
  }
  let dk = keythereum.create(params)
  let options = {
    kdf: 'scrypt',
    cipher: 'aes-128-ctr',
    kdfparams: {
      n: 262144,
      r: 8,
      p: 1,
      dklen: 32
    }
  }
  let keyObject = keythereum.dump(password, key._privateKey, dk.salt, dk.iv, options)
  let address = util.pubToAddress(key._publicKey, true)
  address = util.toChecksumAddress(address.toString('hex'))
  address = this.getManAddress(address)
  keyObject.address = address
  return keyObject
}

// 私钥获取keystore
WalletUtil.privateKeyToKeyStore = function (privateKey, password) {
  let params = {
    keyBytes: 32,
    ivBytes: 16
  }
  let dk = keythereum.create(params)
  let options = {
    kdf: 'scrypt',
    cipher: 'aes-128-ctr',
    kdfparams: {
      n: 262144,
      r: 8,
      p: 1,
      dklen: 32
    }
  }
  let keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv, options)
  let address = keythereum.privateKeyToAddress(privateKey)
  address = this.getManAddress(address)
  keyObject.address = address
  return keyObject
}

// 根据地址获取钱包keystore名称
WalletUtil.getFileName = function (address) {
  return keythereum.generateKeystoreFilename(address)
}

// 私钥解锁钱包
WalletUtil.privateKeyToWallet = function (privateKey) {
  let wallet = new ethers.Wallet(privateKey)
  let manAddress = this.getManAddress(wallet.address)
  Object.defineProperty(wallet, 'address', {
    value: manAddress,
    writable: true,
    configurable: true,
    enumerable: true
  })
  return wallet
}

// keystore解锁钱包
WalletUtil.keyStoreToWallet = function (keyStore, password) {
  let promise = new Promise((resolve, reject) => {
    keythereum.recover(password, keyStore, (result) => {
      // do stuff
      if (result instanceof Uint8Array) {
        resolve(this.privateKeyToWallet(result.toString('hex')))
      } else {
        reject(window.i18n.t('errorMsgs.passwordError'))
      }
    })
  })
  return promise
}

// 根据MAN地址获取0x地址
WalletUtil.getAddress = function (address) {
  let addrTemp = address.split('.')[1]
  return '0x' + (bs58.decode(addrTemp.substring(0, addrTemp.length - 1))).toString('hex')
}

// 根据0x地址获取MAN地址
WalletUtil.getManAddress = function (address) {
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

// 字符串转16进制
WalletUtil.str2hex = function (str) {
  let charBuf = this.writeUTF(str, true)
  let re = ''
  for (let i = 0; i < charBuf.length; i++) {
    let x = (charBuf[i] & 0xFF).toString(16)
    if (x.length === 1) {
      x = '0' + x
    }
    re += x
  }
  return re
}

WalletUtil.writeUTF = function (str, isGetBytes) {
  let back = []
  let byteSize = 0
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    if (code >= 0x00 && code <= 0x7f) {
      byteSize += 1
      back.push(code)
    } else if (code >= 0x80 && code <= 0x7ff) {
      byteSize += 2
      back.push((192 | (31 & (code >> 6))))
      back.push((128 | (63 & code)))
    } else if ((code >= 0x800 && code <= 0xd7ff) ||
      (code >= 0xe000 && code <= 0xffff)) {
      byteSize += 3
      back.push((224 | (15 & (code >> 12))))
      back.push((128 | (63 & (code >> 6))))
      back.push((128 | (63 & code)))
    }
  }
  for (let i = 0; i < back.length; i++) {
    back[i] &= 0xff
  }
  if (isGetBytes) {
    return back
  }
  if (byteSize <= 0xff) {
    return [0, byteSize].concat(back)
  } else {
    return [byteSize >> 8, byteSize & 0xff].concat(back)
  }
}
WalletUtil.numToHex = function (num) {
  return '0x' + new BigNumber(num).toString(16)
}
WalletUtil.getValueOfUnit = function (unit) {
  return new BigNumber(unit, 10)
}
// 生成和约地址
WalletUtil.getDeteministicContractAddress = function (address, nonce) {
  nonce = new BigNumber(nonce).toString()
  address = address.substring(0, 2) === '0x' ? address : '0x' + address
  return '0x' + util.generateAddress(address, nonce).toString('hex')
}

// man地址转16进制
WalletUtil.manAddressToHex = function (addrTemp) {
  let hex = bs58.decode(addrTemp.substring(0, addrTemp.length - 1)).toString('hex')
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
  if (hex === '') return ''
  return '0x' + this.padLeftEven(hex)
}
WalletUtil.padLeftEven = function (hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex
  return hex
}

// 校验man地址
WalletUtil.validateManAddress = function (address) {
  return (/MAN\.[0-9a-zA-Z]{21,29}$/.test(address)) && this.checkAddressCrc8(address)
  // return (/^[A-Z]{2,8}\.[0-9a-zA-Z]{21,29}$/.test(address))
}

// 校验man地址
WalletUtil.validateAddress = function (address) {
  // return (/MAN\.[0-9a-zA-Z]{21,29}$/.test(address))
  return (/^[A-Z]{2,8}\.[0-9a-zA-Z]{21,38}$/.test(address))
}

// 校验token名称
WalletUtil.isTokenName = function (value) {
  return /^[A-Z?]*$/.test(value)
}
// value转16进制的wei运算
WalletUtil.toWeiHex = (num) => {
  let weiValue = new BigNumber(String(num)).times(new BigNumber(manUtil.toWei('1'), 10))
  let value = new BigNumber(weiValue.toString(10)).toString(16)
  return value
}
// 构造交易签名对象
WalletUtil.createTx = (jsonObj) => {
  return new MatrixTx(jsonObj, true)
}

WalletUtil.hexToDecimal = function (hex) {
  return new BigNumber(hex).toString()
}

// 获得多币种地址
WalletUtil.checkAddressCrc8 = function (address) {
  let crc = address[address.length - 1]
  address = address.slice(0, -1)
  let crc8 = polycrc.crc(8, 0x07, 0x00, 0x00, false)

  let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]
  console.log(crc)
  console.log(arr[crc8(address) % 58])
  return (arr[crc8(address) % 58] === crc)
}

// 获得多币种地址
WalletUtil.getCurrencyAddress = function (address, currency) {
  address = this.getAddress(address)
  let crc8 = polycrc.crc(8, 0x07, 0x00, 0x00, false)
  const bytes = Buffer.from(address.substring(2, address.length), 'hex')
  const manAddress = bs58.encode(bytes)
  let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]
  return (currency.toLocaleUpperCase() + '.' + manAddress) + arr[crc8(currency.toLocaleUpperCase() + '.' + manAddress) % 58]
}
WalletUtil.hex2str = function (str) {
  var buf = []
  for (var i = 0; i < str.length; i += 2) {
    buf.push(parseInt(str.substring(i, i + 2), 16))
  }
  return this.readUTF(buf)
}
WalletUtil.readUTF = function (arr) {
  if (typeof arr === 'string') {
    return arr
  }
  let UTF = ''
  let _arr = arr
  for (var i = 0; i < _arr.length; i++) {
    let one = _arr[i].toString(2)
    let v = one.match(/^1+?(?=0)/)
    if (v && one.length === 8) {
      let bytesLength = v[0].length
      let store = _arr[i].toString(2).slice(7 - bytesLength)
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2)
      }
      UTF += String.fromCharCode(parseInt(store, 2))
      i += bytesLength - 1
    } else {
      UTF += String.fromCharCode(_arr[i])
    }
  }
  return UTF
}
WalletUtil.crc32 = function (str, crc) {
  var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'
  if (crc === window.undefined) crc = 0
  var n = 0
  var x = 0
  crc = crc ^ (-1)
  for (var i = 0, iTop = str.length; i < iTop; i++) {
    n = (crc ^ str.charCodeAt(i)) & 0xFF
    x = '0x' + table.substr(n * 9, 8)
    crc = (crc >>> 8) ^ x
  }
  return crc ^ (-1)
}
WalletUtil.solidityUtils = solidityUtils
WalletUtil.getFunctionSignature = function (name) {
  return util.sha3(name).toString('hex').slice(0, 8)
}

WalletUtil.solidityCoder = solidityCoder

WalletUtil.addressChange = function (addrTemp) {
  return bs58.decode(addrTemp.substring(0, addrTemp.length - 1)).toString('hex')
}

WalletUtil.decimalToHex = function (dec) {
  return new BigNumber(dec).toString(16)
}

// 根据MAN地址获取eth地址
WalletUtil.getEthAddress = function (address) {
  let addrTemp = address.split('.')[1]
  return '0x' + (bs58.decode(addrTemp.substring(0, addrTemp.length - 1))).toString('hex')
}

export default WalletUtil
