import React from 'react';

interface LanguageSelectorProps {
    value: string;
    onChange: (language: string) => void;
}

const LANGUAGES = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '📜' },
    { value: 'typescript', label: 'TypeScript', icon: '📘' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400 font-medium">Language:</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:bg-gray-750"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.icon} {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
