import { v4 as uuidv4 } from 'uuid';

const db = new Map<string, string>();

export function saveToDb(key: string, data: any) {
    db.set(key, JSON.stringify(data));
}

export function loadFromDb(key: string): any {
    const data = db.get(key);
    return data ? JSON.parse(data) : null;
}

export function generateKey(): string {
    return uuidv4();
}
