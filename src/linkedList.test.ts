import {LinkedList} from "./LinkedList";
import {Maybe} from "./Maybe";

describe("Test linked list", () => {
    describe("testing the creation of linked list", () => {
        test('create a new linkedList', () => {
            const nodes = [1, 2, 3, 4]
            let linked = LinkedList.asQueue(nodes)
            let linkedA = [...linked]
            expect(linkedA).toStrictEqual([1, 2, 3, 4])
        });

        test('create a new linkedList reversed', () => {
            const nodes = [1, 2, 3, 4]
            let linked = LinkedList.asStack(nodes)
            let linkedA = [...linked]
            expect(linkedA).toStrictEqual([4, 3, 2, 1])
        });
    })
    describe("testing get size", () => {

        test('getSize non-empty array', () => {
            const nodes = [1, 2, 3, 4, 9, 10]
            let linked = LinkedList.asQueue(nodes)
            expect(linked.getSize()).toBe(6)
        });

        test('getSize, empty array', () => {
            const nodes: number[] = []
            let linked = LinkedList.asQueue(nodes)
            expect(linked.getSize()).toBe(0)
        });
    })

    describe("testing popping of linked list", () => {
        test('pop linked list, returns smaller list and value', () => {
            const nodes = [1, 2, 3, 4]
            let linked = LinkedList.asQueue(nodes)

            let value: Maybe<number> = Maybe.empty();
            expect(linked.isEmpty()).toBe(false)
            expect(value.orElse(() => -1)).toBe(-1)
            expect(linked.getSize()).toBe(4)

            const [value_1, linked_1] = linked.pop()
            expect(linked_1.isEmpty()).toBe(false)
            expect(value_1.orElse(() => -1)).toBe(1)
            expect(linked_1.getSize()).toBe(3)

            const [value_2, linked_2] = linked_1.pop()
            expect(linked_2.isEmpty()).toBe(false)
            expect(value_2.orElse(() => -1)).toBe(2)
            expect(linked_2.getSize()).toBe(2)

            const [value_3, linked_3] = linked_2.pop()
            expect(linked_3.isEmpty()).toBe(false)
            expect(value_3.orElse(() => -1)).toBe(3)
            expect(linked_3.getSize()).toBe(1)

            const [value_4, linked_4] = linked_3.pop()
            expect(linked_4.isEmpty()).toBe(true)
            expect(value_4.orElse(() => -1)).toBe(4)
            expect(linked_4.getSize()).toBe(0)

            const [value_5, linked_5] = linked_4.pop()
            expect(linked_5.isEmpty()).toBe(true)
            expect(value_5.orElse(() => -1)).toBe(-1)
            expect(linked_5.getSize()).toBe(0)
        });
        test('pop immutability', () => {
            const nodes = [1, 2, 3, 4]
            let linked_0 = LinkedList.asQueue(nodes)

            const linked_1 = linked_0.pop()[1]
            const linked_2 = linked_1.pop()[1]
            const linked_3 = linked_2.pop()[1]
            const linked_4 = linked_3.pop()[1]
            const linked_5 = linked_4.pop()[1]
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4])
            expect([...linked_1]).toStrictEqual([2, 3, 4])
            expect([...linked_2]).toStrictEqual([3, 4])
            expect([...linked_3]).toStrictEqual([4])
            expect([...linked_4]).toStrictEqual([])
            expect([...linked_5]).toStrictEqual([])
        });
    })
    describe("testing reverse of linked list", () => {
        test('test reverse', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.reverse()
            expect([...linked_1]).toStrictEqual([6, 5, 4, 3, 2, 1])
        });
        test('test reverse, and back', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.reverse()
            expect([...linked_1]).toStrictEqual([6, 5, 4, 3, 2, 1])
            let linked_2 = linked_1.reverse()
            expect([...linked_2]).toStrictEqual([1, 2, 3, 4, 5, 6])
        });
        test('test reverse, immutable', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.reverse()
            expect([...linked_1]).toStrictEqual([6, 5, 4, 3, 2, 1])
            let linked_2 = linked_1.reverse()
            expect([...linked_2]).toStrictEqual([1, 2, 3, 4, 5, 6])
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            expect([...linked_1]).toStrictEqual([6, 5, 4, 3, 2, 1])
        });
    })
    describe("testing push", () => {
        test('test push', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.push(0)
            expect([...linked_1]).toStrictEqual([0, 1, 2, 3, 4, 5, 6])

        });
        test('test pushing twice,', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.push(0).push(-1).push(-2)
            expect([...linked_1]).toStrictEqual([-2, -1, 0, 1, 2, 3, 4, 5, 6])
        });
        test('test push, immutable', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.push(0)
            expect([...linked_1]).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
        });
    })
    describe("testing add to front", () => {
        test('test add to front', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.addToFront(7)
            expect([...linked_1]).toStrictEqual([1, 2, 3, 4, 5, 6, 7])

        });
        test('test add to front twice,', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.addToFront(7).addToFront(8).addToFront(9)
            expect([...linked_1]).toStrictEqual([1, 2, 3, 4, 5, 6, 7,8 ,9])
        });
        test('test add to front, immutable', () => {
            const nodes = [1, 2, 3, 4, 5, 6]
            let linked_0 = LinkedList.asQueue(nodes)
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
            let linked_1 = linked_0.addToFront(7)
            expect([...linked_1]).toStrictEqual([ 1, 2, 3, 4, 5, 6, 7])
            expect([...linked_0]).toStrictEqual([1, 2, 3, 4, 5, 6])
        });
    })
})


