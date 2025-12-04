"use client";

import { useState } from "react";

interface AddAffixFormProps {
    onAdd: (prefix: string, root: string, suffix: string) => void;
    lang: "fa" | "en";
}

export default function AddAffixForm({ onAdd, lang }: AddAffixFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [prefix, setPrefix] = useState("");
    const [root, setRoot] = useState("");
    const [suffix, setSuffix] = useState("");
    const [error, setError] = useState("");

    const labels = {
        fa: {
            toggle: isOpen ? "➖ افزودن وند" : "➕ افزودن وند",
            prefix: "پیشوند جدید",
            root: "ریشه جدید",
            suffix: "پسوند جدید",
            submit: "✅ افزودن",
            errorNotPersian: "باید فارسی باشد",
        },
        en: {
            toggle: isOpen ? "➖ Add Affix" : "➕ Add Affix",
            prefix: "New Prefix",
            root: "New Root",
            suffix: "New Suffix",
            submit: "✅ Add",
            errorNotPersian: "must be in Persian",
        },
    };

    const l = labels[lang];

    const isPersian = (text: string) => /[\u0600-\u06FF]/.test(text);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const errors: string[] = [];
        if (prefix && !isPersian(prefix)) errors.push(lang === "fa" ? "پیشوند" : "Prefix");
        if (root && !isPersian(root)) errors.push(lang === "fa" ? "ریشه" : "Root");
        if (suffix && !isPersian(suffix)) errors.push(lang === "fa" ? "پسوند" : "Suffix");

        if (errors.length > 0) {
            setError(`${errors.join(", ")} ${l.errorNotPersian}`);
            return;
        }

        onAdd(prefix, root, suffix);
        setPrefix("");
        setRoot("");
        setSuffix("");
        setIsOpen(false);
    };

    return (
        <div className="mt-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors font-medium"
            >
                {l.toggle}
            </button>

            {isOpen && (
                <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder={l.prefix}
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            dir="rtl"
                        />
                        <input
                            type="text"
                            placeholder={l.root}
                            value={root}
                            onChange={(e) => setRoot(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            dir="rtl"
                        />
                        <input
                            type="text"
                            placeholder={l.suffix}
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            dir="rtl"
                        />
                    </div>

                    {error && (
                        <p className="mt-2 text-red-600 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        {l.submit}
                    </button>
                </form>
            )}
        </div>
    );
}
