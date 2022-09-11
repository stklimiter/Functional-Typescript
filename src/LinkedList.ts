import {compose} from "./Compose";
import {Maybe} from "./Maybe";

type NoneEmptyNode<T> = [value: T, next: Node<T>]
type Node<T> = NoneEmptyNode<T> | None
type None = null

const unwrap: <T>(n: Node<T>) => Maybe<T> = n => Maybe.of(n).map(i => i[0])
const next: <T>(n: Node<T>) => Node<T> = n => n ? n[1] : null
const push: <T>(n: Node<T>, c: T) => Node<T> = (n, v) => [v, n]
const pop: <T, W>(n: Node<T>, wrapper: (f: Node<T>) => W) => [Maybe<T>, W] = (n, w) => [unwrap(n), w(next(n))]

const isEmpty: <T>(n: Node<T>) => n is None = (n): n is None => n === null
const map = <T, L>(n: Node<T>, mapFn: (value: T) => L): Node<L> => isEmpty(n) ? n as Node<L> : [mapFn(n[0]), map(n[1], mapFn)]

const reduceRight = <T, I>(callbackfn: (previousValue: I, currentValue: T) => I, node: Node<T>, initialValue: I): I => !isEmpty(node) ? reduceRight(callbackfn, node[1], callbackfn(initialValue, node[0])) : initialValue
const reduce = <T, I>(callbackfn: (previousValue: I, currentValue: T) => I, node: Node<T>, initialValue: I): I => !isEmpty(node) ? callbackfn(reduce(callbackfn, node[1], initialValue), node[0]) : initialValue

const createNodeReverse = <T>(gen: Generator<T>, previous: Node<T> = null): Node<T> => {
    const {value, done} = gen.next()
    return done ? previous : createNodeReverse(gen, [value, previous])
}
const createNode = <T>(gen: Generator<T>): Node<T> => {
    const {value, done} = gen.next()
    return done ? null : [value, createNode(gen)]
}

const addToFront = <T>(node: Node<T>, value: T,): Node<T> => {
    return reduce((a, b) => [b, a], node, [value, null] as Node<T>)
}

const yieldAll = function* <T>(n: Node<T>): Generator<T> {
    if (!isEmpty(n)) {
        yield n[0]
        yield* yieldAll(n[1])
    }
}

const toGen = <T>(arr: Iterable<T>): Generator<T> => function* <T>() {
    yield* arr
}()

/**
 * n pointing to n-1, n-1 pointing to n-2
 */
const createReverse: <T>(itt: Iterable<T>) => Node<T> = compose(toGen, createNodeReverse)
const create: <T>(itt: Iterable<T>) => Node<T> = compose(toGen, createNode)

type LinkedList<T> = {
    /**
     * This linkedlist contains no values
     */
    isEmpty: () => boolean,
    /**
     * Returns the first value, if any, and a new LinkedList
     */
    pop: () => [Maybe<T>, LinkedList<T>],
    /**
     * Get current size of the linked list
     */
    getSize(): number,

    /**
     * Add a value to the front of the linked list, relinking all nodes
     * @param value
     */
    addToFront(value: T): LinkedList<T>,

    /**
     * Push a value to the back of a linked list
     * @param value
     */
    push(value: T): LinkedList<T>

    /**
     * Reverse this linked list
     */
    reverse(): LinkedList<T>
} & Iterable<T>

const LinkedList_impl = <T>(node: Node<T>): LinkedList<T> => ({
    isEmpty: () => isEmpty(node),
    pop: () => isEmpty(node) ? [Maybe.empty(), LinkedList_impl(node)] : pop(node, LinkedList_impl),
    getSize: () =>  reduce((value, _) => value + 1, node, 0),
    addToFront: (value) => LinkedList_impl(addToFront(node, value)),
    push: (value) => LinkedList_impl(push(node, value)),
    reverse: () => LinkedList_impl(createReverse(yieldAll(node))),
    *[Symbol.iterator](): Iterator<T> {
        yield* yieldAll(node)
    }
})

export const LinkedList = {
    /**
     * Creates a Linked list, with the first element as its tail [1,2,3] => [1, [2, [3, null]
     */
     asQueue: compose(create, LinkedList_impl),

    /*
     * Creates a Linked list, with the last element as its tail [1,2,3] => [3, [2, [1, null]
     */
     asStack: compose(createReverse, LinkedList_impl)
}