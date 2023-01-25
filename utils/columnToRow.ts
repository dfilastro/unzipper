export default function RowToColumn(outputs: string[][], item: string) {
  let counter = 0;
  let keyss = [] as any;

  outputs.map((i: string[], index: number) => {
    if (i[0].includes(item)) {
      const finalArray = [];
      counter++;

      i.splice(2, 1);

      // HEADER
      finalArray.push(i[0]);

      const keys = i.map((item) => {
        return item.split(',')[0];
      });

      keys.push('<HEADER>');
      keys.shift();
      keys.unshift('"Source"');

      //  JOIN ALL THE KEYS AND REMOVE DUPLICATES
      // new Set([...arr1. ...arr2])

      // https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items

      if (keyss.length === 0) {
        keyss = [...keys];
      }

      if (keyss.length < keys.length) {
        keyss = [...keys];
      }

      // SUBHEADER
      finalArray.push(keyss.toString());

      // BODY
      const values = i.map((item, _index) => {
        return item.split(',')[1];
      });

      keys.map((i: any, index: number) => {
        if (i !== keyss[index] && i !== '<HEADER>' && i !== '<KEYVALUE>') {
          return values.splice(values.length - 1, 0, '0');
        }
      });

      console.log(keys);
      console.log(keyss);
      values.splice(0, 1, `"Scenario ${counter}"`);
      const stringValues = values.toString();

      finalArray.push(stringValues);

      return (outputs[index] = finalArray);
    }
  });
}
