generatePDF = function () {
  // Choose the element that our invoice is rendered in.
  const element = getElementById('headerBanner');
  // Choose the element and save the PDF for our user.
  html2pdf().from(element).save();
}
