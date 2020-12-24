if (typeof parentNode == RootNode) {
    if (this.pairs[cursor] == null) {
        // Unpaired regions that are children of the root are just unpaired regions
        // We find out how long, add to the tree, call the next recursion layer
        while (this.pairs[cursor + 1] == null && cursor < right) {
            cursor += 1
        }

        let u: UnpairedNode = new UnpairedNode(parentNode, this.sequence_indices.slice(left, cursor), this.sequence.slice(left, cursor))
        parentNode.pushDaughters(u)

        // Check if we hit a helix or the end of the sequence
        if (this.pairs[cursor + 1] != null) {
            // Now that we've encountered a helix, spawn another recursion layer, passing root as parent
            this.recursive_tree_build(cursor + 1, this.pairs[cursor + 1], parentNode)
        }

        // Check if we're at the end of the sequence or not
        if (this.pairs[cursor + 1] + 1 < right) {
            // Now we have to continue with the rest of the sequence if there is more to go
            this.recursive_tree_build(this.pairs[cursor + 1] + 1, right, parentNode)
        }

    } else {
        // We're at a paired region, initiate a helix with root as parent
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