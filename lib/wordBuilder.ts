// Word builder logic - TypeScript conversion from Python

const ZWJ = "\u200c"; // Zero-Width Non-Joiner
const NO_ZWJ_SUFFIXES = ["انه", "ی"]; // Suffixes that attach without ZWJ
const NO_ZWJ_AFTER = ["ا", "د", "ذ", "ر", "ز", "ژ", "و", "آ"]; // Characters that don't need ZWJ after them

/**
 * Joins two parts with ZWJ if needed
 */
function smartJoin(part1: string, part2: string, isSuffix: boolean = false): string {
    if (!part1 || !part2) {
        return part1 + part2;
    }

    // Special handling for NO_ZWJ_SUFFIXES
    if (isSuffix && NO_ZWJ_SUFFIXES.includes(part2)) {
        // Special case for "انه":
        // If part1 ends in "ه" (but not "اه"), do NOT attach the suffix
        // Also do NOT attach if part1 ends in "ا" or "آ"
        if (part2 === "انه") {
            if (part1.endsWith("ه") && !part1.endsWith("اه")) {
                return part1;
            }
            if (part1.endsWith("ا") || part1.endsWith("آ")) {
                return part1;
            }
        }

        return part1 + part2;
    }

    const lastChar = part1[part1.length - 1];

    if (NO_ZWJ_AFTER.includes(lastChar)) {
        return part1 + part2;
    } else {
        return part1 + ZWJ + part2;
    }
}

/**
 * Applies nominal form suffix based on the last letter of the word
 */
function applyNominalForm(word: string, lastPart: string = ""): string {
    if (!word) {
        return word;
    }

    const lastChar = word[word.length - 1];

    if (lastChar === 'ا' || lastChar === 'و') {
        return word + "یی";
    } else if (lastChar === 'ه') {
        // Exceptions for 'ه'
        if (word.endsWith("اه")) {
            return word + "ی";
        } else if (lastPart === "ده") {
            return word + "ی";
        } else {
            return word + ZWJ + "ای";
        }
    } else {
        return word + "ی";
    }
}

/**
 * Combines prefix, root, and suffix into a word
 */
export function combineAffixes(
    prefix: string,
    root: string,
    suffix: string,
    isNominal: boolean = false
): string {
    let word = root || "";

    if (prefix) {
        word = smartJoin(prefix, word);
    }

    if (suffix) {
        word = smartJoin(word, suffix, true);
    }

    if (isNominal) {
        // Determine the last part added (suffix if present, else root)
        const lastPart = suffix || root;
        word = applyNominalForm(word, lastPart);
    }

    return word;
}

/**
 * Calculate total possible combinations based on word structure
 */
export function calculateTotalCombinations(
    prefixes: string[],
    roots: string[],
    suffixes: string[],
    structure: "prefix-root" | "root-suffix" | "prefix-root-suffix"
): number {
    const prefixCount = prefixes.length;
    const rootCount = roots.length;
    const suffixCount = suffixes.length;

    // Count roots that can take "انه" suffix
    const validRootsForAneh = roots.filter(root => {
        return !(
            (root.endsWith("ه") && !root.endsWith("اه")) ||
            root.endsWith("ا") ||
            root.endsWith("آ")
        );
    }).length;

    // Count "انه" suffixes
    const anehCount = suffixes.filter(s => s === "انه").length;
    const otherSuffixCount = suffixCount - anehCount;

    switch (structure) {
        case "prefix-root":
            return prefixCount * rootCount;

        case "root-suffix":
            // For each root: can combine with all non-انه suffixes
            // Plus valid roots can combine with انه
            return rootCount * otherSuffixCount + validRootsForAneh * anehCount;

        case "prefix-root-suffix":
            // Similar logic but with prefixes
            return prefixCount * (rootCount * otherSuffixCount + validRootsForAneh * anehCount);

        default:
            return 0;
    }
}

/**
 * Convert number to Persian numerals
 */
export function convertToPersianNumerals(num: number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().split('').map(d => persianDigits[parseInt(d)] || d).join('');
}
