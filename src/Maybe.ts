export interface Maybe<K> {

    map<T>(mapFunction: (from: K) => T): Maybe<T>

    isEmpty(): this is None<K>

    orElse(supplier: () => K): K
}

class None<K> implements Maybe<K> {
    map<T>(mapFunction: (from: K) => T): Maybe<T> {
        return empty as Maybe<T>;
    }

    isEmpty(): this is None<K> {
        return true;
    }

    orElse(supplier: () => K): K {
        return supplier()
    }
}

class Some<K> implements Maybe<K> {
    constructor(private value: K) {
    }

    map<T>(mapFunction: (from: K) => T): Maybe<T> {
        return new Some(mapFunction(this.value));
    }

    isEmpty(): this is None<K> {
        return false;
    }

    orElse(supplier: () => K): K {
        return this.value;
    }
}

const empty = new None()

function of<K>(value: K | null | undefined): Maybe<K> {
    if (value)
        return new Some<K>(value)
    return empty as Maybe<K>
}

export const Maybe = {
    empty<T>(): Maybe<T> {
        return empty as Maybe<T>
    },
    of: of
}