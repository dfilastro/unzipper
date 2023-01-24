import fs from 'fs';

export default function ReadFile(name: string) {
  try {
    return fs.readFileSync(`${name}`);
  } catch (error) {
    console.log('Make sure there is a file called "Result_Lifetime002.csv" in the zip file');
  }
}
