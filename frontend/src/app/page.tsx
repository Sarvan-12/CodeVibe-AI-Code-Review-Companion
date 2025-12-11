"use client";

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">CV</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900">CodeVibe</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full">
            AI-Powered Code Analysis
          </span>
        </div>
        <h1 className="text-5xl font-semibold text-neutral-900 mb-6 leading-tight">
          Write better code,<br />faster
        </h1>
        <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
          Real-time code analysis with intelligent auto-fixes and personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Start analyzing
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-900 font-medium rounded-md transition-colors"
          >
            View demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Real-time Analysis
            </h3>
            <p className="text-sm text-neutral-600">
              Get instant feedback on code quality, bugs, and improvements as you type.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Smart Auto-fix
            </h3>
            <p className="text-sm text-neutral-600">
              One-click fixes for common issues with AST-based refactoring.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Style Learning
            </h3>
            <p className="text-sm text-neutral-600">
              Learns your coding style and provides personalized recommendations.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Security Scanning
            </h3>
            <p className="text-sm text-neutral-600">
              Detect vulnerabilities and get recommendations before deployment.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Multi-language
            </h3>
            <p className="text-sm text-neutral-600">
              Support for Python, JavaScript, TypeScript, and more languages.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-lg">
            <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Analytics
            </h3>
            <p className="text-sm text-neutral-600">
              Track progress and see how your code quality improves over time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-12 bg-neutral-50 border border-neutral-200 rounded-lg">
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4">
            Ready to improve your code?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join developers writing better code with CodeVibe
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">CV</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">CodeVibe</span>
            </div>
            <p className="text-sm text-neutral-500">
              © 2024 CodeVibe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
