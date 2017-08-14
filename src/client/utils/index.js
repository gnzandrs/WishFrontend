export function getDate() {
  var d = new Date();
  var y = addZero(d.getYear());
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  return y + h + m  + s;
}
