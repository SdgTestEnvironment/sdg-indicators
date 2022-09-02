/**
 * @param {null|undefined|Float|String} value
 * @param {Object} info
 * @param {Object} context
 * @return {null|undefined|Float|String}
 */
function alterDataDisplay(value, info, context) {
    // If value is empty, we will not alter it.
    if (value == null || value == undefined) {
        return value;
    }
    // Before passing to user-defined dataDisplayAlterations, let's
    // do our best to ensure that it starts out as a number.
    var altered = value;
    if (typeof altered !== 'number') {
        altered = Number(value);
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
    if (context == 'chart y-axis tick') {
      precision = 0
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
    if (OPTIONS.thousandsSeparator){
        altered = altered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, OPTIONS.thousandsSeparator);
    }

    return altered;
}
