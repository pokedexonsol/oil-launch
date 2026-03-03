import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, Transaction } from "@solana/web3.js";
import PirateCard from "@/components/PirateCard";

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

export default function Home() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      const res = await fetch("/api/slots");
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(slotId: number) {
    if (!publicKey) return;

    try {
      const res = await fetch("/api/build-create-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          walletAddress: publicKey.toBase58(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to build transaction");
        return;
      }

      const tx = Transaction.from(Buffer.from(data.transaction, "base64"));
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
      );
      const signature = await sendTransaction(tx, connection);

      await connection.confirmTransaction(signature, "confirmed");

      await fetch("/api/confirm-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId,
          signature,
          walletAddress: publicKey.toBase58(),
          tokenAddress: data.mint,
        }),
      });

      fetchSlots();
    } catch (err: any) {
      console.error("Claim failed:", err);
      alert("Transaction failed: " + (err?.message || "Unknown error"));
    }
  }

  const types = ["all", ...Array.from(new Set(slots.map((s) => s.type)))];
  const filtered =
    filter === "all" ? slots : slots.filter((s) => s.type === filter);

  const availableCount = slots.filter((s) => s.status === "available").length;
  const recruitedCount = slots.filter((s) => s.status === "recruited").length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gold">Recruit Your Crew</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          50 legendary pirates await their captain. Launch tokens on Solana via
          Pump.fun and claim your crew member.
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">{availableCount}</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {recruitedCount}
            </div>
            <div className="text-sm text-gray-500">Recruited</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50</div>
            <div className="text-sm text-gray-500">Total Crew</div>
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === type
                ? "bg-gold text-ocean-dark"
                : "bg-ocean-dark/50 text-gray-400 border border-ocean/30 hover:border-gold/30 hover:text-gold"
            }`}
          >
            {type === "all" ? "All" : type}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Loading crew roster...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((slot) => (
            <PirateCard key={slot.id} slot={slot} onClaim={handleClaim} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No pirates found for this filter.</p>
        </div>
      )}

      <footer className="mt-16 py-8 border-t border-ocean/20 text-center text-gray-500 text-sm">
        <p>Grand Line Dex &mdash; Pirate Token Launchpad on Solana</p>
      </footer>
    </main>
  );
}
