import { useRouter } from "next/router";
import Link from "next/link";

export default function TokenDetail() {
  const router = useRouter();
  const { address } = router.query;

  if (!address || typeof address !== "string") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-gray-400 mt-4">Loading token...</p>
      </div>
    );
  }

  const dexScreenerUrl = `https://dexscreener.com/solana/${address}?embed=1&theme=dark`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-6"
      >
        <span>&larr;</span> Back to Crew
      </Link>

      <div className="bg-ocean-dark/50 border border-ocean/30 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-ocean/20">
          <h2 className="text-2xl font-bold text-white mb-2">Token Details</h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-400 text-sm">Contract:</span>
            <code className="text-gold text-sm bg-ocean/20 px-3 py-1 rounded-md break-all">
              {address}
            </code>
            <a
              href={`https://solscan.io/token/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ocean-light hover:text-gold transition-colors"
            >
              View on Solscan &rarr;
            </a>
          </div>
        </div>

        <div className="aspect-[16/9] w-full">
          <iframe
            src={dexScreenerUrl}
            title="DexScreener Chart"
            className="w-full h-full border-0"
            allow="clipboard-write"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={`https://pump.fun/coin/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ocean-dark/50 border border-ocean/30 rounded-lg p-4 text-center hover:border-gold/30 transition-colors"
        >
          <div className="text-gold font-semibold mb-1">Pump.fun</div>
          <div className="text-gray-400 text-sm">Trade on Pump.fun</div>
        </a>
        <a
          href={`https://dexscreener.com/solana/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ocean-dark/50 border border-ocean/30 rounded-lg p-4 text-center hover:border-gold/30 transition-colors"
        >
          <div className="text-gold font-semibold mb-1">DexScreener</div>
          <div className="text-gray-400 text-sm">Full Chart View</div>
        </a>
        <a
          href={`https://birdeye.so/token/${address}?chain=solana`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ocean-dark/50 border border-ocean/30 rounded-lg p-4 text-center hover:border-gold/30 transition-colors"
        >
          <div className="text-gold font-semibold mb-1">Birdeye</div>
          <div className="text-gray-400 text-sm">Token Analytics</div>
        </a>
      </div>
    </main>
  );
}
