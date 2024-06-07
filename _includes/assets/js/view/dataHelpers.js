/**
 * @param {null|undefined|Float|String} value
 * @param {Object} info
 * @param {Object} context
 * @param {Object} additionalInfo
 * @return {null|undefined|Float|String}
 */
function alterDataDisplay(value, info, context, additionalInfo) {
    // If value is empty, we will not alter it.
    if (value == null || value == undefined) {
        return value;
    }
    // Before passing to user-defined dataDisplayAlterations, let's
    // do our best to ensure that it starts out as a number.
    var altered = value;
    // In case the decimal separator has already been applied,
    // change it back now.
    if (typeof altered === 'string' && OPTIONS.decimalSeparator) {
        altered = altered.replace(OPTIONS.decimalSeparator, '.');
    }
    if (typeof altered !== 'number') {
        altered = Number(altered);
    }
    // If that gave us a non-number, return original.
    if (isNaN(altered)) {
        return value;
    }
    // Now go ahead with user-defined alterations.
    opensdg.dataDisplayAlterations.forEach(function (callback) {
        altered = callback(altered, info, context);
    });
    // Now apply our custom precision control if needed.

    // Special treatment for numbers on y axis: If stepSize is defined, they should display decimal places as follows:
    // StepSize >= 1 --> 0 decimal places, Stepsize >= 0.1 --> 1 decimal place, StepSize >= 0.01 --> 2 decimal places ...
    if (context == 'chart y-axis tick' && VIEW._graphStepsize && VIEW.graphStepsize != 0 && VIEW.graphStepsize != '') {
      precision = Math.ceil(Math.log(1 / VIEW._graphStepsize.step) / Math.LN10);
      if (precision < 0) {
        precision = 0
      }
    }

    else {
      var precision = VIEW._precision
    }
    if (precision || precision === 0) {
        altered = Number.parseFloat(altered).toFixed(precision);
    }
    // Now apply our custom decimal separator if needed.
    if (OPTIONS.decimalSeparator) {
        altered = altered.toString().replace('.', OPTIONS.decimalSeparator);
    }
    // Apply thousands seperator if needed
    if (OPTIONS.thousandsSeparator && precision <=3){
        altered = altered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, OPTIONS.thousandsSeparator);
    }
    // Now let's add any footnotes from observation attributes.
    var obsAttributes = [];
    if (context === 'chart tooltip') {
        var dataIndex = additionalInfo.dataIndex;
        obsAttributes = info.observationAttributes[dataIndex];
    }
    else if (context === 'table cell') {
        var row = additionalInfo.row,
            col = additionalInfo.col,
            obsAttributesTable = additionalInfo.observationAttributesTable;
        obsAttributes = obsAttributesTable.data[row][col];
    }
    if (obsAttributes.length > 0) {
        var obsAttributeFootnoteNumbers = obsAttributes.map(function(obsAttribute) {
            return getObservationAttributeFootnoteSymbol(obsAttribute);
        });
        altered += ' ' + obsAttributeFootnoteNumbers.join(' ');
    }
    return altered;
}

/**
 * Convert a number into a string for observation atttribute footnotes.
 *
 * @param {int} num
 * @returns {string} Number converted into unicode character for footnotes.
 */
function getObservationAttributeFootnoteSymbol(obsAttribute) {
    return obsAttribute.value;
    //return '[' + translations.indicator.note + ' ' + (num + 1) + ']';
}
