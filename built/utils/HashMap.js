"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HashMap {
    constructor(equals = ((k1, k2) => k1 === k2), hash = ((k) => `${k}`)) {
        this.equals = equals;
        this.hash = hash;
        this.map = new Map();
        this.size = 0;
    }
    ;
    set(key, value) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            let found = false;
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    found = true;
                    kvPairs[i][1] = value;
                    break;
                }
            }
            if (!found) {
                kvPairs.push([key, value]);
                this.size++;
            }
        }
        else {
            this.map.set(hash, [[key, value]]);
            this.size++;
        }
        return this;
    }
    ;
    get(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    return kvPairs[i][1];
                }
            }
        }
        return null;
    }
    ;
    has(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    return true;
                }
            }
        }
        return false;
    }
    ;
    delete(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    kvPairs.splice(i, 1);
                    if (kvPairs.length === 0) {
                        this.map.delete(kvPairs);
                    }
                    this.size--;
                    break;
                }
            }
        }
        return this;
    }
    ;
    getSize() {
        return this.size;
    }
    ;
    clear() {
        this.map.clear();
        this.size = 0;
        return this;
    }
    ;
}
exports.HashMap = HashMap;
;
//# sourceMappingURL=HashMap.js.map