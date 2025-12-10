'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, analysisService } from '@/services/api';
import { ArrowLeft, Calendar, Code, TrendingUp, TrendingDown } from 'lucide-react';

interface HistoryItem {
    id: number;
    score: number;
    created_at: string;
    snippet_id: number;
    bugs_detected: any[];
    refactor_suggestions: any[];
    complexity_metrics: any;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await authService.me();
                setUser(userData);

                const historyData = await analysisService.getHistory();
                setHistory(historyData);
            } catch (err) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [router]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-900/20 border-green-900/50';
        if (score >= 60) return 'bg-yellow-900/20 border-yellow-900/50';
        return 'bg-red-900/20 border-red-900/50';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Analysis History
                </h1>
                <p className="text-gray-400 mt-2">View your past code analyses and track improvements</p>
            </header>

            <div className="max-w-6xl mx-auto">
                {history.length === 0 ? (
                    <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                        <Code size={48} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No analyses yet</h3>
                        <p className="text-gray-500 mb-6">Start analyzing code to see your history here</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md transition-all"
                        >
                            Analyze Code
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, index) => {
                            const prevScore = index < history.length - 1 ? history[index + 1].score : item.score;
                            const scoreDiff = item.score - prevScore;
                            const isImprovement = scoreDiff > 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(item.score)}`}>
                                                <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                                                    {item.score.toFixed(0)}
                                                </span>
                                                <span className="text-gray-500 text-sm ml-1">/100</span>
                                            </div>
                                            {index < history.length - 1 && scoreDiff !== 0 && (
                                                <div className={`flex items-center gap-1 ${isImprovement ? 'text-green-400' : 'text-red-400'}`}>
                                                    {isImprovement ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    <span className="text-sm font-medium">
                                                        {isImprovement ? '+' : ''}{scoreDiff.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar size={16} />
                                            <span>{formatDate(item.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gray-800 p-3 rounded-lg">
                                            <p className="text-gray-400 text-xs mb-1">Issues Found</p>
                                            <p className="text-xl font-semibold text-white">
                                                {item.bugs_detected.length + item.refactor_suggestions.length}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800 p-3 rounded-lg">
                                            <p className="text-gray-400 text-xs mb-1">Bugs Detected</p>
                                            <p className="text-xl font-semibold text-red-400">
                                                {item.bugs_detected.length}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800 p-3 rounded-lg">
                                            <p className="text-gray-400 text-xs mb-1">Complexity</p>
                                            <p className="text-xl font-semibold text-purple-400">
                                                {item.complexity_metrics?.cyclomatic_complexity || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
