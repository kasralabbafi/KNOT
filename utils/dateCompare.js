module.exports = function isValid(expireDate) {
    if(new Date(Date.now()) > expireDate) {
        return true
    }

    return false
}