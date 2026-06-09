const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

async function exportJSON(results) {

  return Buffer.from(
    JSON.stringify(
      results,
      null,
      2
    )
  );

}

async function exportCSV(results) {

  const parser =
    new Parser();

  const csv =
    parser.parse(results);

  return Buffer.from(csv);

}

async function exportExcel(results) {

  const workbook =
    new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet(
      'OCR Results'
    );

  sheet.columns = [

    {
      header: 'Text',
      key: 'text',
      width: 40
    },

    {
      header: 'Confidence (%)',
      key: 'confidence',
      width: 15
    },

    {
      header: 'Color Name',
      key: 'colorName',
      width: 20
    },

    {
      header: 'Hex Color',
      key: 'backgroundColor',
      width: 20
    },

    {
      header: 'RGB',
      key: 'rgb',
      width: 20
    },

    {
      header: 'X',
      key: 'x',
      width: 10
    },

    {
      header: 'Y',
      key: 'y',
      width: 10
    },

    {
      header: 'Width',
      key: 'width',
      width: 10
    },

    {
      header: 'Height',
      key: 'height',
      width: 10
    }

  ];

  results.forEach(item => {

    sheet.addRow({

      text:
        item.text || '',

      confidence:
        item.confidence || 0,

      colorName:
        item.colorName || '',

      backgroundColor:
        item.backgroundColor || '',

      rgb:
        Array.isArray(item.rgb)
          ? item.rgb.join(',')
          : '',

      x:
        item.bbox?.x || '',

      y:
        item.bbox?.y || '',

      width:
        item.bbox?.width || '',

      height:
        item.bbox?.height || ''

    });

  });

  return await workbook.xlsx.writeBuffer();

}

module.exports = {

  exportJSON,

  exportCSV,

  exportExcel

};