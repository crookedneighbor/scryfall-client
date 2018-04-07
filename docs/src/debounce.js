module.exports = function debounce (cb, time) {
  var wait = false

  time = time || 1000

  return function (event) {
    if (wait) {
      return
    }

    var val = event.target.value

    wait = true

    cb(event)

    setTimeout(function () {
      if (val !== event.target.value) {
        cb(event)
      }
      wait = false
    }, time)
  }
}
