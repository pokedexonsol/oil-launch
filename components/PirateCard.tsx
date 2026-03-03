import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";

interface Slot {
  id: number;
  name: string;
  symbol: string;
  image: string;
  type: string;
  description: string;
  status: string;
  tokenAddress: string | null;
  claimedBy: string | null;
}

interface PirateCardProps {
  slot: Slot;
  onClaim: (slotId: number) => Promise<void>;
}

const typeColors: Record<string, string> = {
  Captain: "bg-amber-600/20 text-amber-400",
  Navigator: "bg-cyan-600/20 text-cyan-400",
  Gunner: "bg-red-600/20 text-red-400",
  Cook: "bg-orange-600/20 text-orange-400",
  Doctor: "bg-green-600/20 text-green-400",
  Shipwright: "bg-amber-800/20 text-amber-500",
  Lookout: "bg-purple-600/20 text-purple-400",
  Quartermaster: "bg-yellow-600/20 text-yellow-400",
  Boatswain: "bg-blue-600/20 text-blue-400",
  Musician: "bg-pink-600/20 text-pink-400",
};

export default function PirateCard({ slot, onClaim }: PirateCardProps) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);
  const isRecruited = slot.status === "recruited";

  async function handleSetSail() {
    if (!connected) {
      setVisible(true);
      return;
    }
    setLoading(true);
    try {
      await onClaim(slot.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative bg-ocean-dark/50 border border-ocean/30 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={slot.image}
          alt={slot.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isRecruited
                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                : "bg-gold/20 text-gold border border-gold/30"
            }`}
          >
            {isRecruited ? "Recruited" : "Available"}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg">{slot.name}</h3>
          <span className="text-xs text-gray-500 font-mono">{slot.symbol}</span>
        </div>

        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${
            typeColors[slot.type] || "bg-gray-600/20 text-gray-400"
          }`}
        >
          {slot.type}
        </span>

        <p className="text-gray-400 text-sm line-clamp-2">{slot.description}</p>

        {isRecruited && slot.tokenAddress ? (
          <a
            href={`/token/${slot.tokenAddress}`}
            className="block w-full text-center bg-ocean border border-ocean-light/50 text-white font-semibold py-2 rounded-lg hover:bg-ocean-light transition-colors text-sm"
          >
            View Token
          </a>
        ) : (
          <button
            onClick={handleSetSail}
            disabled={loading || isRecruited}
            className="w-full bg-gold hover:bg-gold-light text-ocean-dark font-semibold py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Launching..." : "⚓ Set Sail"}
          </button>
        )}
      </div>
    </div>
  );
}
