import { writable } from 'svelte/store';

export const selectionId = writable<string>(null);
export const page = writable<string>('landing');