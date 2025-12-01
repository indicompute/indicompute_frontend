export default function Home() {
  return (
    <main className="min-h-screen bg-[#050A0F] text-white">
      
      {/* NAVBAR */}
      <nav className="w-full border-b border-white/10 backdrop-blur-lg fixed top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

    {/* LOGO */}
    <h1 className="text-2xl font-bold text-cyan-400">IndiCompute ⚡</h1>

    {/* MENU LINKS */}
    <div className="flex space-x-8 text-gray-300">
      <a href="#features" className="hover:text-white">Features</a>
      <a href="#pricing" className="hover:text-white">Pricing</a>
      <a href="#nodes" className="hover:text-white">GPU Nodes</a>
    </div>

    {/* AUTH BUTTONS */}
    <div className="flex space-x-2">
      <a
        href="/auth/login"
        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white"
      >
        Login
      </a>

      <a
        href="/auth/signup"
        className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-300"
      >
        Sign Up
      </a>
    </div>

  </div>
</nav>

      {/* HERO */}
      <section className="pt-32 pb-20 text-center">
        <h2 className="text-5xl font-extrabold text-white leading-tight">
          Decentralized <span className="text-cyan-400">GPU Computing</span>
          <br />for AI Startups & Developers
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg">
          Rent GPU power globally, deploy Jobs, manage Wallets — all with super-fast
          IndiCompute API. No complexity. Just compute.
        </p>

        <div className="mt-10 flex justify-center space-x-4">
          <a href="/signup" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-semibold">
            Get Started
          </a>
          <a href="#features" className="px-8 py-4 border border-white/10 rounded-lg hover:bg-white/10 text-lg">
            Learn More
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-[#0A1018]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-cyan-400">🚀 Fast API</h3>
            <p className="text-gray-400 mt-3">Create users, launch jobs, manage GPU nodes instantly.</p>
          </div>

          <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-cyan-400">💰 Wallet System</h3>
            <p className="text-gray-400 mt-3">Deposit, withdraw & track compute billing in real-time.</p>
          </div>

          <div className="p-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-cyan-400">🖥 GPU Nodes</h3>
            <p className="text-gray-400 mt-3">Connect your GPU globally and start earning.</p>
          </div>

        </div>
      </section>

      {/* GPU GRID */}
      <section id="nodes" className="py-20">
        <h3 className="text-center text-4xl font-bold">Supported GPU Models</h3>

        <div className="max-w-6xl mx-auto px-6 mt-12 grid md:grid-cols-4 gap-8">

          {["RTX 3090", "RTX 4090", "A100", "H100"].map((gpu) => (
            <div key={gpu} className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <p className="text-2xl font-semibold">{gpu}</p>
              <p className="text-gray-400 mt-2">Available worldwide</p>
            </div>
          ))}

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-[#0A1018]">
        <h3 className="text-center text-4xl font-bold mb-12">Simple Pricing</h3>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          <div className="p-8 bg-white/5 rounded-xl border border-cyan-500">
            <h4 className="text-2xl font-semibold">Starter</h4>
            <p className="text-4xl font-bold mt-4">₹29/hr</p>
            <p className="mt-4 text-gray-400">Run basic compute jobs.</p>
            <a href="/signup" className="mt-6 block text-center bg-cyan-500 hover:bg-cyan-600 py-3 rounded-lg">Choose</a>
          </div>

          <div className="p-8 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-2xl font-semibold">Pro</h4>
            <p className="text-4xl font-bold mt-4">₹79/hr</p>
            <p className="mt-4 text-gray-400">Heavy training & ML workloads.</p>
            <a href="/signup" className="mt-6 block text-center bg-white/10 hover:bg-white/20 py-3 rounded-lg">Choose</a>
          </div>

          <div className="p-8 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-2xl font-semibold">Enterprise</h4>
            <p className="text-4xl font-bold mt-4">Custom</p>
            <p className="mt-4 text-gray-400">For large GPU clusters & teams.</p>
            <a href="/contact" className="mt-6 block text-center border border-white/20 hover:bg-white/10 py-3 rounded-lg">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/10">
        <p className="text-gray-500 text-sm">© 2025 IndiCompute — All Rights Reserved.</p>
      </footer>
    </main>
  );
}