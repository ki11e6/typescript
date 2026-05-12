type Bucket<K, V> = Array<[K, V]>;

class HashTable<K extends string | number, V> {
  private dataMap: Array<Bucket<K, V> | undefined>;

  constructor(size: number = 7) {
    this.dataMap = new Array(size);
  }

  private _hash(key: K): number {
    let hash = 0;
    const s = String(key);
    for (const char of s) {
      hash = (hash + char.charCodeAt(0) * 23) % this.dataMap.length;
    }
    return hash;
  }

  set(key: K, value: V): this {
    const index = this._hash(key);
    const bucket = this.dataMap[index] ?? (this.dataMap[index] = []);
    bucket.push([key, value]);
    return this;
  }

  get(key: K): V | undefined {
    const index = this._hash(key);
    const bucket = this.dataMap[index];
    if (!bucket) return undefined;
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }
}

const newHashTable = new HashTable<string, number>();
newHashTable.set("hello", 1);
newHashTable.set("world", 2);
newHashTable.set("hi", 45);
console.log(newHashTable.get("hi"));
