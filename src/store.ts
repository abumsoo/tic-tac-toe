import { writable, type Writable } from "svelte/store";

export let gameWin: Writable<boolean> = writable(false);
export let gameTie: Writable<boolean> = writable(false);