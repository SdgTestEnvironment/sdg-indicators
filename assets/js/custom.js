//
opensdg.dataRounding = function(value) {
  if (value == null) {
    return value
  }
  else {
    //5 555 --> 5 560; 34,56 --> 34,6; 3,4 --> 3,40; 1 --> 1,00
    //return value.toPrecision(3)

    ////5 555 --> 5 555,00; 34,56 --> 34,65; 3,4 --> 3,40; 1 --> 1,00
    //return value.toFixed(2)

    return value
  }
};


opensdg.dataRoundingDp = function(value, dcmplc) {
  if (value == null) {
    return value
  }
  else {
    return value.toFixed(dcmplc)
  }
};



const visits = document.getElementById('visits');

updateVisitCount();

function updateVisitCount(){
  fetch('https://api.countapi.xyz/update/sdgtestenvironment/main?amount=1')
    .then(res => res.json())
    .then(res => {
      totalCalls.innerHTML = res.value;
    });
}


function updateVisitCountMinus(){
  fetch('https://api.countapi.xyz/update/sdgtestenvironment/main?amount=-1')
}
