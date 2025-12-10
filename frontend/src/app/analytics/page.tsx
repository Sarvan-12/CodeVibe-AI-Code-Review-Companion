'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, analyticsService } from '@/services/api';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, TrendingUp, Code, Award, Bug } from 'lucide-react';

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [trends, setTrends] = useState<any[]>([]);
    const [languages, setLanguages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                await authService.me();

                const [summaryData, trendsData, languagesData] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getTrends(30),
                    analyticsService.getLanguageBreakdown()
                ]);

                setSummary(summaryData);
                setTrends(trendsData);
                setLanguages(languagesData);
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [router]);

    const LANGUAGE_COLORS = {
        python: '#3776ab',
        javascript: '#f7df1e',
        typescript: '#3178c6',
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Track your code quality improvements over time</p>
            </header>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Code size={24} className="text-indigo-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{summary?.total_analyses || 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Total Analyses</p>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp size={24} className="text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{summary?.average_score?.toFixed(1) || 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Average Score</p>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Award size={24} className="text-yellow-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{summary?.best_score?.toFixed(1) || 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Best Score</p>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Bug size={24} className="text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{summary?.total_issues_found || 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Issues Found</p>
                    </div>
                </div>

                {/* Trends Chart */}
                {trends.length > 0 && (
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Quality Trends (Last 30 Days)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    tick={{ fill: '#9ca3af' }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fill: '#9ca3af' }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                                <Line
                                    type="monotone"
                                    dataKey="average_score"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    name="Average Score"
                                    dot={{ fill: '#6366f1', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Language Breakdown */}
                {languages.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Language Distribution</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={languages}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ language, count }) => `${language}: ${count}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {languages.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={LANGUAGE_COLORS[entry.language as keyof typeof LANGUAGE_COLORS] || '#6366f1'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: 'none',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Language Performance</h2>
                            <div className="space-y-4">
                                {languages.map((lang) => (
                                    <div key={lang.language} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{
                                                    backgroundColor: LANGUAGE_COLORS[lang.language as keyof typeof LANGUAGE_COLORS] || '#6366f1'
                                                }}
                                            />
                                            <span className="text-gray-300 capitalize">{lang.language}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500 text-sm">{lang.count} analyses</span>
                                            <span className="text-white font-semibold">{lang.average_score.toFixed(1)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {summary?.total_analyses === 0 && (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                        <Code size={48} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No data yet</h3>
                        <p className="text-gray-500 mb-6">Start analyzing code to see your analytics</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md transition-all"
                        >
                            Analyze Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
