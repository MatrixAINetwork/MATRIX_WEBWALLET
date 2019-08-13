let Validate = {}
Validate.walletRequirePass = function (json) {
  let jsonArr
  try {
    jsonArr = JSON.parse(json)
  } catch (err) {
    throw window.i18n.t('errorMsgs.keyStoreMsg')
  }
  if (jsonArr.encseed != null) {
    return true
  } else if (jsonArr.Crypto != null || jsonArr.crypto != null) {
    return true
  } else if (jsonArr.hash != null && jsonArr.locked) {
    return true
  } else if (jsonArr.hash != null && !jsonArr.locked) {
    return false
  } else if (!jsonArr.encrypted) {
    return false
  } else {
    throw window.i18n.t('errorMsgs.keyStoreMsg')
  }
}
export default Validate
