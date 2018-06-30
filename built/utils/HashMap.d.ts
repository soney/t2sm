export declare type EqualityCheck<T> = (t1: T, t2: T) => boolean;
export declare type Hash<T> = (t: T) => string;
export declare class HashMap<K, V> {
    private equals;
    private hash;
    private map;
    private size;
    constructor(equals?: EqualityCheck<K>, hash?: Hash<K>);
    set(key: K, value: V): this;
    get(key: K): V;
    has(key: K): boolean;
    delete(key: K): this;
    getSize(): number;
    clear(): this;
}
