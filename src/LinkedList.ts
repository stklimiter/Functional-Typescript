import {Functor} from "./Functor";
import {Monad} from "./Monad";
import {compose} from "./Compose";

type RootNode = null
type Node<T> = [value: T, next: Node<T>] | RootNode

type None = null
type Some<T> = T
type Maybe<T> = Some<T> | None
type reduceFn<T> = (toCollect: T, collector: Node<T>) => Node<T>
type CreateNodeFn<T> = (gen: Generator<T>) => Node<T>
type CreatNodeType = <T>(gen: Generator<T>, previous: Node<T>) => Node<T>

const unwrap: <T>(n: Node<T>) => Maybe<T> | null = n => n ? n[0] : null
const next: <T>(n: Node<T>) => Node<T> = n => n ? n[1] : null
const emptyNode: RootNode = null
const identity: <T>(n: T) => Node<T> = n => [n, null]
const push: <T>(n: Node<T>, c: T) => Node<T> = (n, v) => [v, n]
const pop: <T>(n: Node<T>) => [Maybe<T>, Node<T>] = (n) => [unwrap(n), next(n)]

const createNode = <T>(gen: Generator<T>, previous: Node<T> = null): Node<T> => {
    const {value, done} = gen.next()
    return done ? previous : createNode(gen, [value, previous])
}
const createNodeReverse = <T>(gen: Generator<T>): Node<T> => {
    const {value, done} = gen.next()
    return [value, done ? null : createNodeReverse(gen)]
}

const toGen = <T>(arr: Iterable<T>): Generator<T> => function* <T>() {
    yield* arr
}()

/**
 * n pointing to n-1, n-1 pointing to n-2
 */
const create: <T>(itt: Iterable<T>) => Node<T> = compose(toGen, createNode)
const createReverse: <T>(itt: Iterable<T>) => Node<T> = compose(Node.toGen, Node.createNodeReverse)


/**
 * 1 pointing to 2, 2, pointing to 3
 */

export class LinkedList<T> implements Iterable<T> {
    constructor(private root: Node<T>) {
    }

    private static of = <T>(root: Node<T>) => new LinkedList(root)

    static create = compose(Node.create, LinkedList.of)
    static createReverse = compose(Node.createReverse, LinkedList.of)

    public pop(): [Maybe<T>, LinkedList<T>] {
        const [maybe, node] = Node.pop(this.root)
        return [maybe, LinkedList.of(node)]
    }

    public push(value: T): LinkedList<T> {
        return LinkedList.of(Node.push(this.root, value))
    }

    public reverse(): LinkedList<T> {
        return LinkedList.createReverse(this)
    }

    * [Symbol.iterator](): Iterator<T> {
        let pointer = this.root
        while (pointer != null) {
            yield pointer[0]
            pointer = pointer[1]
        }
    }
}




