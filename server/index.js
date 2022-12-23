const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require('ethereum-cryptography/secp256k1');

app.use(cors());
app.use(express.json());

let balances = {
  "04bdc7b4d3c081ea8de3524302c02d30cc592d1ce274baeae370b910d6b96dd1f8e7284fd44e117dee5f1c1b6bf539d196123cbed5db31d16f4c4e3ab3daaead08": 100,
  "04c56b8e9803871493c44f7231b018b54a154f16687148d123601034eb8fb07d372124a8feaa7ea836e80448b895667545337a5f033c5fc20f5c493bc95ea4d07b": 50,
  "0482666673ffc68a90e19a0d438ea751f71405dffe0cec517e556d19c960a8abe5d57d2ed3748756192e48b827fddb678ffa74108b55e1fc936f83bedf6c0ecfb6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, messageHash } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);


  // verify the signature using the message hash and the sender's public key
  const senderPublicKey = secp.ecrecover(messageHash, signature);
  if (senderPublicKey !== secp.getPublicKey(sender)) {
    return res.status(401).send({ message: "Invalid signature" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/verify", (req, res) => {
  const { signature, messageHash } = req.body;
  const recoveredPublicKey = secp.ecrecover(messageHash, signature);

  if (recoveredPublicKey === originalPublicKey) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
