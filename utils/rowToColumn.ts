export default function RowToColumn(outputs: string[][], item: string) {
  let counter = 0;

  outputs.map((i: string[], index: number) => {
    if (i[0].includes(item)) {
      const itemColumnToRow = outputs[index].map((i: string) => i.trim().split(','));
      const itemEraseUnecessaryColumns = itemColumnToRow.map((i: string[], _index: number) => {
        return i.slice(0, 2);
      });

      const itemTimelineColumn = itemEraseUnecessaryColumns.map((i: string[], index: number) => {
        if (index === 0) counter++;
        return i.join().toString();
        // return i.join().toString().replace('Timeline', `Timeline summary - Scenario ${counter}`);
      });

      itemTimelineColumn[2].includes('OPEX')
        ? itemTimelineColumn.splice(1, 2)
        : itemTimelineColumn.splice(1, 1);

      return (outputs[index] = itemTimelineColumn);
    }
  });
}
