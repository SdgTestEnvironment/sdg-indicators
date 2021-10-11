var generatePDF = function () {
  // Choose the element that our invoice is rendered in.
  const element = document.getElementById('indicatorTitle');
  //<div class="container">
  //document.getElementById('chart-canvas'),
  // Choose the element and save the PDF for our user.
  html2pdf().from(element).save();
}
