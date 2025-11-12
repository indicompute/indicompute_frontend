"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [gpuNodes, setGpuNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Step 1: Token check — agar token nahi hai to login par bhejo
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    // ✅ Step 2: Data fetch function
    async function fetchData() {
      try {
        const [userRes, walletRes, gpuRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/wallet/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/gpu-nodes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // ✅ Step 3: Unauthorized check
        if (userRes.status === 401 || walletRes.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }

        // ✅ Step 4: Parse data safely
        const [userData, walletData, gpuData] = await Promise.all([
          userRes.json(),
          walletRes.json(),
          gpuRes.json(),
        ]);

        setUser(userData);
        setWallet(walletData);
        setGpuNodes(Array.isArray(gpuData) ? gpuData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("⚠️ Network or server error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Step 5: Loading state
  if (loading)
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-gray-300 text-lg">
        Loading dashboard...
      </main>
    );

  // ✅ Step 6: Error state
  if (error)
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-red-500 text-lg">
        {error}
      </main>
    );

  // ✅ Step 7: Main dashboard UI
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-6">🚀 Dashboard</h1>

      {user ? (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-gray-100 w-96 text-center">
          <p>
            <strong>Name:</strong> {user.full_name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p className="mt-3 text-green-400">
            💰 Wallet Balance: ₹{wallet?.wallet_balance?.toFixed(2) || 0}
          </p>
          <p className="mt-1 text-yellow-400">
            🖥 GPU Nodes: {gpuNodes.length}
          </p>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">User data not available</p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4">
        <a
          href="/gpu-nodes"
          className="bg-green-700 px-4 py-3 rounded text-center hover:bg-green-800"
        >
          GPU Nodes
        </a>
        <a
          href="/marketplace"
          className="bg-blue-700 px-4 py-3 rounded text-center hover:bg-blue-800"
        >
          Marketplace
        </a>
        <a
          href="/submit-job"
          className="bg-purple-700 px-4 py-3 rounded text-center hover:bg-purple-800"
        >
          Submit Job
        </a>
        <a
          href="/wallet"
          className="bg-yellow-700 px-4 py-3 rounded text-center hover:bg-yellow-800"
        >
          Wallet
        </a>
        {/* 🔴 Logout Button */}
<button
  onClick={() => {
    localStorage.removeItem("token"); // token delete karega
    window.location.href = "/auth/login"; // login page pe redirect karega
  }}
  className="bg-red-700 px-4 py-3 rounded text-center hover:bg-red-800 col-span-2"
>
  🚪 Logout
</button>
      </div>
    </main>
  );
}
