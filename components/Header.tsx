import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-ocean/30 bg-[#0a0f1a]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">☠️</span>
          <h1 className="text-xl md:text-2xl font-bold">
            <span className="text-gold">Grand Line</span>{" "}
            <span className="text-white">Dex</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gold transition-colors"
            aria-label="Twitter/X"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
