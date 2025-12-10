"use client";

import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import AutoFixPanel from '@/components/AutoFixPanel';
import MLInsights from '@/components/MLInsights';
import { analysisService, authService } from '@/services/api';
import { useRouter } from 'next/navigation';
import {
    Play, History, LogOut, Code2, Sparkles, TrendingUp,
    AlertCircle, CheckCircle, Zap, BarChart3
} from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState<'results' | 'fixes' | 'insights'>('results');
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
            setActiveTab('results');
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

    const handleApplyFix = (fixId: string) => {
        console.log('Applying fix:', fixId);
        // TODO: Implement fix application
    };

    const handleDismissFix = (fixId: string) => {
        console.log('Dismissing fix:', fixId);
        // TODO: Implement fix dismissal
    };

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-cyan-500';
        if (score >= 60) return 'from-amber-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-7 h-7 text-blue-500" />
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                    CodeVibe
                                </span>
                            </div>
                            <nav className="hidden md:flex items-center gap-1">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-3 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => router.push('/history')}
                                    className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    History
                                </button>
                                <button
                                    onClick={() => router.push('/analytics')}
                                    className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Analytics
                                </button>
                            </nav>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-sm text-slate-300">Welcome, {user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-white">Code Editor</h2>
                                </div>
                                <LanguageSelector value={language} onChange={handleLanguageChange} />
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        <span>Analyze Code</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 fade-in">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 font-medium">Analysis Error</p>
                                    <p className="text-red-300/80 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Code Editor */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                            <CodeEditor
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                language={language}
                            />
                        </div>
                    </div>

                    {/* Right Column - Results */}
                    <div className="space-y-4">
                        {/* Quick Stats */}
                        {result && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <TrendingUp className="w-4 h-4 text-blue-400" />
                                        <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                                            {result.score.toFixed(0)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">Quality Score</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <AlertCircle className="w-4 h-4 text-cyan-400" />
                                        <span className="text-2xl font-bold text-white">
                                            {(result.bugs_detected?.length || 0) + (result.refactor_suggestions?.length || 0)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">Issues Found</p>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                            {/* Tab Headers */}
                            <div className="flex border-b border-slate-700 bg-slate-900/50">
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'results'
                                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Results
                                </button>
                                <button
                                    onClick={() => setActiveTab('fixes')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'fixes'
                                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Auto-Fix
                                </button>
                                <button
                                    onClick={() => setActiveTab('insights')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'insights'
                                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    ML Insights
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 max-h-[600px] overflow-y-auto">
                                {activeTab === 'results' && (
                                    result ? (
                                        <div className="space-y-6 fade-in">
                                            {/* Score Display */}
                                            <div className="text-center">
                                                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreGradient(result.score)} p-1`}>
                                                    <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center">
                                                        <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                                                            {result.score.toFixed(0)}
                                                        </span>
                                                        <span className="text-xs text-slate-400 mt-1">Score</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Issues */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-blue-400" />
                                                    Issues Detected
                                                </h3>
                                                {result.bugs_detected?.length === 0 && result.refactor_suggestions?.length === 0 ? (
                                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                        <p className="text-emerald-400 text-sm">No issues found! Great job.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {result.bugs_detected?.map((bug: any, i: number) => (
                                                            <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-red-400 font-medium text-sm">{bug.type}</p>
                                                                        <p className="text-slate-300 text-sm mt-1">{bug.message}</p>
                                                                        {bug.line && <p className="text-slate-500 text-xs mt-1">Line {bug.line}</p>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {result.refactor_suggestions?.map((issue: any, i: number) => (
                                                            <div key={i} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-amber-400 font-medium text-sm">{issue.symbol || 'Suggestion'}</p>
                                                                        <p className="text-slate-300 text-sm mt-1">{issue.message}</p>
                                                                        <p className="text-slate-500 text-xs mt-1">Line {issue.line}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Complexity Metrics */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4 text-blue-400" />
                                                    Complexity Metrics
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-center">
                                                        <span className="block text-2xl font-bold text-blue-400">
                                                            {result.complexity_metrics?.cyclomatic_complexity || 0}
                                                        </span>
                                                        <span className="text-xs text-slate-400">Cyclomatic</span>
                                                    </div>
                                                    <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-center">
                                                        <span className="block text-2xl font-bold text-cyan-400">
                                                            {code.split('\n').length}
                                                        </span>
                                                        <span className="text-xs text-slate-400">Lines</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                            <Zap className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-center">Run analysis to see results</p>
                                        </div>
                                    )
                                )}

                                {activeTab === 'fixes' && (
                                    <AutoFixPanel
                                        fixes={[]}
                                        onApplyFix={handleApplyFix}
                                        onDismissFix={handleDismissFix}
                                    />
                                )}

                                {activeTab === 'insights' && (
                                    <MLInsights
                                        bugs={[]}
                                        smells={[]}
                                        security={[]}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
