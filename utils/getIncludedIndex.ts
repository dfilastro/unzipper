export default function getIncludedIndex(arr: string[], val: string) {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i].includes(val)) indexes.push(i);
  return indexes;
}
