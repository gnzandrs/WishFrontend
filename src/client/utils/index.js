function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function getDate() {
  var d = new Date();
  var y = addZero(d.getYear());
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  return y + h + m  + s;
}
