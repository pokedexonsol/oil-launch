import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slotId, signature, walletAddress, tokenAddress } = req.body;

  if (!slotId || !signature || !walletAddress || !tokenAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.status === "recruited") {
      return res.status(400).json({ error: "Slot already claimed" });
    }

    const updated = await prisma.slot.update({
      where: { id: slotId },
      data: {
        status: "recruited",
        tokenAddress,
        claimedBy: walletAddress,
      },
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error("Confirm claim error:", error);
    return res.status(500).json({ error: error.message || "Failed to confirm claim" });
  }
}
