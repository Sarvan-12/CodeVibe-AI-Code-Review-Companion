"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const data = await authService.login(username, password);
                localStorage.setItem('token', data.access_token);
                router.push('/dashboard');
            } else {
                await authService.register(email || `${username}@example.com`, username, password);
                setIsLogin(true);
                setError('');
                setTimeout(() => {
                    setError('Account created successfully. Please sign in.');
                }, 100);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#fafafa' }}>
            <div className="w-full max-w-sm">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">CV</span>
                    </div>
                    <span className="text-xl font-semibold text-neutral-900">CodeVibe</span>
                </Link>

                {/* Card */}
                <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-1">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-sm text-neutral-500">
                            {isLogin ? 'Sign in to continue' : 'Get started with CodeVibe'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-neutral-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-neutral-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-neutral-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className={`p-3 rounded-md text-sm ${error.includes('successfully')
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                                }`}>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                            {isLogin ? (
                                <>Don't have an account? <span className="text-blue-500 font-medium">Sign up</span></>
                            ) : (
                                <>Already have an account? <span className="text-blue-500 font-medium">Sign in</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
