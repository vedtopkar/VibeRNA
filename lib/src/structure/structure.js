"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure = exports.StructureTree = void 0;
var DrawConfig_1 = require("../draw/DrawConfig");
var nodes_1 = require("./nodes");
var StructureTree = /** @class */ (function () {
    function StructureTree() {
        // A class that holds the root of a tree (that's it for now!)
        this.root = new nodes_1.RootNode();
    }
    return StructureTree;
}());
exports.StructureTree = StructureTree;
var Structure = /** @class */ (function () {
    function Structure(name, sequence, db) {
        this.drawConfig = DrawConfig_1.DefaultConfig;
        this.name = name;
        this.sequence = sequence;
        this.sequence_indices = Array.from(Array(this.sequence.length).keys());
        this.db = db;
        this.pairs = this.db_to_pairs(this.db);
        this.structureTree = this.pairs_to_tree(this.pairs);
    }
    Structure.prototype.db_to_pairs = function (db) {
        /*
        Given a dot-bracket secondary structure, convert into an array where the ith position encodes
        the index of the corresponding base-paired position. Unpaired positions are null.
        
        Uses a heap approach. Push values when we see '('s, pop values whenever we see ')'s
        */
        var cursor = 0;
        var pairs = Array.apply(null, Array(db.length)).map(function () { });
        var left_helix_positions = [];
        while (cursor <= db.length) {
            if (db.charAt(cursor) == '.') {
                pairs[cursor] = null;
            }
            else if (db.charAt(cursor) == '(') {
                left_helix_positions.push(cursor);
            }
            else if (db.charAt(cursor) == ')') {
                var left_helix_position = left_helix_positions.pop();
                pairs[cursor] = left_helix_position;
                pairs[left_helix_position] = cursor;
            }
            cursor += 1;
        }
        return pairs;
    };
    Structure.prototype.pairs_to_tree = function () {
        /*
        Convert the pairs array from db_to_pairs into a proper tree representation

        Here we initialize our root node and tree. Then we kick off a "dispatch" function that scans through
        the structure and kicks off recursive tree builds as we encounter different structure elements.
        */
        var tree = new StructureTree();
        var root = new nodes_1.RootNode();
        tree.root = root;
        var left = 0;
        var right = this.pairs.length;
        // Execute our recursive tree building, using our new root node as root
        this.recursive_tree_dispatch(left, right, root);
        return tree;
    };
    Structure.prototype.find_end_of_unpaired = function (start_index, reverse) {
        if (reverse === void 0) { reverse = false; }
        /*
        This is a helper function that scans through an unpaired region and returns the index of the
        first non-unpaired nucleotide. Can be run in forward or reverse (forward is default).
        */
        var cursor = start_index;
        var increment = 1;
        if (reverse) {
            increment = -1;
        }
        while (this.pairs[cursor + increment] == null) {
            cursor += increment;
        }
        return cursor;
    };
    Structure.prototype.recursive_tree_dispatch = function (left, right, parentNode) {
        /*
        This is where we scan a complex region (either root or an internal loop) and spawn recursive tree builds
        */
        var left_cursor = left;
        var right_cursor = left;
        while (right_cursor <= right) {
            if (this.pairs[right_cursor] == null) {
                // Make an unstructured node
                while (this.pairs[right_cursor + 1] == null && right_cursor <= right) {
                    right_cursor += 1;
                }
                var u = new nodes_1.UnpairedNode(parentNode, this.sequence.slice(left_cursor, right_cursor + 1));
                parentNode.pushDaughters(u);
                left_cursor = right_cursor = right_cursor + 1;
            }
            else {
                // Kick off recursive tree build for a stem
                this.recursive_tree_build(left_cursor, this.pairs[left_cursor], parentNode);
                left_cursor = right_cursor = this.pairs[left_cursor] + 1;
            }
        }
    };
    Structure.prototype.recursive_tree_build = function (left, right, parentNode) {
        /*
        Here, we  traverse the secondary structure to recursively build up the structure tree
        */
        var cursor = left;
        // Calculate if 0, 1, or 2 of the nucleotides at the left and right boundaries are paired
        var n_boundary_paired = [this.pairs[left], this.pairs[right]].filter(Boolean).length;
        if (n_boundary_paired == 2 && this.pairs[left] == right && this.pairs[right] == left) {
            // We are at a stem!
            var stem_indices = [];
            var stem_pairs = [];
            var left_cursor = left;
            var right_cursor = right;
            // Consume the stem and make its node
            while (this.pairs[left_cursor] != null && this.pairs[right_cursor] != null && this.pairs[left_cursor] == right_cursor && this.pairs[right_cursor] == left_cursor) {
                stem_indices.push(left_cursor);
                stem_indices.push(right_cursor);
                stem_pairs.push([this.sequence.charAt(left_cursor), this.sequence.charAt(right_cursor)]);
                left_cursor += 1;
                right_cursor -= 1;
            }
            // Make the node, add it to the parent
            var s = new nodes_1.StemNode(parentNode, stem_pairs);
            parentNode.pushDaughters(s);
            // Kick off the next recursive layer, with the stem we just made as parent
            this.recursive_tree_build(left_cursor, right_cursor, s);
        }
        else if (n_boundary_paired == 1 && (this.find_end_of_unpaired(left) + 1 == this.pairs[right] || this.find_end_of_unpaired(right, true) - 1 == this.pairs[left])) {
            // We are at a bulge!
            var sequence = void 0;
            var left_cursor = left;
            var right_cursor = right;
            var b = new nodes_1.BulgeNode(parentNode);
            // Depending on which side the bulge is on, arrange the stem and unpaired nodes in one order or the other
            // There is probably a much simpler way to do this...
            if (this.pairs[left] == null) {
                // left side bulge
                left_cursor = this.find_end_of_unpaired(left);
                sequence = this.sequence.slice(left, left_cursor + 1);
                left_cursor += 1;
                var u = new nodes_1.UnpairedNode(b, sequence);
                b.pushDaughters(u);
                this.recursive_tree_build(left_cursor, right_cursor, b);
            }
            else {
                // right side bulge
                right_cursor = this.find_end_of_unpaired(right, true);
                sequence = this.sequence.slice(right_cursor, right + 1);
                right_cursor -= 1;
                var u = new nodes_1.UnpairedNode(b, sequence);
                this.recursive_tree_build(left_cursor, right_cursor, b);
                b.pushDaughters(u);
            }
            parentNode.pushDaughters(b);
        }
        else if (n_boundary_paired == 0 && this.find_end_of_unpaired(left) == right) {
            // We are at a terminal loop!
            var t = new nodes_1.TerminalLoopNode(parentNode);
            var u = new nodes_1.UnpairedNode(t, this.sequence.slice(left, right + 1));
            t.pushDaughters(u);
            parentNode.pushDaughters(t);
            // End of the line!
        }
        else {
            // We are in an internal/multi loop
            var left_cursor = this.find_end_of_unpaired(left);
            var right_cursor = this.find_end_of_unpaired(right, true);
            var m = new nodes_1.MultiLoopNode(parentNode);
            parentNode.pushDaughters(m);
            this.recursive_tree_dispatch(left, right, m);
        }
    };
    return Structure;
}());
exports.Structure = Structure;
