import Node, {createReverse} from "./LinkedList";

test('create a new linkedList stack, from edges', () => {
    const nodes = [1,2,3,4]
    console.log(nodes)

    console.log("create")

    let linked =  create(nodes)
    console.log(linked)

    console.log("createReverse")
    linked = createReverse(nodes)
    console.log(linked)
});

