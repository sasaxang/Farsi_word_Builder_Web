"use client";

interface WordDisplayProps {
    word: string;
    lang: "fa" | "en";
}

export default function WordDisplay({ word, lang }: WordDisplayProps) {
    return (
        <>
            {/* Divider */}
            <hr className="my-4 border-gray-300" />

            {/* Word Display */}
            <div
                className="w-full min-h-[80px] flex justify-center items-center text-center bg-primary text-white font-bold rounded-xl px-6 py-4 mb-8"
                dir="rtl"
                style={{
                    fontSize: "clamp(24px, 8vw, 48px)",
                    fontFamily: "'Calibri', 'Vazir', 'Comic Sans MS', cursive",
                }}
            >
                <span className="w-full text-center">
                    {word}
                </span>
            </div>
        </>
    );
}
