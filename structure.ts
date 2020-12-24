export class Structure {
    name: string
    sequence: string
    db: string
    pairs: Array<number>
    structureTree: StructureTree

    constructor(name: string, sequence: string, db: string) {
        this.name = name
        this.sequence = sequence
        this.db = db

        this.pairs = this.db_to_pairs(this.db)
        this.structureTree = this.pairs_to_tree(this.pairs)

        console.log('Initialized Structure object')
        console.log(this.pairs)
    }
    
    private db_to_pairs(db: string): Array<number> {
        /*
        Given a dot-bracket secondary structure, convert into an array where the ith position encodes
        the index of the corresponding base-paired position. Unpaired positions are null.
        
        Uses a heap type approach. Push values while we see '('s, pop values whenever we see ')'s
        */
        let cursor: number = 0;
        let pairs: Array<number> = Array.apply(null, Array(db.length)).map(function () {})
        let left_helix_positions: Array<number> = []

        while (cursor < db.length) {
            if (db.charAt(cursor) == '.') {
                pairs[cursor] = null
            } else if (db.charAt(cursor) == '(') {
                left_helix_positions.push(cursor)
            } else if (db.charAt(cursor) == ')') {
                let left_helix_position: number = left_helix_positions.pop()
                pairs[cursor] = left_helix_position
                pairs[left_helix_position] = cursor
            }
            cursor += 1
        }

        return pairs
    }

    private pairs_to_tree(pairs: Array<number>) {
        /*
        Convert the pairs array from db_to_pairs into a proper tree representation
        */
        console.log('Initialized StructureTree')

        let tree: StructureTree = new StructureTree()
        let root: RootNode = new RootNode()

        tree.root = root

        let left: number = 0
        let right: number = pairs.length

        // Execute our recursive tree building, using our new root node as root
        this.recursive_tree_build(left, right, root)
        
        return tree
    }

    private recursive_tree_build(left: number, right: number, parentNode: Node) {
        /*
        Here, we scan the secondary structure from left to right, building up our structure tree recursively.

        1. When the parent node is root, we scan from left to right until we encounter a helix
        2. When parent is not root, we first check 

        */

        if (left == right) {
            return
        }

        let cursor: number = left

        if (typeof parentNode == RootNode) {
            if (this.pairs[cursor] == null) {
                // Unpaired regions that are children of the root are just unpaired regions
                // We find out how long, add to the tree, call the next recursion layer
                do {
                    cursor += 1
                } while (this.pairs[cursor] == null && cursor < right)

                let u: UnpairedNode = new UnpairedNode(parentNode, [], '')
                parentNode.pushDaughters(u)

                // Now that we've encountered a helix, spawn another recursion layer
                if (this.pairs[cursor] != null) {
                    this.recursive_tree_build(cursor, this.pairs[cursor], parentNode)
                }

                // Now we have to continue with the rest of the sequence if there is more to go
                if (this.pairs[cursor] < right) {
                    this.recursive_tree_build(this.pairs[cursor] + 1, right, parentNode)
                }
            } else {
                // We're at a paired region, initiate a helix
                let left_cursor: number = left
                let right_cursor: number = right

                // Make and build up the helix node

                // Add it to the parent node
                
                // Spawn the next recursive layer with our helix node as parent

            }
        } else {
            // We're deep in a structure!
            // We need to figure out how to distinguish between the types of children...

            // First, check if both left and right are unpaired. If so, we're at an internal or terminal loop. If left to right is unpaired, then terminal hairpin.
            if (this.pairs[left] == this.pairs[right] == null) {
                let left_cursor: number = left
                let right_cursor: number = right

                while (this.pairs[left_cursor + 1] == null) {
                    left_cursor += 1
                }

                if (left_cursor == right) {
                    // We're at a terminal hairpin. Make and add the node.
                }
                
            } else {
                if (this.pairs[left] == null) {
                // Check if we have a left bulge 
                } else if (this.pairs[right] == null) {
                // Check if we have a right bulge
                } else {
                // We're at an internal loop!
                }
            }
        }
    }
}



export class Node {
    /*
    All Nodes have attributes parent (single node), daughters (left to right array of nodes),
    and sequence indices (which characters in the sequence are owned by this node)
    */
    private parent: Node
    private daughters: Array<Node> = []
    private sequence_indices: Array<Number>

    constructor(parent: Node, sequence_indices: Array<Number>) {
        this.parent = parent
        this.sequence_indices = sequence_indices
    }

    public pushDaughters(daughter: Node){
        this.daughters.push(daughter)
    }
}

export class UnpairedNode extends Node {
    /*
    Unpaired Nodes are just an unpaired sequence
    */
    private sequence: string;

    constructor(parent: Node, sequence_indices: Array<Number>, sequence: string) {
        super(parent, sequence_indices)
        this.sequence = sequence
        console.log('Made an UnpairedNode')
    }
}

export class StemNode extends Node {
    /*
    Stem Nodes encode an uninterrupted double-stranded region
    */
   private pairs: Array<Array>;

   constructor(parent: Node, sequence_indices: Array<Number>, pairs: Array<Array>) {
       super(parent, sequence_indices)
       this.pairs = pairs
       console.log('Made a StemNode')
   }
}

export class TerminalLoopNode extends Node {
    /*
    TerminalLoop Nodes are the end of the line
    */
   private sequence: string;

   constructor(parent: Node, sequence_indices: Array<Number>, sequence: string) {
       super(parent, sequence_indices)
       this.sequence = sequence
       console.log('Made a TerminalLoopNode')
   }
}

export class BulgeNode extends Node {

}

export class InternalLoop extends Node {

}

export class RootNode extends Node{
    // This is a special node that just holds the top
    constructor() {
        super(null, null)
        console.log('Made a RootNode')
    }
}

export class StructureTree {
    private _root: Node;

    public get root(): Node {
        return this._root;
    }

    public set root(n): Node {
        this._root = n
    }

    constructor() {
        this._root = null
    }
}

