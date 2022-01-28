import { ethers } from "ethers";
import fs from "fs";
import inquirer from "inquirer";
import fetch from "node-fetch";
import path from "path";
import signale from "signale";
import { CreateWalletCommand } from "../../commands/wallet/wallet.type";
import { progress as defaultProgress } from "../../implementations/utils/progress";
import { getEtherscanAddress, highlight } from "../../utils";

export const create = async ({
  fund,
  progress = defaultProgress("Encrypting Wallet"),
  outputFile,
}: CreateWalletCommand & { progress?: (progress: number) => void }): Promise<string> => {
  const wallet = ethers.Wallet.createRandom();
  const { password } = await inquirer.prompt({
    type: "password",
    name: "password",
    message: "Wallet password",
  });

  const json = await wallet.encrypt(password, progress);
  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, json);

  if (fund === "ropsten") {
    const response = await fetch(`https://faucet.openattestation.com/donate/${wallet.address}`).then((res) =>
      res.json()
    );
    if (response.message) {
      signale.warn(`[ropsten] Adding fund to ${wallet.address} failed: ${response.message}`);
    } else {
      signale.info(
        `[ropsten] Request to add funds into ${wallet.address} sent. Please wait a while before the funds being added into your wallet. You can check the transaction at https://ropsten.etherscan.io/tx/${response.txhash}`
      );
    }

    signale.info(`Wallet with public address ${highlight(wallet.address)} successfully created.`);
    signale.info(`Find more details at ${getEtherscanAddress({ network: "ropsten" })}/address/${wallet.address}`);
  } else if (fund === "fuji") {
    signale.info(
      `[fuji] In order to fund your wallet, please go to https://faucet.avax-test.network/ to add funds to your account.`
    );
    signale.info(`Wallet with public address ${highlight(wallet.address)} successfully created.`);
    signale.info(`Find more details at https://testnet.snowtrace.io/address/${wallet.address}`);
  } else {
    signale.info(`Wallet with public address ${highlight(wallet.address)} successfully created.`);
  }

  return outputPath;
};
