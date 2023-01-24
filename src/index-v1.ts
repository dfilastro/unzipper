import fs from 'fs';
import jszip from 'jszip';
import xlsx from 'xlsx';

import RowToColumn from '../utils/rowToColumn';
import ReadFile from '../utils/readFile';
import getEqualIndex from '../utils/getEqualIndex';
import getIncludedIndex from '../utils/getIncludedIndex';
import lowerToHigher from '../utils/compareNumber';

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

  files.map(async (i, index) => {
    const fileContent = ReadFile(`${i}`) as Buffer;
    const jszipInstance = new jszip();
    const result = await jszipInstance.loadAsync(fileContent);
    const keys = Object.keys(result.files);

    for (let key of keys) {
      const item = result.files[key];

      if (key.toLocaleLowerCase().includes('result_lifetime') && !key.includes('DataFiles')) {
        // fs.writeFileSync(item.name, Buffer.from(await item.async('arraybuffer')));
        fs.writeFileSync(`${index + 1}-${key}`, Buffer.from(await item.async('arraybuffer')));
        // return csvFiles.push(`${index + 1}-${key}`);
      }
    }
  });

  fs.readdirSync('./').forEach((file) => {
    if (file.includes('.csv')) {
      csvFiles.push(file);
    }
  });

  // const csvFilePath = 'Result_Lifetime002.csv';

  csvFiles.map((i) => {
    if (dataFile.length < csvFiles.length) {
      return dataFile.push(ReadFile(`${i}`)?.toString() as string);
    }
  });

  // let dataFile = ReadFile(`${csvFilePath}`)?.toString() as any;

  // Create an array by splitting the CSV by newline

  dataFile = dataFile.toString()?.trim().split(/\r?\n/);

  const outputs = [
    '+++++++++ 1.1.1.2 Project summary table',
    '+++++++++ 1.7.1 Project financing summary',
    '+++++++++ 1.6.1 Investment Timeline',
    '+++++++++ 2.2 Investment Timeline - Capacity',
    '+++++++++ 1.2 LifeTime Cost and Emissions',
    '+++++++++ 1.6.5 Microgrid costs',
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
  // const kes = [] as any;
  // const values = [] as any;

  // desiredOutputs.map((i: any, ind: any) => {
  //   if (i[0].includes('+++++++++ 1.6.1 Investment Timeline')) {
  //     let arrValues = [] as any;
  //     i.map((item: any, index: number) => {
  //       kes.push(item.split(',')[0].replace('Timeline summary', 'Timeline'));
  //       arrValues.push(item.split(',')[1]);

  //       if (i.length === index + 1) {
  //         values.push(arrValues);
  //         arrValues = [];
  //       }
  //     });

  //     desiredOutputs[ind] = [kes.split(0, 2).toString(), values.toString()];
  //   }
  // });
  // // CRIAR UMA NOVA VARIÁVEL COM OS VALORES DESEJADOS AO INVÉS DE FICAR TENTANDO MUDAR O DESIREDOUTPUTS
  // const newArrTest = [] as any;

  // newArrTest.push(kes.toString());
  // values.map((i: any, index: number) => {
  //   newArrTest.push(i.toString().replace('<TABLE>', `Scenario ${index + 1}`));
  // });

  // desiredOutputs.map((i: any, index: number) => {
  //   if (i[0].includes(newArrTest[0])) {
  //     // console.log(desiredOutputs[index]);
  //     // console.log(newArrTest);
  //     desiredOutputs[index] = newArrTest;
  //   }
  // });
  // console.log(newArrTest);
  // console.log(getIncludedIndex([...desiredOutputs], '+++++++++ 1.6.1 Investment Timeline'));
  // desiredOutputs.splice(4, 1);

  console.log(desiredOutputs);
  // console.log(kes);
  // console.log(values);

  desiredOutputs.map((item: any) => {
    const title = item[0].split(',')[0];
    const innerKeys = item[1]?.trim().split(',');
    innerKeys?.pop();
    const isSummary = title.includes('summary');

    for (let i = isSummary ? 1 : 2; i < item.length; i++) {
      let tempRow = item[i].trim();

      if (tempRow) {
        tempRow = tempRow.split(',');
        const tempTitle = tempRow[0]?.replace(/"/g, '');
        const innerJSON = {} as any;
        innerJSON[title?.replace(/"/g, '')] = tempTitle;

        for (let j = 1; j < tempRow.length; j++) {
          if (isSummary) {
            innerJSON[`Scenario ${j}`] = Number(tempRow[j]);
          } else {
            innerJSON[innerKeys[j]?.replace(/"/g, '')] = !Number(tempRow[j])
              ? 0
              : Number(tempRow[j]);
          }
        }
        results.push(innerJSON);
      }
    }
  });

  // console.log(results);
  let workbook = xlsx.utils.book_new();
  let worksheet = xlsx.utils.aoa_to_sheet([]);

  xlsx.utils.book_append_sheet(workbook, worksheet);

  const headers = [] as string[][];
  let line = 1;

  results.map((i, _index) => {
    if (!headers[headers.length - 1]) headers.push(Object.keys(i));

    if (Object.keys(i)[0] !== headers[headers.length - 1][0]) {
      headers.push(Object.keys(i));
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
