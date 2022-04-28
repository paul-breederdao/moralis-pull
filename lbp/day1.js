const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream(`${__dirname}/data/day1.csv`);
const ethers = require("ethers");

/* import moralis */
const Moralis = require("moralis/node");

/* Moralis init code */
const serverUrl = "";
const appId = "";
const masterKey = "";

async function lbpBuyerDay1() {
  await Moralis.start({ serverUrl, appId, masterKey });

  const TransferFromVault = Moralis.Object.extend("TransferFromVault");

  const query = new Moralis.Query(TransferFromVault);
  query.limit(1000);
  query.ascending("transaction_index");

  const results = await query.find();
  console.log(`query size: ${results.length}`);

  const data = [];
  for (let i = 0; i < results.length; i++) {
    // This does not require a network access.
    const transactionIndex = results[i].get("transaction_index");
    const blockHash = results[i].get("block_hash");
    const blockTimestamp = results[i].get("block_timestamp");
    const from = results[i].get("from");
    const to = results[i].get("to");
    const value = results[i].get("value");
    data.push({
      index: i + 1,
      from,
      to,
      value: ethers.utils.formatEther(value).toString(),
      blockTimestamp,
      blockHash,
    });
  }

  fastcsv.write(data, { headers: true }).pipe(ws);
}

lbpBuyerDay1();
