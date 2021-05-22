import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import MatrixApp from 'ledger-matrix'
import WalletUtil from './WalletUtil'

let LedgerUtil = {}
LedgerUtil.getAddress = (account, change, addressIndex) => {
  return new Promise((resolve, reject) => {
    try {
      TransportWebUSB.isSupported().then(status => {
        if (status) {
          TransportWebUSB.create().then(transport => {
            if (transport) {
              let app = new MatrixApp(transport)
              app.getAddress(account, change, addressIndex, true).then(result => {
                if (result) {
                  result.address = WalletUtil.getManAddress(WalletUtil.getAddress(result.address))
                  resolve(result)
                } else {
                  reject(new Error('get address failed'))
                }
              }).catch(err => {
                reject(err)
              })
            } else {
              reject(new Error('connection failed'))
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('no supported'))
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

LedgerUtil.sign = (tx) => {
  return new Promise((resolve, reject) => {
    try {
      TransportWebUSB.isSupported().then(status => {
        if (status) {
          TransportWebUSB.create().then(transport => {
            if (transport) {
              let app = new MatrixApp(transport)
              app.sign(0, 0, 0, tx).then(response => {
                if (response.return_code === 0x9000) {
                  resolve(response)
                } else {
                  reject(new Error('sign error'))
                }
              })
            } else {
              reject(new Error('connection failed'))
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('no supported'))
        }
      })
    } catch (e) {
      reject(new Error('error'))
    }
  })
}
export default LedgerUtil
