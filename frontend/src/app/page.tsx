import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-6">
        CodeVibe
      </h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl">
        Your AI-powered code review companion. Detect bugs, analyze quality, and improve your coding style instantly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/25"
        >
          Get Started
        </Link>
        <Link
          href="https://github.com"
          className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
