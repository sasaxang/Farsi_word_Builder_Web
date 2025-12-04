"use client";


interface AffixSelectorProps {
    label: string;
    items: string[];
    value: string;
    onChange: (value: string) => void;
    locked: boolean;
    onLockChange: (locked: boolean) => void;
    disabled?: boolean;
    lang: "fa" | "en";
}

export default function AffixSelector({
    label,
    items,
    value,
    onChange,
    locked,
    onLockChange,
    disabled = false,
    lang,
}: AffixSelectorProps) {
    const lockLabel = lang === "fa" ? "ثابت نگه‌دار" : "Lock";

    return (
        <div className="flex items-center gap-2 w-full mb-3">
            {/* Label */}
            <div className="flex-shrink-0 w-40">
                <p className="font-bold text-sm sm:text-base whitespace-nowrap">{label}</p>
            </div>

            {/* Dropdown */}
            <div className="flex-1 min-w-0">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base text-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    {items.map((item, idx) => (
                        <option key={idx} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {/* Lock Checkbox */}
            <div className="flex-shrink-0">
                <label className="flex items-center gap-1 cursor-pointer text-xs sm:text-sm">
                    <input
                        type="checkbox"
                        checked={locked}
                        onChange={(e) => onLockChange(e.target.checked)}
                        disabled={disabled}
                        className="w-4 h-4 accent-primary disabled:cursor-not-allowed"
                    />
                    <span>{lockLabel}</span>
                </label>
            </div>
        </div>
    );
}
