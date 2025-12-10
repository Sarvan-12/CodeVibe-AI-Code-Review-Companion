"use client";

import React from 'react';
import { ArrowRight, Code2, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                CodeVibe
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">AI-Powered Code Analysis</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Write Better Code</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Real-time code analysis, intelligent auto-fixes, and personalized style recommendations.
              Elevate your coding experience with ML-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Analyzing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all hover:-translate-y-1"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-slate-400 text-lg">
              Everything you need to write cleaner, better code
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-Time Analysis
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Get instant feedback on your code quality, bugs, and potential improvements as you type.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Auto-Fix
              </h3>
              <p className="text-slate-400 leading-relaxed">
                One-click fixes for common issues. AST-based refactoring that understands your code.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Style Learning
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Learns your coding style and provides personalized recommendations over time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Security Scanning
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Detect security vulnerabilities and get recommendations to fix them before deployment.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Multi-Language
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Support for Python, JavaScript, TypeScript, and more. One tool for all your code.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Track your progress, view trends, and see how your code quality improves over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-3xl backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Level Up Your Code?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of developers writing better code with CodeVibe
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold text-white">CodeVibe</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 CodeVibe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
