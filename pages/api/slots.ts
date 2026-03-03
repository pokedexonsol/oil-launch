import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slots = await prisma.slot.findMany({
      orderBy: { id: "asc" },
    });
    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    return res.status(500).json({ error: "Failed to fetch slots" });
  }
}
