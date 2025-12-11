"use client";

import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import { analysisService, authService } from '@/services/api';
import { useRouter } from 'next/navigation';

const DEFAULT_CODE = {
    python: '# Paste your Python code here\n\ndef hello():\n    print("Hello World")\n',
    javascript: '// Paste your JavaScript code here\n\nfunction hello() {\n  console.log("Hello World");\n}\n',
    typescript: '// Paste your TypeScript code here\n\nfunction hello(): void {\n  console.log("Hello World");\n}\n'
};

export default function Dashboard() {
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(DEFAULT_CODE.python);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await authService.me();
                setUser(userData);
            } catch (err) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [router]);

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        const isDefaultCode = Object.values(DEFAULT_CODE).some(template => code === template);
        if (isDefaultCode) {
            setCode(DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.python);
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await analysisService.submitCode(code, language);
            setResult(data);
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || 'Analysis failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-neutral-600">Loading...</p>
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">CV</span>
                                </div>
                                <span className="text-base font-semibold text-neutral-900">CodeVibe</span>
                            </div>
                            <nav className="hidden md:flex items-center gap-1">
                                <button className="px-3 py-1.5 text-sm font-medium text-neutral-900 bg-neutral-100 rounded-md">
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => router.push('/history')}
                                    className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                >
                                    History
                                </button>
                                <button
                                    onClick={() => router.push('/analytics')}
                                    className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                                >
                                    Analytics
                                </button>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600 hidden sm:block">{user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Editor */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Editor Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-semibold text-neutral-900">Code Editor</h2>
                                <LanguageSelector value={language} onChange={handleLanguageChange} />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Code Editor */}
                        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                            <CodeEditor
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                language={language}
                            />
                        </div>
                    </div>

                    {/* Right Column - Results */}
                    <div className="space-y-4">
                        {/* Results Card */}
                        <div className="bg-white border border-neutral-200 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Analysis Results</h3>

                            {result ? (
                                <div className="space-y-6">
                                    {/* Score */}
                                    <div className="text-center py-4">
                                        <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-neutral-200 rounded-full">
                                            <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                                                {result.score.toFixed(0)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-2">Quality Score</p>
                                    </div>

                                    {/* Issues */}
                                    <div>
                                        <h4 className="text-sm font-medium text-neutral-900 mb-3">Issues</h4>
                                        {result.bugs_detected?.length === 0 && result.refactor_suggestions?.length === 0 ? (
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                                                <p className="text-sm text-emerald-700">No issues found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {result.bugs_detected?.map((bug: any, i: number) => (
                                                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-md">
                                                        <p className="text-sm font-medium text-red-900">{bug.type}</p>
                                                        <p className="text-xs text-red-700 mt-1">{bug.message}</p>
                                                        {bug.line && <p className="text-xs text-red-600 mt-1">Line {bug.line}</p>}
                                                    </div>
                                                ))}
                                                {result.refactor_suggestions?.map((issue: any, i: number) => (
                                                    <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                                                        <p className="text-sm font-medium text-amber-900">{issue.symbol || 'Suggestion'}</p>
                                                        <p className="text-xs text-amber-700 mt-1">{issue.message}</p>
                                                        <p className="text-xs text-amber-600 mt-1">Line {issue.line}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Metrics */}
                                    <div>
                                        <h4 className="text-sm font-medium text-neutral-900 mb-3">Metrics</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md text-center">
                                                <span className="block text-xl font-semibold text-neutral-900">
                                                    {result.complexity_metrics?.cyclomatic_complexity || 0}
                                                </span>
                                                <span className="text-xs text-neutral-600">Complexity</span>
                                            </div>
                                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md text-center">
                                                <span className="block text-xl font-semibold text-neutral-900">
                                                    {code.split('\n').length}
                                                </span>
                                                <span className="text-xs text-neutral-600">Lines</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-sm">Run analysis to see results</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
