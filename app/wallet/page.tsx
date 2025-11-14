"use client";
import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
};

type WalletData = {
  username?: string;
  wallet_balance: number;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch wallet data + transactions
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const balData = await balRes.json();
      const txData = await txRes.json();

      setWallet(balData);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      console.error("⚠️ Fetch failed:", err);
      setMessage("⚠️ Failed to load wallet data. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-refresh every 15 sec
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [token]);

  // ✅ Handle Top-up (final version with deep error parsing)
  const handleTopUp = async () => {
    if (!token) return;
    const amt = Number(amount.trim());
if (!amt || amt <= 0 || isNaN(amt)) {
  setMessage("⚠️ Please enter a valid positive amount.");
  return;
}

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: amt }),
  });


      if (res.ok) {
        setMessage("✅ Wallet topped up successfully!");
        setAmount("");
        fetchData();
      } else {
        let errMsg = "Top-up failed";

        try {
          const err = await res.json();

          if (typeof err === "string") {
            errMsg = err;
          } else if (err?.detail) {
            // Handle nested FastAPI error lists
            if (Array.isArray(err.detail))
              if (Array.isArray(err.detail)) {
  const first = err.detail[0];
  if (first?.msg?.toLowerCase().includes("field required")) {
    errMsg = "Please enter a valid amount.";
  } else {
    errMsg = first?.msg || JSON.stringify(first);
  }
} else {
  errMsg =
    err.detail?.toLowerCase().includes("field required")
      ? "Please enter a valid amount."
      : err.detail;
}

          } else if (err?.message) {
            errMsg = err.message;
          } else {
            errMsg = JSON.stringify(err, null, 2);
          }
        } catch {
          errMsg = "Unexpected server response.";
        }

        setMessage(`❌ ${String(errMsg)}`);
      }
    } catch (err: any) {
      console.error("Top-up error:", err);
      const msg =
        err?.detail ||
        err?.message ||
        "⚠️ Server not reachable. Please check your connection.";
      setMessage(msg);
    }
  };

  // ✅ Export CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export!");
      return;
    }

    const header = "Type,Amount,Description,Timestamp\n";
    const rows = transactions
      .map(
        (tx) =>
          `${tx.type},${tx.amount},"${tx.description.replace(/"/g, '""')}",${new Date(
            tx.timestamp
          ).toLocaleString()}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wallet_transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Filter Logic
  const filteredTransactions = transactions.filter((tx) =>
    filter === "all" ? true : tx.type === filter
  );

  if (loading)
    return (
      <div className="p-6 text-lg text-center text-gray-300">
        Loading wallet...
      </div>
    );

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        💰 Wallet Dashboard
      </h1>

      {/* 🧾 Wallet Info */}
      {wallet && (
        <div className="text-center mb-6">
          {wallet.username && (
            <p className="text-lg mb-2">
              <b>User:</b> {wallet.username}
            </p>
          )}
          <p className="text-2xl font-semibold text-yellow-400">
            Balance: ₹{wallet.wallet_balance?.toFixed(2) || "0.00"}
          </p>
        </div>
      )}

      {/* 💳 Top-Up Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount (e.g. 100)"
          className="w-56 sm:w-64 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 
                     border border-gray-700 text-center shadow-md focus:outline-none 
                     focus:ring-2 focus:ring-green-500"
        />
        <div className="flex gap-3 mt-3 sm:mt-0">
          <button
            onClick={handleTopUp}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
          >
            Top Up
          </button>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <p className="text-center mb-6 text-gray-300 font-medium">{message}</p>
      )}

      {/* 🔍 Filter + Export */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-gray-700" : "bg-gray-800"
          } hover:bg-gray-700`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("credit")}
          className={`px-4 py-2 rounded ${
            filter === "credit" ? "bg-green-700" : "bg-gray-800"
          } hover:bg-green-700`}
        >
          Credit
        </button>
        <button
          onClick={() => setFilter("debit")}
          className={`px-4 py-2 rounded ${
            filter === "debit" ? "bg-red-700" : "bg-gray-800"
          } hover:bg-red-700`}
        >
          Debit
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* 📜 Transactions */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Transaction History
        </h2>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-3 mb-3 rounded shadow ${
                tx.type === "credit"
                  ? "bg-green-900/40 border border-green-700"
                  : "bg-red-900/40 border border-red-700"
              }`}
            >
              <p className="text-gray-300 text-sm">
                <b>{tx.type.toUpperCase()}</b> — {tx.description}
              </p>
              <p className="text-yellow-400 font-semibold">
                ₹{tx.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
