class HashTable {
  private dataMap: Array<any>;
  constructor(size: number = 7) {
    this.dataMap = new Array(size);
  }

  _hash(key: string) {
    let hash = 0;
    for (const char of key) {
      hash = (hash + char.charCodeAt(0) * 23) % this.dataMap.length;
    }
    return hash;
  }

  set(key: string, value: any) {
    let index = this._hash(key);
    !this.dataMap[index] && (this.dataMap[index] = []);
    this.dataMap[index].push([key, value]);
    return this;
  }

  get(key: string) {
    let index = this._hash(key);
    if (this.dataMap[index]) {
      for (let i = 0; i < this.dataMap[index].length; i++) {
        if (this.dataMap[index][i][0] === key) {
          return this.dataMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}

let newHashTable = new HashTable();
newHashTable.set("hello", 1);
newHashTable.set("world", 2);
newHashTable.set("hi", 45);
console.log(newHashTable.get("hi"));
