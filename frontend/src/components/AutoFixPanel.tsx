"use client";

import React, { useState } from 'react';
import { Check, X, Code2, AlertCircle } from 'lucide-react';

interface FixSuggestion {
    fix_id: string;
    fix_type: string;
    title: string;
    description: string;
    line_start: number;
    line_end: number;
    before_code: string;
    after_code: string;
    diff: string;
    confidence: number;
    auto_applicable: boolean;
}

interface AutoFixPanelProps {
    fixes: FixSuggestion[];
    onApplyFix: (fixId: string) => void;
    onDismissFix: (fixId: string) => void;
}

export default function AutoFixPanel({ fixes, onApplyFix, onDismissFix }: AutoFixPanelProps) {
    const [expandedFix, setExpandedFix] = useState<string | null>(null);

    const getFixTypeColor = (type: string) => {
        switch (type) {
            case 'security': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'performance': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'style': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            case 'refactor': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-emerald-400';
        if (confidence >= 0.6) return 'text-amber-400';
        return 'text-slate-400';
    };

    if (fixes.length === 0) {
        return (
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No auto-fix suggestions available</p>
                <p className="text-sm text-slate-500 mt-2">Your code looks good!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    Auto-Fix Suggestions ({fixes.length})
                </h3>
            </div>

            {fixes.map((fix) => (
                <div
                    key={fix.fix_id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all"
                >
                    {/* Fix Header */}
                    <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getFixTypeColor(fix.fix_type)}`}>
                                        {fix.fix_type.toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-medium ${getConfidenceColor(fix.confidence)}`}>
                                        {Math.round(fix.confidence * 100)}% confidence
                                    </span>
                                </div>
                                <h4 className="text-white font-medium mb-1">{fix.title}</h4>
                                <p className="text-sm text-slate-400">{fix.description}</p>
                                <p className="text-xs text-slate-500 mt-2">
                                    Lines {fix.line_start}-{fix.line_end}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setExpandedFix(expandedFix === fix.fix_id ? null : fix.fix_id)}
                                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    {expandedFix === fix.fix_id ? 'Hide' : 'View'} Diff
                                </button>
                                {fix.auto_applicable && (
                                    <button
                                        onClick={() => onApplyFix(fix.fix_id)}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30 text-white rounded-lg transition-all flex items-center gap-1"
                                    >
                                        <Check className="w-4 h-4" />
                                        Apply
                                    </button>
                                )}
                                <button
                                    onClick={() => onDismissFix(fix.fix_id)}
                                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Diff View */}
                    {expandedFix === fix.fix_id && (
                        <div className="border-t border-slate-700 bg-slate-900/50">
                            <div className="p-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Before */}
                                    <div>
                                        <div className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                                            <X className="w-3 h-3" />
                                            Before
                                        </div>
                                        <pre className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-sm text-slate-300 overflow-x-auto font-mono">
                                            {fix.before_code}
                                        </pre>
                                    </div>

                                    {/* After */}
                                    <div>
                                        <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                            <Check className="w-3 h-3" />
                                            After
                                        </div>
                                        <pre className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-sm text-slate-300 overflow-x-auto font-mono">
                                            {fix.after_code}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
