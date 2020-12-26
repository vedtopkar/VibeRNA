/*
Declaration of handy string literal types
*/
// Declare a node "type" string literal
export type NodeType = "UnpairedNode" | "StemNode" | "TerminalLoopNode" | "BulgeNode" | "InternalLoopNode" | "MultiLoopNode";

// Declare a "BulgeSide" string literal type that can only be "left" or "right"
export type BulgeSide = "right" | "left";


/*
Declaration of a Node class, and inheriting node classes for the different type of tree nodes (sequence features)
*/
export class Node {
    /*
    All Nodes have attributes parent (single node), daughters (left to right array of nodes),
    and sequence indices (which characters in the sequence are owned by this node)
    */
    public parent: Node;
    public daughters: Array<Node> = [];
    private sequence_indices: Array<Number>;
    public type: string;

    constructor(parent: Node, sequence_indices: Array<Number>) {
        this.parent = parent;
        this.sequence_indices = sequence_indices;
    }

    public pushDaughters(daughter: Node) {
        this.daughters.push(daughter);
    }

}

export class UnpairedNode extends Node {
    /*
    Unpaired Nodes are just an unpaired sequence
    */
    public sequence: string;
    public type: NodeType = 'UnpairedNode';

    constructor(parent: Node, sequence_indices: Array<Number>, sequence: string) {
        super(parent, sequence_indices);
        this.sequence = sequence;
        console.log('Made an UnpairedNode ' + sequence);
    }
}

export class StemNode extends Node {
    /*
    Stem Nodes encode an uninterrupted double-stranded region
    */
    public pairs: Array<Array<string>>;
    public type: NodeType = 'StemNode';

    constructor(parent: Node, sequence_indices: Array<Number>, pairs: Array<Array<string>>) {
        super(parent, sequence_indices);
        this.pairs = pairs;
        console.log('Made a StemNode ' + pairs);
    }
}

export class TerminalLoopNode extends Node {
    /*
    TerminalLoop Nodes are the end of the line
    */
    public sequence: string;
    public type: NodeType = 'TerminalLoopNode';

    constructor(parent: Node, sequence_indices: Array<Number>, sequence: string) {
        super(parent, sequence_indices);
        this.sequence = sequence;
        console.log('Made a TerminalLoopNode: ' + sequence);
    }
}


export class BulgeNode extends Node {
    /*
    BulgeNodes have a "left" or "right" sequence, but not both! Uses the string literal type declared above.
    */
    public type: NodeType = 'BulgeNode';
    private bulge_side: BulgeSide;
    private sequence: string;

    constructor(parent: Node, bulge_side: BulgeSide, sequence: string, sequence_indices: Array<number>) {
        super(parent, sequence_indices);
        this.sequence = sequence;
        this.bulge_side = bulge_side;
        console.log('Made a BulgeNode');
    }
}

export class InternalLoop extends Node {
    /*
    Internal loop are like BulgeNodes but have "left" AND "right" sequence that lead to a single stem
    */
    public type: NodeType = 'InternalLoopNode';
    public left_sequence: string;
    public right_sequence: string;

    constructor(parent: Node, left_sequence: string, right_sequence: string, sequence_indices: Array<number>) {
        super(parent, sequence_indices);
        this.left_sequence = left_sequence;
        this.right_sequence = right_sequence;
        console.log('Made an internal loop');
    }
}

export class MultiLoop extends Node {
    /*
    Multi loops are complex internal loops that have both unpaired regions and stems
    */
    public type: NodeType = 'MultiLoopNode';


}

export class RootNode extends Node {
    // This is a special node that just holds the top
    public type: NodeType = 'RootNode';

    constructor() {
        super(null, null);
        console.log('Made a RootNode');
    }
}

export class StructureTree {
    // A class that holds the root of a tree (that's it for now!)
    private _root: Node;

    public get root(): Node {
        return this._root;
    }

    public set root(n: Node) {
        this._root = n;
    }

    constructor() {
        this._root = null;
    }
}
