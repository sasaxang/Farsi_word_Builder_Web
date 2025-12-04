"use client";

import { useState, useEffect } from "react";
import AffixSelector from "@/components/AffixSelector";
import WordDisplay from "@/components/WordDisplay";
import AddAffixForm from "@/components/AddAffixForm";
import { combineAffixes, calculateTotalCombinations, convertToPersianNumerals } from "@/lib/wordBuilder";
import type { Affixes, WordStructure, LockState } from "@/lib/types";
import affixesData from "@/data/affixes.json";

export default function Home() {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const sortPersian = (a: string, b: string) => new Intl.Collator("fa").compare(a, b);

  const [affixes, setAffixes] = useState<Affixes>(() => ({
    prefixes: [...affixesData.prefixes].sort(sortPersian),
    roots: [...affixesData.roots].sort(sortPersian),
    suffixes: [...affixesData.suffixes].sort(sortPersian),
  }));
  const [structure, setStructure] = useState<WordStructure>("prefix-root-suffix");
  const [isNominal, setIsNominal] = useState(false);

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] || "";

  // Calculate initial values once to avoid layout shift
  const [initialValues] = useState(() => {
    const p = getRandom(affixesData.prefixes);
    const r = getRandom(affixesData.roots);
    const s = getRandom(affixesData.suffixes);
    return {
      prefix: p,
      root: r,
      suffix: s,
      word: combineAffixes(p, r, s, false)
    };
  });

  const [selectedPrefix, setSelectedPrefix] = useState(initialValues.prefix);
  const [selectedRoot, setSelectedRoot] = useState(initialValues.root);
  const [selectedSuffix, setSelectedSuffix] = useState(initialValues.suffix);

  const [locks, setLocks] = useState<LockState>({
    prefix: false,
    root: false,
    suffix: false,
  });

  const [word, setWord] = useState(initialValues.word);

  // Initialize selections
  useEffect(() => {
    if (affixes.roots.length > 0 && !selectedRoot) {
      setSelectedRoot(affixes.roots[0]);
    }
    if (affixes.prefixes.length > 0 && !selectedPrefix) {
      setSelectedPrefix(affixes.prefixes[0]);
    }
    if (affixes.suffixes.length > 0 && !selectedSuffix) {
      setSelectedSuffix(affixes.suffixes[0]);
    }
  }, [affixes]);

  // Update word when selections change
  useEffect(() => {
    const newWord = combineAffixes(
      structure === "root-suffix" ? "" : selectedPrefix,
      selectedRoot,
      structure === "prefix-root" ? "" : selectedSuffix,
      isNominal
    );
    setWord(newWord);
  }, [selectedPrefix, selectedRoot, selectedSuffix, structure, isNominal]);

  const labels = {
    fa: {
      title: "گردونه واژه‌ساز فارسی",
      subtitle: "ساخت واژه‌های تصادفی با ترکیب پیشوند، ریشه و پسوند",
      langToggle: "EN",
      structure: "ساختار واژه",
      structures: [
        "پیشوند + ریشه",
        "ریشه + پسوند",
        "پیشوند + ریشه + پسوند",
      ],
      nominal: "حالت اسمی",
      prefix: `پیشوند (${convertToPersianNumerals(affixes.prefixes.length)} مورد)`,
      root: `ریشه (${convertToPersianNumerals(affixes.roots.length)} مورد)`,
      suffix: `پسوند (${convertToPersianNumerals(affixes.suffixes.length)} مورد)`,
      randomButton: "تصادفی بساز!",
      combinations: "تعداد کل ترکیبات ممکن:",
    },
    en: {
      title: "Persian Word Spinner",
      subtitle: "Generate random Persian words by combining prefix, root, and suffix",
      langToggle: "فا",
      structure: "Word Structure",
      structures: [
        "Prefix + Root",
        "Root + Suffix",
        "Prefix + Root + Suffix",
      ],
      nominal: "Nominal Form",
      prefix: `Prefix (${affixes.prefixes.length})`,
      root: `Root (${affixes.roots.length})`,
      suffix: `Suffix (${affixes.suffixes.length})`,
      randomButton: "Spin Random!",
      combinations: "Total Possible Combinations:",
    },
  };

  const l = labels[lang];

  const structureMap: Record<number, WordStructure> = {
    0: "prefix-root",
    1: "root-suffix",
    2: "prefix-root-suffix",
  };

  const handleStructureChange = (index: number) => {
    setStructure(structureMap[index]);
  };

  const handleRandomSpin = () => {
    const includePrefix = structure !== "root-suffix";
    const includeSuffix = structure !== "prefix-root";

    let newPrefix = selectedPrefix;
    let newRoot = selectedRoot;
    let newSuffix = selectedSuffix;

    // Root
    if (!locks.root) {
      if (locks.suffix && selectedSuffix === "انه") {
        const validRoots = affixes.roots.filter(r =>
          !((r.endsWith("ه") && !r.endsWith("اه")) || r.endsWith("ا") || r.endsWith("آ"))
        );
        newRoot = validRoots[Math.floor(Math.random() * validRoots.length)] || affixes.roots[0];
      } else {
        newRoot = affixes.roots[Math.floor(Math.random() * affixes.roots.length)];
      }
    }

    // Prefix
    if (includePrefix && !locks.prefix) {
      newPrefix = affixes.prefixes[Math.floor(Math.random() * affixes.prefixes.length)];
    } else if (!includePrefix) {
      newPrefix = "";
    }

    // Suffix
    if (includeSuffix && !locks.suffix) {
      if (newRoot && ((newRoot.endsWith("ه") && !newRoot.endsWith("اه")) || newRoot.endsWith("ا") || newRoot.endsWith("آ"))) {
        const validSuffixes = affixes.suffixes.filter(s => s !== "انه");
        newSuffix = validSuffixes[Math.floor(Math.random() * validSuffixes.length)] || affixes.suffixes[0];
      } else {
        newSuffix = affixes.suffixes[Math.floor(Math.random() * affixes.suffixes.length)];
      }
    } else if (!includeSuffix) {
      newSuffix = "";
    }

    setSelectedPrefix(newPrefix);
    setSelectedRoot(newRoot);
    setSelectedSuffix(newSuffix);
  };

  const handleAddAffix = (prefix: string, root: string, suffix: string) => {
    const newAffixes = { ...affixes };
    let added = false;

    if (prefix && !affixes.prefixes.includes(prefix)) {
      newAffixes.prefixes = [...affixes.prefixes, prefix].sort(sortPersian);
      added = true;
    }
    if (root && !affixes.roots.includes(root)) {
      newAffixes.roots = [...affixes.roots, root].sort(sortPersian);
      added = true;
    }
    if (suffix && !affixes.suffixes.includes(suffix)) {
      newAffixes.suffixes = [...affixes.suffixes, suffix].sort(sortPersian);
      added = true;
    }

    if (added) {
      setAffixes(newAffixes);
      // Note: In production, you'd save to backend/localStorage here
      alert(lang === "fa" ? "وند با موفقیت اضافه شد!" : "Affix added successfully!");
    }
  };

  const totalCombinations = calculateTotalCombinations(
    affixes.prefixes,
    affixes.roots,
    affixes.suffixes,
    structure
  );

  const combinationsText = lang === "fa"
    ? `${l.combinations} ${convertToPersianNumerals(totalCombinations)} مورد`
    : `${l.combinations} ${totalCombinations}`;

  const disablePrefix = structure === "root-suffix";
  const disableSuffix = structure === "prefix-root";

  return (
    <div className="min-h-screen bg-background" dir={lang === "fa" ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 font-vazir">
              {l.title}
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 text-center font-vazir">
              {l.subtitle}
            </p>
          </div>
          <button
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="ml-4 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm font-semibold"
            title="Switch language / تغییر زبان"
          >
            {l.langToggle}
          </button>
        </div>

        {/* Word Structure Selector */}
        <div className="flex items-center gap-2 w-full mb-3">
          <div className="flex-shrink-0">
            <p className="font-bold text-sm sm:text-base whitespace-nowrap">{l.structure}</p>
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={Object.keys(structureMap).find(k => structureMap[Number(k)] === structure)}
              onChange={(e) => handleStructureChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base text-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              {l.structures.map((s, idx) => (
                <option key={idx} value={idx}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0">
            <label className="flex items-center gap-1 cursor-pointer text-xs sm:text-sm">
              <span>{l.nominal}</span>
              <input
                type="checkbox"
                checked={isNominal}
                onChange={(e) => setIsNominal(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Affix Selectors */}
        <AffixSelector
          label={l.prefix}
          items={["", ...affixes.prefixes]}
          value={selectedPrefix}
          onChange={setSelectedPrefix}
          locked={locks.prefix}
          onLockChange={(locked) => setLocks({ ...locks, prefix: locked })}
          disabled={disablePrefix}
          lang={lang}
        />

        <AffixSelector
          label={l.root}
          items={affixes.roots}
          value={selectedRoot}
          onChange={setSelectedRoot}
          locked={locks.root}
          onLockChange={(locked) => setLocks({ ...locks, root: locked })}
          lang={lang}
        />

        <AffixSelector
          label={l.suffix}
          items={["", ...affixes.suffixes]}
          value={selectedSuffix}
          onChange={setSelectedSuffix}
          locked={locks.suffix}
          onLockChange={(locked) => setLocks({ ...locks, suffix: locked })}
          disabled={disableSuffix}
          lang={lang}
        />

        {/* Word Display */}
        <WordDisplay word={word} lang={lang} />

        {/* Random Button and Combinations */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <p className="text-sm sm:text-base text-gray-700 order-2 sm:order-1">
            {combinationsText}
          </p>
          <button
            onClick={handleRandomSpin}
            className="order-1 sm:order-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-base sm:text-lg"
          >
            {l.randomButton}
          </button>
        </div>

        {/* Add Affix Form */}
        <AddAffixForm onAdd={handleAddAffix} lang={lang} />
      </div>
    </div>
  );
}
