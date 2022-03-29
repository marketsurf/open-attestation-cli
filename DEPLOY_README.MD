### Prerequisite

- Yarn Installed

#### Install necessary packages

```
yarn
```

#### Create wallet for fuji

`yarn dev wallet create --output-file wallet.json --fund fuji`

#### Deploy Document Store contract on the Avalanche Network

`yarn dev deploy document-store "My first document store" --network fuji --encrypted-wallet-path wallet.json`

#### Create Temporary DNS Proof

`yarn dev dns txt-record create --address "Address of the DocumentStore Contract" --network-id 43113`

> Can run but might not be working right. (WIP)
> Seems like their code don't work with the Avalanche Network.

DNS used to create the Proof

`yarn dev dns txt-record get --location few-green-cat.sandbox.openattestation.com`

#### Create Raw Documents

Replace with the necessary field

- documentStore address
- location

```json
{
  "$template": {
    "name": "main",
    "type": "EMBEDDED_RENDERER",
    "url": "https://tutorial-renderer.openattestation.com"
  },
  "recipient": {
    "name": "John Doe"
  },
  "issuers": [
    {
      "name": "Demo Issuer",
      "documentStore": "0xBBb55Bd1D709955241CAaCb327A765e2b6D69c8b",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "sebastianyii.com"
      }
    }
  ]
}
```

Then save it like this

> Copied from https://www.openattestation.com/docs/verifiable-document/raw-document

Near the wallet.json file, create a folder named raw-documents. Inside that folder create a file names certificate-1.json and paste the validated JSON from above.

Create another file named certificate-2.json and paste the same validated JSON into the file, changing the recipient.name to a different name.

At this point in time, your directory should look like the following:
wallet.json
raw-documents
|-- certificate-1.json
|-- certificate-2.json
We are now ready to wrap the documents.

#### Wrap the documents to get merkle root

`yarn dev wrap "folder name" --output-dir wrapped-documents`

#### Issue the document to the DocumentStore Contract

`yarn dev document-store issue --address "DocumentStore Address" --hash "The 64 bit Merkle Root" --network fuji --encrypted-wallet-path wallet.json`
