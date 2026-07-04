import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const Atom = atom<File | null>(null);

export const useFile = () => useAtomValue(Atom);
export const useSetFile = () => useSetAtom(Atom);
export const useFileState = () => useAtom(Atom);