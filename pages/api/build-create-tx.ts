import type { NextApiRequest, NextApiResponse } from "next";
import { Keypair, PublicKey, Connection, Transaction } from "@solana/web3.js";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slotId, walletAddress } = req.body;

  if (!slotId || !walletAddress) {
    return res.status(400).json({ error: "Missing slotId or walletAddress" });
  }

  try {
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.status === "recruited") {
      return res.status(400).json({ error: "Slot already claimed" });
    }

    // Generate a new mint keypair for the token
    const mintKeypair = Keypair.generate();

    // Read the image file for upload to IPFS via Pump.fun
    const imagePath = path.join(process.cwd(), "public", slot.image);
    let imageBlob: Blob | undefined;
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBlob = new Blob([imageBuffer], { type: "image/png" });
    }

    // Build form data for Pump.fun API
    const formData = new FormData();
    formData.append("name", slot.name);
    formData.append("symbol", slot.symbol);
    formData.append("description", slot.description);
    formData.append("showName", "true");
    if (imageBlob) {
      formData.append("file", imageBlob, `${slot.name.toLowerCase()}.png`);
    }

    // Create token via Pump.fun
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    if (!metadataResponse.ok) {
      return res.status(500).json({ error: "Failed to upload metadata to Pump.fun" });
    }

    const metadataJson = await metadataResponse.json();

    // Build the create transaction
    const createPayload = {
      publicKey: walletAddress,
      action: "create",
      tokenMetadata: {
        name: slot.name,
        symbol: slot.symbol,
        uri: metadataJson.metadataUri,
      },
      mint: mintKeypair.publicKey.toBase58(),
      denominatedInSol: "true",
      amount: 0,
      slippage: 10,
      priorityFee: 0.0005,
      pool: "pump",
    };

    const txResponse = await fetch(
      "https://pumpportal.fun/api/trade-local",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createPayload),
      }
    );

    if (!txResponse.ok) {
      return res.status(500).json({ error: "Failed to build transaction from Pump.fun" });
    }

    const txData = await txResponse.arrayBuffer();
    const tx = Transaction.from(Buffer.from(txData));

    // Sign with the mint keypair
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
    );
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey(walletAddress);
    tx.partialSign(mintKeypair);

    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    return res.status(200).json({
      transaction: Buffer.from(serializedTx).toString("base64"),
      mint: mintKeypair.publicKey.toBase58(),
    });
  } catch (error: any) {
    console.error("Build TX error:", error);
    return res.status(500).json({ error: error.message || "Failed to build transaction" });
  }
}
