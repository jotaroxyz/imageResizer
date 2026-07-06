import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const Atom = atom<string | null>(null);

export const useId = () => useAtomValue(Atom);
export const useSetId = () => useSetAtom(Atom);
export const useIdState = () => useAtom(Atom);