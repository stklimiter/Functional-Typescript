import {compose} from "./Compose";
import {Maybe} from "./Maybe";

type NoneEmptyNode<T> = [value: T, next: Node<T>]
type Node<T> = NoneEmptyNode<T> | None
type None = null

type Some<T> = T
type reduceFn<T> = (toCollect: T, collector: Node<T>) => Node<T>
type CreateNodeFn<T> = (gen: Generator<T>) => Node<T>
type CreatNodeType = <T>(gen: Generator<T>, previous: Node<T>) => Node<T>

const unwrap: <T>(n: Node<T>) => Maybe<T> = n => Maybe.of(n).map(i => i[0])
const next: <T>(n: Node<T>) => Node<T> = n => n ? n[1] : null
const emptyNode: None = null
const identity: <T>(n: T) => Node<T> = n => [n, null]
const push: <T>(n: Node<T>, c: T) => Node<T> = (n, v) => [v, n]
const pop: <T>(n: Node<T>) => [Maybe<T>, Node<T>] = (n) => [unwrap(n), next(n)]

const isEmpty: <T>(n: Node<T>) => n is None = (n): n is None => n === emptyNode
const map =  <T, L>(n: Node<T>, mapFn: (value: T) => L): Node<L> => isEmpty(n) ? n as Node<L> : [mapFn(n[0]), map(n[1], mapFn)]

const reduce = <T, I>(callbackfn: (previousValue: I, currentValue: T) => I, node: Node<T>, initialValue: I): I => !isEmpty(node) ? reduce(callbackfn, node[1], callbackfn(initialValue, node[0])) : initialValue

const createNodeReverse = <T>(gen: Generator<T>, previous: Node<T> = null): Node<T> => {
    const {value, done} = gen.next()
    return done ? previous : createNodeReverse(gen, [value, previous])
}
const createNode = <T>(gen: Generator<T>): Node<T> => {
    const {value, done} = gen.next()
    return done ? null : [value, createNode(gen)]
}

const yieldAll = function* <T>(n: Node<T>): Generator<T> {
    if (!isEmpty(n)) {
        yield n[0]
        yield* yieldAll(n[1])
    }
}

const yieldAllReverse = function* <T>(n: Node<T>): Generator<T> {
    if (!isEmpty(n)) {
        yield* yieldAll(n[1])
        yield n[0]
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


/**
 * 1 pointing to 2, 2, pointing to 3
 */

export class LinkedList<T> implements Iterable<T> {
    constructor(private root: Node<T>) {

    }

    private static of = <T>(root: Node<T>) => new LinkedList(root)

    static create = compose(create, LinkedList.of)
    static createReverse = compose(createReverse, LinkedList.of)

    public pop(): [Maybe<T>, LinkedList<T>] {
        const [maybe, node] = pop(this.root)
        return [maybe, LinkedList.of(node)]
    }

    public getSize() {
        return reduce((value, _) => value + 1, this.root, 0)
    }

    public isEmpty(): boolean {
        return this.root == emptyNode
    }

    public push(value: T): LinkedList<T> {
        return LinkedList.of(push(this.root, value))
    }

    public reverse(): LinkedList<T> {
        return LinkedList.createReverse(this)
    }

    * [Symbol.iterator](): Iterator<T> {
        yield* yieldAll(this.root)
    }
}




