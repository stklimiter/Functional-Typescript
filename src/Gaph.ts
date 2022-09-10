export type GraphNode<K> = (NonEmptyGraph<K> | EmptyGraph)

type NonEmptyGraph<K> = [K,  NonEmptyGraph<K>[]]
type EmptyGraph = [ null,  []]

type GraphSupplier<K> = NonEmptyGraph<K>




class SingleLinkedGraph<K> {
    constructor(private root: NonEmptyGraph<K>) {
    }
    

    static create<K>(rootValue: K, linked: (value: K) => K[], repo: NodeRepo<K> = new NodeRepo<K>()): NonEmptyGraph<K> {
        return [rootValue, linked(rootValue).map(v => repo.getOrCreate(v, () => this.create(v, linked, repo)))]
    }


}

class NodeRepo<K>{
    values: NonEmptyGraph<K>[] = []
    getOrCreate(value: K, supplier: () => NonEmptyGraph<K>): NonEmptyGraph<K>{
        let found = this.values.find(n => n[0] == value)
        if (!found){
            found = supplier()
            this.values.push(found)
        }
        return found
    }
}