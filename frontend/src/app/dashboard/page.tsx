'use client';
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';
import { analysisService, authService } from '@/services/api';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Play, History, LogOut, AlertCircle, BarChart3 } from 'lucide-react';

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
        // Update code to default for new language if current code is a default template
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

    const navigateToHistory = () => {
        router.push('/history');
    };

    const scoreData = result ? [
        { name: 'Score', value: result.score },
        { name: 'Penalty', value: 100 - result.score },
    ] : [];

    const COLORS = ['#4f46e5', '#1f2937'];

    if (!user) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    CodeVibe
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={navigateToHistory}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                    >
                        <History size={20} />
                        <span>History</span>
                    </button>
                    <span className="text-gray-400">Welcome, {user.username}</span>
                    <button onClick={handleLogout} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-200">Editor</h2>
                            <LanguageSelector value={language} onChange={handleLanguageChange} />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Analyzing...' : <><Play size={18} /> Analyze Code</>}
                        </button>
                    </div>
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg flex items-center gap-3">
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    <CodeEditor value={code} onChange={(val) => setCode(val || '')} language={language} />
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg h-full">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Analysis Results</h2>

                        {result ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col items-center">
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={scoreData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    {scoreData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-center mt-[-110px] mb-[60px]">
                                        <span className="text-4xl font-bold text-white">{result.score.toFixed(0)}</span>
                                        <p className="text-xs text-gray-400">Quality Score</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-300 border-b border-gray-700 pb-2">Issues Detected</h3>
                                    {result.bugs_detected.length === 0 && result.refactor_suggestions.length === 0 ? (
                                        <p className="text-green-400 text-sm">No issues found! Great job.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {result.bugs_detected.map((bug: any, i: number) => (
                                                <div key={i} className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                        <span className="text-red-400 font-medium text-sm">{bug.type}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{bug.message}</p>
                                                    {bug.line && <p className="text-gray-500 text-xs mt-1">Line: {bug.line}</p>}
                                                </div>
                                            ))}
                                            {result.refactor_suggestions.map((issue: any, i: number) => (
                                                <div key={i} className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                        <span className="text-yellow-400 font-medium text-sm">{issue.symbol || 'Suggestion'}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{issue.message}</p>
                                                    <p className="text-gray-500 text-xs mt-1">Line: {issue.line}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-800">
                                    <h3 className="font-medium text-gray-300 mb-2">Complexity</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-800 p-3 rounded-lg text-center">
                                            <span className="block text-2xl font-bold text-indigo-400">{result.complexity_metrics?.cyclomatic_complexity || 0}</span>
                                            <span className="text-xs text-gray-500">Cyclomatic</span>
                                        </div>
                                        <div className="bg-gray-800 p-3 rounded-lg text-center">
                                            <span className="block text-2xl font-bold text-purple-400">{code.split('\n').length}</span>
                                            <span className="text-xs text-gray-500">Lines</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                                <Play size={48} className="mb-4 opacity-20" />
                                <p>Run analysis to see results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
