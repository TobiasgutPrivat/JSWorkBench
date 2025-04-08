import { serialize } from "v8";

export function serializeObject (object: any): string {
    switch (typeof object) {
        // differ for:
        // object
        // Array
        // Primitives
        // Module-specific objects (classes, functions, etc.)
    }
    return "";
}