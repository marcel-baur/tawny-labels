import { writable } from 'svelte/store';
import { FirebaseBatch } from './firebase-types';

export const selectionId = writable<string>(null);
export const page = writable<string>('landing');
export const batch = writable<FirebaseBatch>({});