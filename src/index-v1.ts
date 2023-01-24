import fs from 'fs';
import jszip from 'jszip';
import xlsx from 'xlsx';

import RowToColumn from '../utils/rowToColumn';
import ReadFile from '../utils/readFile';
import getEqualIndex from '../utils/getEqualIndex';
import getIncludedIndex from '../utils/getIncludedIndex';
import lowerToHigher from '../utils/compareNumber';
import columnToRow from '../utils/columnToRow';

const fct = async () => {
  let dataFileArray = '' as any;
  const files = [] as string[];
  const csvFiles = [] as string[];
  let dataFile = [] as any;

  fs.readdirSync('./').forEach((file) => {
    if (file.includes('.zip')) {
      files.push(file);
    }
  });

  const filesCreation = files.map(async (i, index) => {
    const fileContent = ReadFile(`${i}`) as Buffer;
    const jszipInstance = new jszip();
    const result = await jszipInstance.loadAsync(fileContent);
    const keys = Object.keys(result.files);

    for (let key of keys) {
      const item = result.files[key];

      if (key.toLocaleLowerCase().includes('result_lifetime') && !key.includes('DataFiles')) {
        fs.writeFileSync(`${index + 1}-${key}`, Buffer.from(await item.async('arraybuffer')));
      }
    }
  });

  await Promise.all(filesCreation);

  fs.readdirSync('./').forEach((file) => {
    if (file.includes('.csv')) {
      csvFiles.push(file);
    }
  });

  csvFiles.map(async (i) => {
    if (dataFile.length < csvFiles.length) {
      return await dataFile.push(ReadFile(`${i}`)?.toString() as string);
    }
  });

  // Create an array by splitting the CSV by newline
  dataFile = await dataFile.toString()?.trim().split(/\r?\n/);

  const outputs = [
    // '+++++++++ 1.1.1.2 Project summary table',
    // '+++++++++ 1.7.1 Project financing summary',
    // '+++++++++ 1.6.1 Investment Timeline',
    '+++++++++ 2.2 Investment Timeline - Capacity',
    // '+++++++++ 1.6.5 Microgrid costs',
    // '+++++++++ 1.2 LifeTime Cost and Emissions',
  ];

  const newOutputObject = {} as any;
  const blankIndex = getEqualIndex(dataFile, '');
  outputs.map((i: any, _index) => {
    newOutputObject[i] = getIncludedIndex(dataFile, i);
  });

  const desiredOutputs = [] as any;

  for (let key in newOutputObject) {
    newOutputObject[key].map((i: any) => {
      newOutputObject[key].push(blankIndex[blankIndex.findIndex((el) => el > i)]);
    });

    newOutputObject[key].sort(lowerToHigher);

    newOutputObject[key].map((i: any, index: any) => {
      if (index % 2 === 0) {
        newOutputObject[key][index] = dataFile?.slice(i, newOutputObject[key][index + 1]);
      }
    });

    newOutputObject[key] = newOutputObject[key].filter((_i: any, index: any) => index % 2 === 0);

    desiredOutputs.push(...newOutputObject[key]);
  }

  RowToColumn(desiredOutputs, '+++++++++ 2.2 Investment Timeline - Capacity');
  RowToColumn(desiredOutputs, '+++++++++ 1.6.1 Investment Timeline');

  const results = [] as string[];

  // CREATE A FUNCTION ///////////////////////////////////////////////////////////
  // PASS JUST ITEMS 1.6.5 AND 1.2 ///////////////////////////////////////////////
  let counterScenario = 1;

  desiredOutputs.map((i: any, _index: number) => {
    if (counterScenario > desiredOutputs.length / outputs.length) counterScenario = 1;

    i.splice(2, 0, `"Scenario ${counterScenario}"`);
    counterScenario++;
  });

  columnToRow(desiredOutputs, '+++++++++ 2.2 Investment Timeline - Capacity');
  columnToRow(desiredOutputs, '+++++++++ 1.1.1.2 Project summary table');
  columnToRow(desiredOutputs, '+++++++++ 1.7.1 Project financing summary');
  columnToRow(desiredOutputs, '+++++++++ 1.6.1 Investment Timeline');

  // desiredOutputs.map((i: any) => {
  //   if (i[0].includes('+++++++++ 1.2 LifeTime Cost and Emissions')) {
  //     i.splice(3, i.length - 4);
  //   }
  // });

  // const newDisiredOutputs = [
  //   [
  //     '"+++++++++ 1.1.1.2 Project summary table","+++++++++ 1.7.1 Project financing summary","<KEYVALUE>"',
  //     '"Source","Project Levelized Cost of Electricity - Gen Based [CURRENCY/kWh]","Project Levelized Cost of Electricity - Load Based [CURRENCY/kWh]","NPV at project end [thousand CURRENCY]","IRR at +project end [%]","Total OPEX Savings [thousand CURRENCY]","Total Emissions Reduction [MT]","DSCR at end of loan [-]","Project length","Total Financed","Total Payed Upfront","Total Tax-Equity Finance",<HEADER>',
  //     '"Scenario 1",0.1613,0.1769,1907.27,0.00,10252.23,18709.78,4.77,25.00,3301153.4950,0.0000,0.0000',
  //   ],

  //   [
  //     '"+++++++++ 1.1.1.2 Project summary table","+++++++++ 1.7.1 Project financing summary","<KEYVALUE>"',
  //     '"Source","Project Levelized Cost of Electricity - Load Based [CURRENCY/kWh]","NPV at project end [thousand CURRENCY]","IRR at +project end [%]","OPEX Savings [thousand CURRENCY]","OPEX Savings [%]","Emissions Reduction [MT]","Emissions Reduction [%]","DSCR at end of loan [-]","Total Financed","Total Payed Upfront","Total Tax-Equity Finance",<HEADER>',
  //     '"Scenario 2",0.2303,1770.49,20.36,8766.72,144.02,17733.25,-206.56,0.00,0.0000,2230056.5261,0.0000',
  //   ],

  //   // [
  //   //   '"+++++++++ 1.6.1 Investment Timeline","<TABLE>"',
  //   //   '"Source","PV","ElectricStorage",<HEADER>',
  //   //   '"Scenario 1",2126.0964,1175.0571'
  //   // ],
  //   // [
  //   //   '"+++++++++ 1.6.1 Investment Timeline","<TABLE>"',
  //   //   '"Source","PV","ElectricStorage",<HEADER>',
  //   //   '"Scenario 2",1635.2445,594.8120'
  //   // ]
  // ];

  // IT ONLY WORKS WITH 2 OR MORE FILES /////////////////////
  desiredOutputs.map((item: any) => {
    // newDisiredOutputs.map((item: any) => {
    const title = item[0].split(',')[0];
    const innerKeys = item[1]?.trim().split(',');
    innerKeys?.pop();
    // const isSummary = title.includes('summary');

    // for (let i = isSummary ? 1 : 2; i < item.length; i++) {
    for (let i = 2; i < item.length; i++) {
      let tempRow = item[i]?.trim();

      if (tempRow) {
        tempRow = tempRow.split(',');
        const tempTitle = tempRow[0]?.replace(/"/g, '');
        const innerJSON = {} as any;
        innerJSON[title?.replace(/"/g, '')] = tempTitle;

        for (let j = 1; j < tempRow.length; j++) {
          // if (isSummary) {
          // innerJSON[`Scenario ${j}`] = Number(tempRow[j]);
          // } else {
          innerJSON[innerKeys[j]?.replace(/"/g, '')] = !Number(tempRow[j]) ? 0 : Number(tempRow[j]);
          // }
        }
        results.push(innerJSON);
      }
    }
  });

  let workbook = xlsx.utils.book_new();
  let worksheet = xlsx.utils.aoa_to_sheet([]);

  xlsx.utils.book_append_sheet(workbook, worksheet);

  const headers = [] as string[][];
  let line = 1;

  results.map((i, index) => {
    if (!headers[headers.length - 1]) headers.push(Object.keys(i));
    if (index > 0) {
      if (Object.keys(i)[0] !== headers[headers.length - 1][0]) {
        headers.push(Object.keys(i));
      }
    }
  });

  headers.map((item, _ind) => {
    xlsx.utils.sheet_add_aoa(worksheet, [item], { origin: `A${line}` });
    line++;

    results.map((i, _index) => {
      if (Object.keys(i)[0] === item[0]) {
        xlsx.utils.sheet_add_aoa(worksheet, [Object.values(i)], { origin: `A${line}` });
        line++;
      }
    });
    results.shift();
  });

  // fs.unlink(csvFilePath, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  // });

  xlsx.writeFile(workbook, `Example_Output.xlsx`);
};

fct();
