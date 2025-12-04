// Type definitions for Farsi Word Builder

export interface Affixes {
    prefixes: string[];
    roots: string[];
    suffixes: string[];
}

export interface WordParts {
    prefix: string;
    root: string;
    suffix: string;
    word: string;
}

export type WordStructure =
    | "prefix-root"
    | "root-suffix"
    | "prefix-root-suffix";

export interface LockState {
    prefix: boolean;
    root: boolean;
    suffix: boolean;
}
