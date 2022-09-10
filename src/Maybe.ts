export interface Maybe<K> {

    map<T>(mapFunction: (from: K) => T): Maybe<T>

}

class EmptyMaybe<K> implements Maybe<K> {
    map<T>(mapFunction: (from: K) => T): Maybe<T> {
        return empty as Maybe<T>;
    }
}

class NonEmptyMaybe<K> implements Maybe<K> {
    constructor(private value: K) {
    }

    map<T>(mapFunction: (from: K) => T): Maybe<T> {
        return new NonEmptyMaybe(mapFunction(this.value));
    }
}

const empty = new EmptyMaybe()

function of<K>(value: K | null | undefined): Maybe<K> {
    if (value)
        return new NonEmptyMaybe<K>(value)
    return empty as Maybe<K>
}

export const Maybe = {
    empty: new EmptyMaybe(),
    of: of
}