export default function RowToColumn(outputs: string[][], item: string) {
  let counter = 0;

  outputs.map((i: string[], index: number) => {
    if (i[0].includes(item)) {
      const finalArray = [];
      counter++;

      i.splice(2, 1);

      console.log(i);

      // HEADER
      finalArray.push(i[0]);

      const keys = i.map((item) => {
        return item.split(',')[0];
      });

      keys.push('<HEADER>');
      keys.shift();
      keys.unshift('"Source"');

      // SUBHEADER
      finalArray.push(keys.toString());

      // BODY
      const values = i.map((item, _index) => {
        return item.split(',')[1];
      });

      values.splice(0, 1, `"Scenario ${counter}"`);
      const stringValues = values.toString();

      finalArray.push(stringValues);

      return (outputs[index] = finalArray);
    }
  });
}
