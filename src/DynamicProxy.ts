import { loadFromDb, saveToDb, generateKey } from './database';

export class DynamicProxy<T extends object> {
    private _loaded: boolean;
    private target: T;
    private key: string;

    constructor(target: T, key: string = generateKey()) {
        this._loaded = false;
        this.target = target;
        this.key = key;
    }

    private load() {
        if (!this._loaded) {
            const data = loadFromDb(this.key);
            if (data) {
                Object.assign(this.target, data);
            }
            this._loaded = true;
        }
    }

    private save() {
        saveToDb(this.key, this.target);
    }

    // Static method to wrap an object in a DynamicProxy
    static create<T extends object>(target: T, key?: string): T {
        const dynamicProxy = new DynamicProxy(target, key);

        // Create the proxy
        return new Proxy(dynamicProxy.target, {
            get(target, prop, receiver) {
                if (prop === '_loaded') return dynamicProxy._loaded;
                dynamicProxy.load();

                const result = Reflect.get(target, prop, receiver);

                // If accessing a nested object, wrap it in a DynamicProxy
                if (result && typeof result === 'object' && !Array.isArray(result)) {
                    return DynamicProxy.create(result as object);
                }
                return result;
            },

            set(target, prop, value) {
                dynamicProxy.load();
                const success = Reflect.set(target, prop, value);

                if (success) {
                    dynamicProxy.save();
                }
                return success;
            }
        }) as T;
    }
}
