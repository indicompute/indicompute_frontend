export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white font-sans">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          🚀 IndiCompute Frontend
        </h1>

        <p className="text-lg text-gray-300">
          Frontend + Backend Connected Successfully ✅
        </p>

        <div className="flex gap-8 justify-center pt-4">
          <a
            href="/auth/login"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white transition"
          >
            Sign Up
          </a>
        </div>

        <p className="pt-10 text-sm text-gray-500">
          © 2025 <span className="text-cyan-400 font-medium">IndiCompute</span> | AI Compute System ⚡
        </p>
      </div>
    </main>
  );
}
