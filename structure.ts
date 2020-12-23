export class Structure {
    name: string
    sequence: string
    db: string

    constructor(name: string, sequence: string, db: string){
        this.name = name
        this.sequence = sequence
        this.db = db

        this.parse_db()
    }
    
    private parse_db(){
        console.log(this.db)
    }
}

export class Node {

}

export class unpairedNode extends Node {

}

export class pairedNode extends Node {

}

export class hairpinNode extends Node {

}

export class StructureTree {
    
}