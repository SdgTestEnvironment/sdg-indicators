//
opensdg.dataRounding = function(value) {
  if (value == null) {
    return value
  }
  else {
    //return value.toPrecision(3)
    return value.toFixed(2)
  }
};

//opensdg.dataRounding = function(value) {
//  return Math.round(value * 100) / 100;
