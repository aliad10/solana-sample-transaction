const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  PublicKey,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58").default;
const private_key = process.env.PRIVATE_KEY;
(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const sender = Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(private_key))
  );

  const recipient = new PublicKey(process.env.RECIPIENT);

  let senderBalanceBefore = await connection.getBalance(sender.publicKey);
  let recipientBalanceBefore = await connection.getBalance(recipient);

  console.log(
    "sender balance before: ",
    senderBalanceBefore / LAMPORTS_PER_SOL
  );
  console.log(
    "recipient balance before: ",
    recipientBalanceBefore / LAMPORTS_PER_SOL
  );

  // Create the transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipient,
      lamports: 0.01 * LAMPORTS_PER_SOL, // Send 0.01 SOL
    })
  );

  // Sign and send
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    sender,
  ]);

  let senderBalanceAfter = await connection.getBalance(sender.publicKey);
  let recipientBalanceAfter = await connection.getBalance(recipient);

  console.log("sender balance after: ", senderBalanceAfter / LAMPORTS_PER_SOL);
  console.log(
    "recipient balance after: ",
    recipientBalanceAfter / LAMPORTS_PER_SOL
  );

  console.log("Transaction successful! Signature:", signature);
})();
