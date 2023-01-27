export default function RowToColumn(outputs: string[][], item: string) {
  let counter = 0;
  let keyss = [] as any;

  outputs.map((i: string[], _index: number) => {
    if (i[0].includes(item)) {
      i.splice(2, 1);

      const keys = i.map((item) => {
        return item.split(',')[0];
      });

      keys.shift();
      keys.unshift('"Source"');

      keyss = [...new Set([...keyss, ...keys])];
    }
  });

  keyss.push('<HEADER>');

  outputs.map((i: string[], index: number) => {
    if (i[0].includes(item)) {
      const finalArray = [];
      counter++;

      // HEADER
      finalArray.push(i[0]);

      const keys = i.map((item) => {
        return item.split(',')[0];
      });

      // SUBHEADER
      finalArray.push(keyss.toString());

      // BODY
      const objectValues = {} as any;

      for (let counter = 0; counter < i.length; counter++) {
        const split = i[counter].split(',');
        objectValues[split[0]] = split[1];
      }

      const newTest = [] as any;

      for (let counter = 0; counter < keyss.length; counter++) {
        if (keys.indexOf(keyss[counter]) > -1) {
          newTest.push(keyss[counter]);
        } else {
          newTest.push(' ');
        }
      }

      const values = [] as any;

      newTest.map((i: any) => {
        if (Object.keys(objectValues).indexOf(i) > -1) {
          values.push(objectValues[i]);
        } else {
          values.push('0');
        }
      });

      values.shift();
      values.splice(0, 0, `"Scenario ${counter}"`);
      values.pop();
      const stringValues = values.toString();

      finalArray.push(stringValues);

      return (outputs[index] = finalArray);
    }
  });
}
