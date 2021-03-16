import fs from "fs";

export const saveToFile = (
  data: {},
  fileName: string,
  minify: boolean = true
) => {
  const dataString = minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  fs.writeFileSync(`db/${fileName}`, dataString);
  console.log(`Data saved to ${fileName}`);
};
