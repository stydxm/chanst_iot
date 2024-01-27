module.exports.getTimezoneShift = () => {
    const offset = new Date().getTimezoneOffset()
    let shiftLeft = Math.floor(Math.abs(offset / 60)).toString()
    let shiftRight = Math.abs(offset % 60).toString()
    if (shiftRight.length === 1) {
        shiftRight = "0" + shiftRight
    }
    if (offset > -600 && offset < 600) {
        shiftLeft = "0" + shiftLeft
    }
    //下面没有写错，就是反过来的
    if (offset <= 0) {
        shiftLeft = "+" + shiftLeft
    } else {
        shiftLeft = "-" + shiftLeft
    }
    return shiftLeft + ":" + shiftRight
}
