# VibeRNA

A modern, browser-based RNA structure drawing application.

## Installation

Git clone this repo, then install dependencies using `yarn install`.

## Development

Use `yarn dev` to auto hotload changes while development.

## Deployment

Deploy to gh-pages (demo site), using `yarn deploy`, which both generates a production build and commits/pushes it to the gh-pages branch.

## Entry points

The hope is that we can write this package to allow it to be used in a variety of settings. This includes:

-   As an online interface served through gh-pages (input directly into interface)
-   As a linkable tool (input through URLstring)
-   As an embeddedable visualization interface (input through URLstring, present a simplified interactive interface)
-   As a CLI utility that can be executed and scripted via node.js

## Modes

The hope is to have three overall modes:

-   Arc plot: x axis is nucleotide index, arcs connect base-paired nucleotides. Can show reactivity as bar plot (like RNAFramework) or arcs both above and below to compare structures.
-   Circular mode: A VARNA-like interface for drawing/annotating normal secondary structure
-   Freeform mode: Like RiboDraw. Manually lay out stems, annotations, etc.

## Design philosophy for v0.2

The original v0.1 version of this repo wasn't designed very well. Here are the lessons I learned for the rewrite in the v0.2 repo.

-   Every state should be serializable. This means we dump everything to JSON when we serialize. When we import back we should be able to build everything back up (e.g. bind all functions again to each nucleotide etc).
-   Every action should be stored as an atomic action in an action stack. This should enable todo/redo behavior and also simplify things overall.
-   Data should not be repeated. Each nucleotide or other drawn element holds its own data, and all non-self data should be referenced instead of copied.
-   The design philosophy overall is to have _beautiful defaults_. The first thing that is spit out should be as close to a publication-quality figure as possible (except for freeform mode).
-   Don't add features unnecessarily. Ask users for what would actually be useful!

## Development

I hope that this project lives on for some time and eventually has many contributors beyond me. To that end, I am doing my best to enforce style and correctness rules.

This project uses `eslint` and `prettier` to lint and prettify code, respectively. You can always run `yarn lint` to lint all existing code, and `yarn prettify` to prettify all files.

Using `husky` and `lint-staged`, linting and prettification will be run whenever you try to `git commit`. That way, you don't end up committing ugly or incorrect code.
