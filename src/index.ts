import fs from 'fs';
import { Readable } from 'stream';
import readline from 'readline';
import jszip from 'jszip';
import xlsx from 'xlsx';

import assert from 'assert';
import { parse } from 'csv-parse';

import RowToColumn from '../utils/rowToColumn';
import ReadFile from '../utils/readFile';

const fct = async () => {
  let files = [] as string[];
  try {
    fs.readdirSync('./').forEach((file) => {
      if (file.includes('.zip')) {
        files.push(file);
      }
    });

    files.map(async (i, _index) => {
      const fileContent = ReadFile(`${i}`) as any;
      const jszipInstance = new jszip();
      const result = await jszipInstance.loadAsync(fileContent);
      const keys = Object.keys(result.files);

      for (let key of keys) {
        const item = result.files[key];

        if (
          item.name.toLocaleLowerCase().includes('result_lifetime') &&
          !item.name.includes('DataFiles')
        ) {
          fs.writeFileSync(item.name, Buffer.from(await item.async('arraybuffer')));
        }
      }

      const csvFilePath = 'Result_Lifetime002.csv';

      //   let dataFile = ReadFile(`${csvFilePath}`)?.toString() as any;
      let dataFile = ReadFile(`${csvFilePath}`) as any;
      //   dataFile = dataFile.trim().split(/\r?\n/);

      const outputs = [
        '+++++++++ 1.1.1.2 Project summary table',
        '+++++++++ 1.7.1 Project financing summary',
        '+++++++++ 1.6.1 Investment Timeline',
        '+++++++++ 2.2 Investment Timeline - Capacity',
        '+++++++++ 1.2 LifeTime Cost and Emissions',
        '+++++++++ 1.6.5 Microgrid costs',
      ];

      ////////////////////////////////////////////////////////////
      var results = [] as any;

      fs.createReadStream('Result_Lifetime002.csv')
        .pipe(
          parse({
            relax_column_count: true,
            delimiter: ['<KEYVALUE>', '<TABLE>', ',', '<HEADER>', '/\r?\n/'],
          })
        )
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log(results);
        });

      console.log(results);
      //////////////////////////////////////////////////////////////////////////
      // const readableFile = new Readable();
      // readableFile.push(dataFile);
      // readableFile.push(null);

      // const fileLine = readline.createInterface({
      //   input: readableFile,
      // }) as any;

      // const results = [] as any;
      // let countLine = 0;

      // // const desiredOutputs = outputs.map((i) => {
      // //   const inicialIndex = dataFile.findIndex((el: string) => el.includes(i));
      // //   const slicedArray = dataFile.slice(inicialIndex);
      // //   const finalIndex = slicedArray.indexOf('');

      // //   return slicedArray.slice(0, finalIndex);
      // // });

      // let indexes = [] as number[];

      // for await (const line of fileLine) {
      //   countLine++;
      //   const fileLineSplit = line.trim().replace(/"/g, '').split(',');

      //   // console.log(line);

      //   if (line.includes(outputs[0])) {
      //     indexes.push(countLine);
      //   }

      //   if (countLine > 30 && countLine < 34) {
      //     // console.log(`${countLine} - ${line}`);

      //     // console.log(`Passou aqui ${countLine} - ${line}`);
      //     results.push(fileLineSplit);
      //   }

      //   if (line.includes(outputs[0])) {
      //     // console.log(fileLineSplit.indexOf(line));
      //   }

      //   // console.log(fileLineSplit);
      // }
      // console.log(results);

      //////////////////////////////////////////////////////////////////////////

      //   // Create an array by splitting the CSV by newline
      //   dataFile = dataFile.trim().split(/\r?\n/);

      //   const outputs = [
      //     '+++++++++ 1.1.1.2 Project summary table',
      //     '+++++++++ 1.7.1 Project financing summary',
      //     '+++++++++ 1.6.1 Investment Timeline',
      //     '+++++++++ 2.2 Investment Timeline - Capacity',
      //     '+++++++++ 1.2 LifeTime Cost and Emissions',
      //     '+++++++++ 1.6.5 Microgrid costs',
      //   ];

      //   const desiredOutputs = outputs.map((i) => {
      //     const inicialIndex = dataFile.findIndex((el: string) => el.includes(i));
      //     const slicedArray = dataFile.slice(inicialIndex);
      //     const finalIndex = slicedArray.indexOf('');

      //     return slicedArray.slice(0, finalIndex);
      //   });

      //   RowToColumn(desiredOutputs, '+++++++++ 1.6.1 Investment Timeline');
      //   RowToColumn(desiredOutputs, '+++++++++ 2.2 Investment Timeline - Capacity');

      //   const results = [] as string[];

      //   desiredOutputs.map((item) => {
      //     const title = item[0].split(',')[0];
      //     const innerKeys = item[1]?.trim().split(',');
      //     innerKeys?.pop();
      //     const isSummary = title.includes('summary');

      //     for (let i = isSummary ? 1 : 2; i < item.length; i++) {
      //       let tempRow = item[i].trim();

      //       if (tempRow) {
      //         tempRow = tempRow.split(',');
      //         const tempTitle = tempRow[0]?.replace(/"/g, '');
      //         const innerJSON = {} as any;
      //         innerJSON[title?.replace(/"/g, '')] = tempTitle;

      //         for (let j = 1; j < tempRow.length; j++) {
      //           if (isSummary) {
      //             innerJSON[`Scenario ${j}`] = Number(tempRow[j]);
      //           } else {
      //             innerJSON[innerKeys[j]?.replace(/"/g, '')] = !Number(tempRow[j])
      //               ? 0
      //               : Number(tempRow[j]);
      //           }
      //         }

      //         results.push(innerJSON);
      //       }
      //     }
      //   });

      //   let workbook = xlsx.utils.book_new();
      //   let worksheet = xlsx.utils.aoa_to_sheet([]);
      //   // let worksheet = xlsx.utils.json_to_sheet([]);

      //   xlsx.utils.book_append_sheet(workbook, worksheet);

      //   const headers = [] as string[][];
      //   let line = 1;

      //   results.map((i, _index) => {
      //     if (!headers[headers.length - 1]) headers.push(Object.keys(i));

      //     if (Object.keys(i)[0] !== headers[headers.length - 1][0]) {
      //       headers.push(Object.keys(i));
      //     }
      //   });

      //   headers.map((item, _ind) => {
      //     xlsx.utils.sheet_add_aoa(worksheet, [item], { origin: `A${line}` });
      //     line++;

      //     results.map((i, _index) => {
      //       if (Object.keys(i)[0] === item[0]) {
      //         xlsx.utils.sheet_add_aoa(worksheet, [Object.values(i)], { origin: `A${line}` });
      //         line++;
      //       }
      //     });
      //     results.shift();
      //   });

      //   // xlsx.writeFile(workbook, `${i.slice(0, -4)}_Output.xlsx`);

      //   fs.unlink(csvFilePath, (err) => {
      //     if (err) {
      //       throw err;
      //     }
      //   });
      //   xlsx.writeFile(workbook, `File_Output.xlsx`);
    });
  } catch (error) {
    // console.log('Something went wrong, check out the messages above');
    console.log(error);
  }
};

fct();
