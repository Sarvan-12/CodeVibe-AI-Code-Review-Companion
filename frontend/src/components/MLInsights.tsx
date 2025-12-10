"use client";

import React from 'react';
import { Brain, Bug, Shield, AlertTriangle, TrendingUp } from 'lucide-react';

interface BugPrediction {
    line_number: number;
    severity: string;
    bug_type: string;
    description: string;
    confidence: number;
    suggestion?: string;
}

interface CodeSmell {
    line_number: number;
    smell_type: string;
    description: string;
    severity: string;
}

interface SecurityIssue {
    line_number: number;
    vulnerability_type: string;
    description: string;
    severity: string;
}

interface MLInsightsProps {
    bugs: BugPrediction[];
    smells: CodeSmell[];
    security: SecurityIssue[];
}

export default function MLInsights({ bugs, smells, security }: MLInsightsProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const totalIssues = bugs.length + smells.length + security.length;

    if (totalIssues === 0) {
        return (
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                <Brain className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-emerald-400 font-medium">No issues detected!</p>
                <p className="text-sm text-slate-400 mt-2">Your code looks clean and secure.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bugs */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Bug className="w-5 h-5 text-red-400" />
                        <span className="text-2xl font-bold text-white">{bugs.length}</span>
                    </div>
                    <p className="text-sm text-slate-400">Potential Bugs</p>
                </div>

                {/* Code Smells */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span className="text-2xl font-bold text-white">{smells.length}</span>
                    </div>
                    <p className="text-sm text-slate-400">Code Smells</p>
                </div>

                {/* Security */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <span className="text-2xl font-bold text-white">{security.length}</span>
                    </div>
                    <p className="text-sm text-slate-400">Security Issues</p>
                </div>
            </div>

            {/* Bug Predictions */}
            {bugs.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Bug className="w-4 h-4 text-red-400" />
                        Bug Predictions
                    </h4>
                    {bugs.map((bug, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getSeverityColor(bug.severity)}`}>
                                            {bug.severity.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">Line {bug.line_number}</span>
                                        <span className="text-xs text-slate-400">
                                            {Math.round(bug.confidence * 100)}% confidence
                                        </span>
                                    </div>
                                    <p className="text-sm text-white font-medium mb-1">{bug.bug_type}</p>
                                    <p className="text-sm text-slate-400">{bug.description}</p>
                                    {bug.suggestion && (
                                        <p className="text-xs text-cyan-400 mt-2">💡 {bug.suggestion}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Code Smells */}
            {smells.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Code Smells
                    </h4>
                    {smells.map((smell, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-amber-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getSeverityColor(smell.severity)}`}>
                                            {smell.severity.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">Line {smell.line_number}</span>
                                    </div>
                                    <p className="text-sm text-white font-medium mb-1">{smell.smell_type}</p>
                                    <p className="text-sm text-slate-400">{smell.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Security Issues */}
            {security.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-400" />
                        Security Vulnerabilities
                    </h4>
                    {security.map((issue, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-orange-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getSeverityColor(issue.severity)}`}>
                                            {issue.severity.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">Line {issue.line_number}</span>
                                    </div>
                                    <p className="text-sm text-white font-medium mb-1">{issue.vulnerability_type}</p>
                                    <p className="text-sm text-slate-400">{issue.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
