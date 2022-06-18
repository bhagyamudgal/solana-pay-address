
# Solana Pay Address

A simple CLI utility script that helps in transferring SOL from one account to another account on solana devnet. User has to run the utility script by passing 2 argument: 1. The public address of the account to whom user wants to send SOL and 2. The amount of SOL user wants to send.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can take reference from the .env-example file present in the project.

`PRIVATE_KEY`


## Run Locally

To run the script:

Clone the project

```bash
  git clone https://github.com/bhagyamudgal/solana-pay-address.git
```

Go to the project directory

```bash
  cd solana-pay-address
```

Install dependencies

```bash
  yarn install
```

Set up environment variables - you can take reference from the example env file (.env-example)

After you are done with env

Make sure you have some SOL present in the account whose private key you have used. If not, you can airdrop SOL from my another project https://peeksol.netlify.app

Run the following command to start the script

```
yarn start <RECEIVER_ACCOUNT_ADDRESS> <AMOUNT_OF_SOL>
```

For example, `yarn start "3vEb5EeY5fyk7NQPRXgB1iw6T4PUD1soBnDfVMsmLkSb" 1`


## Feedback

If you have any feedback, please reach out to me at bhagyamudgal@gmail.com

