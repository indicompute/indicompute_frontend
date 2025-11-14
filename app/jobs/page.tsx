"use client";
import { useState, useEffect } from "react";

export default function JobsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [model, setModel] = useState("");
  const [inputData, setInputData] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Load token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
    }
  }, []);

  // ✅ Fetch user jobs
  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/user-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Job fetch error:", err);
      setMessage("⚠️ Failed to load jobs");
    }
  };

  // ✅ Submit new job
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return alert("Please login first!");

    const payload = {
      node_id: 1, // temporary fixed node for testing
      node_key: "abc123", // testing key (replace later dynamically)
      command: model || "train.py",
    };

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/submit-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`✅ Job submitted successfully! ID: ${data.id}`);
        setModel("");
        setInputData("");
        fetchJobs();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(`❌ ${err.detail || "Job submission failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Backend not reachable");
    }
  };

  // ✅ Simulate job completion (for payout testing)
  const handleSimulateComplete = async (jobId: number) => {
    if (!token) return alert("Login required!");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/simulate-job-complete/${jobId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Job #${data.id} marked completed & owner credited!`);
        fetchJobs();
      } else {
        const err = await res.json();
        alert(`❌ ${err.detail || "Failed to complete job"}`);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server not reachable");
    }
  };

  // ✅ UI Rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        💼 Job Submission
      </h1>

      {/* 🔹 Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-xl max-w-md mx-auto"
      >
        <input
          type="text"
          placeholder="Model Name (e.g. train.py)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />

        <textarea
          placeholder="Input Data"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          🚀 Submit Job
        </button>

        {message && (
          <p className="text-center mt-3 text-gray-300">{message}</p>
        )}
      </form>

      {/* 🔹 Submitted Jobs List */}
      <div className="mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">📋 Submitted Jobs</h2>
        {jobs.length > 0 ? (
          jobs.map((j) => (
            <div
              key={j.id}
              className="bg-gray-800 p-4 mb-3 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <p>
                  🧠 <b>{j.command}</b> — Status:{" "}
                  <span
                    className={
                      j.status === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {j.status}
                  </span>
                </p>
                <p className="text-sm text-gray-400">{j.result || ""}</p>
              </div>

              {j.status !== "completed" && (
                <button
                  onClick={() => handleSimulateComplete(j.id)}
                  className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  ✅ Mark Complete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            No jobs submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}
