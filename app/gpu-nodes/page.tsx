"use client";
import { useEffect, useState } from "react";

export default function GpuNodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    location: "",
    gpu_model: "",
    gpu_count: "",
    price_per_hour: "",
  });

  // 🧠 Fetch GPU Nodes
  async function fetchNodes() {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/gpu-nodes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        setError("❌ Unauthorized: Please login again.");
        setNodes([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setNodes(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (e) {
      setError("Failed to fetch GPU nodes ❌");
      setLoading(false);
    }
  }

  // 🧩 Add New Node
  async function handleAddNode(e: any) {
    e.preventDefault();
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/gpu-nodes/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          location: form.location,
          gpu_model: form.gpu_model,
          gpu_count: Number(form.gpu_count),
          price_per_hour: Number(form.price_per_hour),
        }),
      });
      if (res.ok) {
        alert("✅ GPU Node Added Successfully!");
        setForm({ location: "", gpu_model: "", gpu_count: "", price_per_hour: "" });
        fetchNodes();
      } else {
        alert("❌ Failed to add GPU Node");
      }
    } catch {
      alert("❌ Server Error while adding node");
    }
  }

  useEffect(() => {
    fetchNodes();
  }, []);

  if (loading) return <p className="text-center text-white mt-10">Loading GPU nodes...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8 text-green-400">
        ⚙ GPU Nodes Dashboard
      </h1>

      {/* 🧩 Add Node Form */}
      <form
        onSubmit={handleAddNode}
        className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8 w-11/12 max-w-lg border border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 text-green-300">
          ➕ Add New GPU Node
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="text"
            placeholder="GPU Model"
            value={form.gpu_model}
            onChange={(e) => setForm({ ...form, gpu_model: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="number"
            placeholder="GPU Count"
            value={form.gpu_count}
            onChange={(e) => setForm({ ...form, gpu_count: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="number"
            placeholder="Price per Hour (₹)"
            value={form.price_per_hour}
            onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
        >
          Add GPU Node
        </button>
      </form>

      {/* 🖥 GPU Nodes List */}
      {nodes.length === 0 ? (
        <p className="text-gray-400">No GPU nodes found 💤</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 max-w-6xl">
          {nodes.map((node, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-green-500/30 transition duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-green-300">
                  {node.gpu_model || "Unnamed Node"}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    node.is_online
                      ? "bg-green-700 text-green-100"
                      : "bg-red-700 text-red-100"
                  }`}
                >
                  {node.is_online ? "Online" : "Offline"}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <p>📍 <strong>Location:</strong> {node.location}</p>
                <p>🎮 <strong>GPU Count:</strong> {node.gpu_count}</p>
                <p>💰 <strong>Price:</strong> ₹{node.price_per_hour || "N/A"}/hr</p>
                <p>⏱ <strong>Last Active:</strong> {node.last_heartbeat || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-12 text-gray-500 text-sm">
        © 2025 <span className="text-green-400 font-semibold">IndiCompute</span> — AI Compute System ⚡
      </footer>
    </main>
  );
}
