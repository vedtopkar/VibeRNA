# TS RNA Draw

Ved's attempt at using Typescript to write a pure Javascript RNA secondary structure drawing app.

## Usage

Clone:
```
git clone https://github.com/vedtopkar/ts-rna-draw.git
```

Install npm module dependencies:
```
cd ts-rna-draw && yarn install
```

For development, start the `parcel` server with `yarn`:
```
yarn watch
```
Your page will reload every time you hit save on a modified `.ts` or `.html` file.

## Dependencies

- [npm](https://www.npmjs.com/get-npm)
- [yarnjs](https://yarnpkg.com/)
- [parceljs](https://parceljs.org/)

## Feature TODOs

- Scale up terminal loop radius for large-sequence loops
- Abstract away global variables for drawing config
- Split up drawing scripts for each element type
- Implement paperjs element grouping
- Update stem drawing for arbitrary angles
- Figure out robust vertical text centering for nucleotides
- Implement drawing bulges
- Implement drawing internal loops
- Implement drawing multi-loops
- Implement interactive flipping stems around basline
- Implement interactive stem moving at bulges
- Implement interactive stem moving at internal loops
- Implement interactive stem moving at multi-loops