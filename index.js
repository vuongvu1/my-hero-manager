require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const creds = require("./credentials.json");

const writeContent = (rowData) => {
  const content = `
    const Heroes = ${JSON.stringify(rowData)};
    export default Heroes;
  `;

  console.log("Writing to file...");

  fs.writeFile("output/index.js", content, function (err) {
    if (err) return console.log(err);
  });

  console.log("DONE!");
};

const main = async () => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  console.log(`Sheet: ${doc.title}`);

  const sheet = doc.sheetsByTitle[process.env.GOOGLE_SHEET_TITLE];
  console.log(`Title: ${sheet.title}`);

  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();
  const formattedRows = rows.map((row) => ({
    Name: row.Name,
    Attribute: row.Attribute,
    "Attack type": row["Attack type"],
  }));

  writeContent(formattedRows);
};

main();
