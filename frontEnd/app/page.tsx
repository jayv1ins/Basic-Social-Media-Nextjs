import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen    text-black flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl text-black font-extrabold mb-6">Incognitor</h1>
        <p className="text-lg md:text-xl text-black b-8">
          Share Freely, Safely, Anonymously. 
          Escape judgment and protect your identity in the digital world.
        </p>
        <Link href="/register">
          <p className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-2xl transition">
            Get Started
          </p>
        </Link>

          <Link href="/feed">
          <p className="inline-block m-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-2xl transition">
            View here
          </p>
        </Link>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid gap-8 md:grid-cols-3 text-center max-w-6xl w-full">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">True Anonymity</h3>
          <p className="text-neutral-400">No real names. No profiles. Just your thoughts.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Safe Expression</h3>
          <p className="text-neutral-400">Share what matters without fear of judgment or backlash.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Privacy First</h3>
          <p className="text-neutral-400">No tracking. No data selling. Full control over your posts.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Incognitor. All rights reserved.
      </footer>
    </main>
  );
}