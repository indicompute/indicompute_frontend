"use client";

import { useEffect, useState } from "react";

type Node = {
  id: number;
  owner_id: number;
  location: string;
  gpu_model: string;
  gpu_count: number;
  is_online: boolean;
  price_per_hour?: number | null;
  currency?: string | null;
  last_active?: string | null;
  node_key?: string | null; // ✅ added safely
};

// 🔐 Token helper
function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export default function MarketplacePage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string>("");
  const apiBase = "${process.env.NEXT_PUBLIC_API_URL}";

  // ✅ Fetch current user
  async function fetchUser() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserId(data.id);
      }
    } catch (err) {
      console.error("User fetch failed:", err);
    }
  }

  // ✅ Fetch all GPU nodes (with node_key)
  const fetchNodes = () => {
    fetch(`${apiBase}/gpu-nodes/details`)
      .then((r) => r.json())
      .then((data) => {
        setNodes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching GPU details:", err);
        setLoading(false);
      });
  };

  // ✅ Run once and refresh every 15 sec
  useEffect(() => {
    fetchUser();
    fetchNodes();
    const interval = setInterval(fetchNodes, 15000);
    return () => clearInterval(interval);
  }, []);

  // ✏️ Update price (for owner only)
  async function handlePriceUpdate(nodeId: number) {
    const token = getToken();
    if (!token) return alert("Login required!");

    const newPrice = prompt("Enter new price per hour (₹):");
    if (!newPrice) return;

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Invalid price");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/pricing/${nodeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price_per_hour: priceNum,
          currency: "INR",
        }),
      });

      if (res.ok) {
        alert("✅ Price updated successfully!");
        fetchNodes();
      } else {
        const err = await res.json().catch(() => null);
        alert(`❌ Failed: ${err?.detail || res.statusText}`);
      }
    } catch {
      alert("Error updating price. Backend unreachable.");
    }
  }

  // 💻 Submit job (for non-owner users)
  async function handleSubmitJob(nodeId: number) {
    const token = getToken();
    if (!token) return alert("Please login first.");

    const command = prompt("Enter job command (e.g., train.py):");
    if (!command) return;

    try {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return alert("Node not found.");
      if (!node.node_key) return alert("Node key not available for this node.");

      const res = await fetch(`${apiBase}/submit-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          node_id: node.id,
          node_key: node.node_key,
          command: command,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Job submitted successfully!\nJob ID: ${data.id}\nCommand: ${data.command}`);
        setMsg("Job running... balance debited!");
      } else {
        const err = await res.json().catch(() => null);
        alert(`❌ Failed: ${err?.detail || res.statusText}`);
      }
    } catch (err) {
      alert("Backend unreachable.");
      console.error(err);
    }
  }

  if (loading)
    return (
      <div className="p-6 text-lg text-center text-gray-400">
        Loading GPUs...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 drop-shadow-lg">
  🎮 GPU Marketplace
</h1>

      {msg && <p className="text-center text-green-400 mb-4">{msg}</p>}

      {nodes.length === 0 ? (
        <p className="text-center text-gray-400">No GPUs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nodes.map((n) => (
            <div
              key={n.id}
              className="p-5 bg-gray-800/80 shadow-xl rounded-2xl hover:shadow-2xl transition duration-200 border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                {n.gpu_model || "Unnamed GPU"}
              </h2>

              <p>📍 <b>Location:</b> {n.location}</p>
              <p>🧠 <b>Count:</b> {n.gpu_count}</p>
              <p>
                💡 <b>Status:</b>{" "}
                {n.is_online ? (
                  <span className="text-green-400">🟢 Online</span>
                ) : (
                  <span className="text-red-400">🔴 Offline</span>
                )}
              </p>
              <p>
                💸 <b>Price:</b>{" "}
                <span className="text-green-400">
                  ₹{n.price_per_hour?.toFixed(2) ?? "N/A"} / {n.currency ?? "INR"}
                </span>
              </p>
              <p>
                ⏱ <b>Last Active:</b>{" "}
                {n.last_active ? new Date(n.last_active).toLocaleString() : "N/A"}
              </p>

              {/* ✅ Owner = Set Price | Non-owner = Submit Job */}
              {userId && userId === n.owner_id ? (
                <button
                  onClick={() => handlePriceUpdate(n.id)}
                  className="mt-3 w-full bg-green-700 py-2 rounded-lg hover:bg-green-800"
                >
                  ✏️ Set / Update Price
                </button>
              ) : (
                <button
                  onClick={() => handleSubmitJob(n.id)}
                  className="mt-3 w-full bg-blue-700 py-2 rounded-lg hover:bg-blue-800"
                >
                  💻 Submit Job
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
