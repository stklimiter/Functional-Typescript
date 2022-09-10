import {Functor} from "./Functor";

export interface Monad<K> extends Functor<K>, Iterable<K> {

    flatMap<T>(fn: (i: K) => Monad<T>): Monad<T>
}