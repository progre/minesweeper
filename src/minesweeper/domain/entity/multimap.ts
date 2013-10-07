export = MultiMap;
class MultiMap<TKey, TValue> {
    items: { [key: string]: TValue[] } = {};

    get(key: TKey): TValue[] {
        return this.items[this.createKey(key)] || [];
    }

    put(key: TKey, value: TValue) {
        var k = this.createKey(key);
        var array = this.items[k];
        if (array == null) {
            // V‹Kì¬
            this.items[k] = [value];
            return true;
        }
        if (array.indexOf(value) >= 0)
            return false;// Šù‚ÉŠÜ‚Ü‚ê‚Ä‚¢‚é
        array.push(value);
        return true;
    }

    remove(key: TKey, value: TValue) {
        var k = this.createKey(key);
        var array = this.items[k];
        if (array == null)
            return false;
        var i = array.indexOf(value);
        if (i < 0)
            return false;
        array.splice(i, 1);
        if (array.length === 0) {
            delete this.items[k];
        }
        return true;
    }

    removeValueAll(value: TValue) {
        for (var key in this.items) {
            this.remove(key, value);
        }
    }

    /** @abstract */
    /** @protected */
    createKey(key: TKey): string {
        // abstract
        throw new Error('Implement me!');
    }
}
