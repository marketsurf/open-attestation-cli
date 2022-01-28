import fs from "fs";
import path from "path";
import { info } from "signale";
import { readFile } from "../../implementations/utils/disk";
import { handler as createTemporaryDns } from "../../commands/dns/txt-record/create";
import { CreateConfigCommand } from "../../commands/config/config.type";
import { Dns } from "./types";
import {
  getConfigWithUpdatedWallet,
  getConfigWithUpdatedForms,
  getConfigFile,
  validate,
  getTokenRegistryAddress,
  getDocumentStoreAddress,
} from "./helpers";

const SANDBOX_ENDPOINT_URL = "https://sandbox.fyntech.io";

export const create = async ({
  encryptedWalletPath,
  outputDir,
  configTemplatePath,
  configTemplateUrl,
}: CreateConfigCommand): Promise<string> => {
  const walletStr = await readFile(encryptedWalletPath);
  const { address } = JSON.parse(walletStr);
  info(`Wallet detected at ${encryptedWalletPath}`);

  const configFile = await getConfigFile(configTemplatePath, configTemplateUrl);
  const { forms } = configFile;

  if (!validate(forms)) {
    throw new Error("Invalid form detected in config file, please update the form before proceeding.");
  }

  const hasTransferableRecord = forms.some((form) => form.type === "TRANSFERABLE_RECORD");
  const hasDocumentStore = forms.some((form) => form.type === "VERIFIABLE_DOCUMENT");
  const hasDid = forms.some(
    (form) => form.defaults.issuers.some((issuer) => issuer.identityProof?.type.includes("DID")) // TODO: v3 does not have `issuers` but `issuer` instead
  );

  let tokenRegistryAddress = "";
  let documentStoreAddress = "";
  let dnsTransferableRecord: Dns = "";
  let dnsVerifiable: Dns = "";
  let dnsDid: Dns = "";

  if (hasTransferableRecord) {
    tokenRegistryAddress = await getTokenRegistryAddress(encryptedWalletPath);
    dnsTransferableRecord = await createTemporaryDns({
      networkId: 3,
      address: tokenRegistryAddress,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  if (hasDocumentStore) {
    documentStoreAddress = await getDocumentStoreAddress(encryptedWalletPath);
    dnsVerifiable = await createTemporaryDns({
      networkId: 3,
      address: documentStoreAddress,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  if (hasDid) {
    // DID no need deploy any
    dnsDid = await createTemporaryDns({
      networkId: 3,
      publicKey: `did:ethr:0x${address}#controller`,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  const updatedConfigFileWithWallet = getConfigWithUpdatedWallet({ configFile, walletStr });
  const updatedConfigFileWithForms = getConfigWithUpdatedForms({
    configFile: updatedConfigFileWithWallet,
    documentStoreAddress,
    tokenRegistryAddress,
    dnsVerifiable,
    dnsDid,
    dnsTransferableRecord,
  });

  const outputPath = path.join(outputDir, "config.json");
  fs.writeFileSync(outputPath, JSON.stringify(updatedConfigFileWithForms, null, 2));

  return outputPath;
};
