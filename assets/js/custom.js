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


const totalCalls = document.getElementById('totalCalls');
const btnClicks = document.getElementById('btnClicks');
const visits = document.getElementById('visits');
var total;
updateVisitCount();
function updateVisitCount(){
  fetch('https://api.countapi.xyz/update/sdgtestenvironment/main?amount=1')
    .then(res => res.json())
    .then(res => {
      totalCalls.innerHTML = res.value;

    })
    .then(data => total = data);

  fetch('https://api.countapi.xyz/get/sdgtestenvironment/goalitems')
    .then(res => res.json())
    .then(res => {
      btnClicks.innerHTML = res.value;
      const substract = res.value;
    });
  visits.innerHTML = total;
}



function updateVisitCountMinus(){
  fetch('https://api.countapi.xyz/update/sdgtestenvironment/goalitems?amount=1')
}
