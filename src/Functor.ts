export interface Functor<K> {


    map<T>(mapFn: (value: K) => T): Functor<T>
}