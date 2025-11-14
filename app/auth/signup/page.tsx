"use client";

import { useState, useEffect } from "react";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = { full_name: fullName, email, username, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Token save karo (ye naya step hai)
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", username);
          setMessage("✅ Signup successful! Redirecting...");

          // ✅ Redirect wallet page pe
          setTimeout(() => {
            window.location.href = "/wallet";
          }, 1000);
        } else {
          setMessage("⚠️ Signup successful but token missing.");
        }

        // ✅ Form clear karna optional hai
        setFullName("");
        setEmail("");
        setUsername("");
        setPassword("");
      } else {
        setMessage("❌ Error: " + (data.detail || "Signup failed"));
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server not reachable (check backend).");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-80"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-5 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
        >
          Signup
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
}
