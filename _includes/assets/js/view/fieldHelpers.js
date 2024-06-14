/**
 * @param {Object} args
 * @return null
 */
function initialiseFields(args) {
    var fieldsContainValues = args.fields.some(function (field) {
        return field.values.length > 0;
    });
    if (fieldsContainValues) {
        var template = _.template($("#item_template").html());

        if (!$('button#clear').length) {
            $('<button id="clear" disabled="disabled" aria-disabled="true" class="disabled">' + translations.indicator.clear_selections + ' <i class="fa fa-remove"></i></button>').insertBefore('#fields');
        }

        $('#fields').html(template({
            fields: args.fields,
            allowedFields: args.allowedFields,
            childFields: _.uniq(args.edges.map(function (edge) { return edge.To })),
            edges: args.edges
        }));

        $(OPTIONS.rootElement).removeClass('no-fields');

    } else {
        $(OPTIONS.rootElement).addClass('no-fields');
    }
}

/**
 * @return null
 */
function updateWithSelectedFields() {
    MODEL.updateSelectedFields(_.chain(_.map($('#fields input:checked'), function (fieldValue) {
        return {
            value: $(fieldValue).val(),
            field: $(fieldValue).data('field')
        };
    })).groupBy('field').map(function (value, key) {
        return {
            field: key,
            values: _.map(value, 'value')
        };
    }).value());
}

/**
 * @param {Element} fieldGroupElement
 * @return null
 */
function sortFieldGroup(fieldGroupElement) {
    var sortLabels = function (a, b) {
        var aObj = { hasData: $(a).attr('data-has-data'), text: $(a).text() };
        var bObj = { hasData: $(b).attr('data-has-data'), text: $(b).text() };
        if (aObj.hasData == bObj.hasData) {
            return (aObj.text > bObj.text) ? 1 : -1;
        }
        return (aObj.hasData < bObj.hasData) ? 1 : -1;
    };
    fieldGroupElement.find('label')
        .sort(sortLabels)
        .appendTo(fieldGroupElement.find('#indicatorData .variable-options'));
}

/**
 * @param {Array} tsAttributeValues
 *   Array of objects containing 'field' and 'value'.
 * @return null
 */
function updateTimeSeriesAttributes(tsAttributeValues) {
    var timeSeriesAttributes = {{ site.time_series_attributes | jsonify }};
    timeSeriesAttributes.forEach(function(tsAttribute) {
        var field = tsAttribute.field,
            valueMatch = tsAttributeValues.find(function(tsAttributeValue) {
                return tsAttributeValue.field === field;
            }),
            value = (valueMatch) ? valueMatch.value : '',
            $labelElement = $('dt[data-ts-attribute="' + field + '"]'),
            $valueElement = $('dd[data-ts-attribute="' + field + '"]');

        if (!value) {
            $labelElement.hide();
            $valueElement.hide();
        }
        else {
            $labelElement.show();
            $valueElement.show().text(translations.t(value));
        }
    });
}

/**
 * @param {Array} obsAttributes
 *   Array of objects containing 'field' and 'value'.
 * @return null
 */
function updateObservationAttributes(obsAttributes) {

    var $listElement = $('.observation-attribute-list');

    $listElement.empty();

    if (obsAttributes.length === 0) {
        $listElement.hide();
        return;
    }
    $listElement.show();
    Object.values(obsAttributes).forEach(function(obsAttribute) {
        var test = $listElement.toString();
        var label = getObservationAttributeText(obsAttribute),
            num = obsAttribute.footnoteNumber;//getObservationAttributeFootnoteSymbol(obsAttribute.footnoteNumber);
        //var $listItem = $('<dt id="observation-footnote-title-' + num + '">' + num + '</dt><dd id="observation-footnote-desc-' + num + '">' + label + '</dd>');
        if (num == 0){
          var $listItem = $('<dt><u>' + translations.t('symbols') + '</u>:</dt>');
          $listElement.append($listItem);
        };
        console.log("x3: ",test);
        var x = '<br>';
        if (label.includes(';')) {
          var single_labels = label.split(';');
          for (let i = 0; i < single_labels.length; i++){
            if (i !== 0) {
              var x = ''};
            console.log("x4: ",test);
            var $listItem = $('<dd id="observation-footnote-desc-' + num + '">' + single_labels[i] + ': ' +  translations.t('+++' + single_labels[i]) + '</dd>');
            if (!test.includes($listItem)){
              $listElement.append($listItem);
            };
            console.log("x5: ",test);
          };
        }
        else
          var $listItem = $('<dd id="observation-footnote-desc-' + num + '">' + obsAttribute.value + ': ' + translations.t('+++' + label) + '</dd>');
          console.log("x6: ",test);
          if (!test.includes($listItem)){
            $listElement.append($listItem);
            console.log("x7: ",test);
          var x = '';
          }
    });
}

/**
 * Gets the text of an observation attribute for display to the end user.
 */
function getObservationAttributeText(obsAttribute) {
    console.log("obsAttribute: ",obsAttribute);
    var configuredObsAttributes = {{ site.observation_attributes | jsonify }};
    var attributeConfig = _.find(configuredObsAttributes, function(configuredObsAttribute) {
        return configuredObsAttribute.field === obsAttribute.field;
    });
    if (!attributeConfig) {
        return '';
    }
    var label = obsAttribute.value; //translations.t(obsAttribute.value);
    if (attributeConfig.label) {
        label = label + ':' + translations.t(attributeConfig.label);
    }
    return label;
}
