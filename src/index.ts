import web3 = require("@solana/web3.js");
import bs58 = require("bs58");
import Dotenv from "dotenv";
Dotenv.config();

const initializeKeypair = (): web3.Keypair => {
	const privateKey = process.env.PRIVATE_KEY ?? "";
	const secretKey = bs58.decode(privateKey);
	const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
	return keypairFromSecretKey;
};

const getAccountBalance = async (
	connection: web3.Connection,
	address: web3.PublicKey
) => {
	return (await connection.getBalance(address)) / web3.LAMPORTS_PER_SOL;
};

const main = async () => {
	const receiverAccountAddress = process.argv[2];
	const amountToSend = Number(process.argv[3]);

	if (!receiverAccountAddress || !amountToSend) {
		console.log(
			"Please pass <RECEIVER_ACCOUNT_ADDRESS> and <AMOUNT_IN_SOL>. Cannot proceed without it."
		);
		return;
	}

	const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
	const payer = initializeKeypair();

	console.log("Your Account Address: ", payer.publicKey.toString());

	const payerAccountBalance = await getAccountBalance(
		connection,
		payer.publicKey
	);

	console.log("Your Account Balance: ", payerAccountBalance);

	const receiverAccountAddressPublicKey = new web3.PublicKey(
		receiverAccountAddress
	);

	if (payer.publicKey.toString() === receiverAccountAddress) {
		console.log(
			"Please enter different account! Cannot transfer to same account."
		);
		return;
	}

	console.log("Receiver Account Address: ", receiverAccountAddress);

	const receiverAccountBalance = await getAccountBalance(
		connection,
		receiverAccountAddressPublicKey
	);

	console.log("Receiver Account Balance: ", receiverAccountBalance);

	if (payerAccountBalance < amountToSend) {
		console.log("Account has insufficient funds! Cannot proceed.");
		return;
	}

	console.log(`Sending ${amountToSend} SOL to ${receiverAccountAddress}`);

	await sendSol(
		connection,
		payer,
		receiverAccountAddressPublicKey,
		amountToSend
	);
};

const sendSol = async (
	connection: web3.Connection,
	payer: web3.Keypair,
	receiverAccountAddressPublicKey: web3.PublicKey,
	amountToSend: number
) => {
	const transaction = new web3.Transaction();

	const transactionInstruction = web3.SystemProgram.transfer({
		fromPubkey: payer.publicKey,
		toPubkey: receiverAccountAddressPublicKey,
		lamports: web3.LAMPORTS_PER_SOL * amountToSend,
	});

	transaction.add(transactionInstruction);

	const signature = await web3.sendAndConfirmTransaction(
		connection,
		transaction,
		[payer]
	);

	console.log(
		`Successfully Sent ${amountToSend} SOL to ${receiverAccountAddressPublicKey.toString()} => `,
		`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
	);

	const updatedPayerBalance = await getAccountBalance(
		connection,
		payer.publicKey
	);

	const updatedReceiverBalance = await getAccountBalance(
		connection,
		receiverAccountAddressPublicKey
	);

	console.log(`Your updated balance: ${updatedPayerBalance}`);
	console.log(`Receiver updated balance: ${updatedReceiverBalance}`);
};

main()
	.then(() => {
		console.log("Program Exiting! Thanks for using.");
	})
	.catch((error) => {
		console.error(error.message ?? error);
		console.log("Program Exiting! Thanks for using.");
	});
