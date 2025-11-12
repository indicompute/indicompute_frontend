"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setMessage("");

    const payload = { email, password };

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        // ✅ Save token in localStorage
        localStorage.setItem("token", data.access_token);

        setMessage("✅ Login successful! Redirecting...");

        // ✅ Redirect to wallet page
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMessage(`❌ ${data.detail || "Invalid credentials"}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("⚠️ Server not reachable. Please check backend.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-80"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-5 rounded bg-gray-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
        >
          Login
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
}
