"use client";
import React, { useState } from "react";

export default function SubmitJobPage() {
  const [nodeId, setNodeId] = useState("");
  const [nodeKey, setNodeKey] = useState("");
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ Please login first!");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          node_id: parseInt(nodeId),
          node_key: nodeKey,
          command: command,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Job Submitted Successfully (Job ID: ${data.id})`);
        setNodeId("");
        setNodeKey("");
        setCommand("");
      } else {
        setMessage(`❌ ${data.detail || "Job submission failed."}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("🚨 Server not reachable!");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-400 mb-6">⚙ Submit Job</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <input
          type="number"
          placeholder="Node ID"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="text"
          placeholder="Node Key"
          value={nodeKey}
          onChange={(e) => setNodeKey(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="text"
          placeholder="Command (e.g. train.py)"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
        >
          Submit Job
        </button>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-300">{message}</p>
        )}
      </form>
    </main>
  );
}
