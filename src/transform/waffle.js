const assign = require('lodash/assign');
const each = require('lodash/each');
const forIn = require('lodash/forIn');
const keys = require('lodash/keys');
const map = require('lodash/map');
const pick = require('lodash/pick');
const {
  sum
} = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  fields: [ 'name', 'value' ], // fields
  rows: 5,
  size: [ 1, 1 ],
  scale: 1,
  groupBy: [],
  maxCount: 1000,
  gapRatio: 0.1,
  as: [ 'x', 'y' ]
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  const [ nameField, valueField ] = fields;
  const groupBy = options.groupBy;
  const groups = partition(dataView.rows, groupBy);
  const groupKeys = keys(groups);
  const [ width, height ] = options.size;
  const maxCount = options.maxCount;
  const groupCount = groupKeys.length;
  const partHeight = height / groupCount;
  const rows = options.rows;
  const result = [];
  let scale = options.scale;
  let currentGroupIndex = 0;

  forIn(groups, group => {
    const heightRange = [ currentGroupIndex * partHeight, (currentGroupIndex + 1) * partHeight ];
    const h = heightRange[1] - heightRange[0];
    const hStep = h / rows;
    const totalValue = sum(map(group, row => row[valueField]));
    if (totalValue * scale > maxCount) {
      scale = maxCount / totalValue;
    }
    const cols = Math.ceil(totalValue * scale / rows);
    const wStep = width / cols;
    let currentCol = 0;
    let currentRow = 0;
    each(group, row => {
      const value = row[valueField];
      const count = Math.round(value * scale);
      for (let i = 0; i < count; i++) {
        if (currentRow === rows) {
          currentRow = 0;
          currentCol++;
        }
        const resultRow = pick(row, [ nameField, valueField ].concat(groupBy));
        resultRow.x = currentCol * wStep + wStep / 2;
        resultRow.y = currentRow * hStep + hStep / 2 + heightRange[0];
        currentRow++;
        result.push(resultRow);
      }
    });
    currentGroupIndex += 1;
  });

  dataView.rows = result;
}

registerTransform('waffle', transform);

