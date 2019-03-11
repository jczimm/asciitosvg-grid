# asciitosvg-grid

Basic ascii-to-svg renderer (executable wrapper for [ivanceras/elm-examples/elm-bot-lines][elm-bot-lines-gh]).

The svg output is aligned to a grid, with all text in the system-default `monospace` font.

## Installation

```sh
npm install --global asciitosvg-grid
```

## Usage

```sh
$ cat input.txt
.-------------.
| Hello World |
|        .----+
|_______/
$ asciitosvg < input.txt > output.svg
```

**output.svg:**

![output.svg in demo](./demo/output.svg)

## FAQ

### Are you really using Puppeteer to open a webpage running a modified version of an ancient Elm example app rather than trying to extract the core convert function from the app's source?

Are you actually considering using this package? I hope not. This is just an executable I created to replace going to [this page][elm-bot-lines] every time I wanted to tweak my legacy ascii diagrams. If you want an ascii-to-svg renderer, you should probably use [svgbob][svgbob] (by the same author as [elm-bot-lines][elm-bot-lines]), which comes with its own executable:

```sh
cargo install --git https://github.com/ivanceras/svgbob/ --path svgbob_cli
```

<!-- ### Do you do anything more respectable?

🤔 -->

## License

[MIT](https://choosealicense.com/licenses/mit/)

[elm-bot-lines]: https://ivanceras.github.io/elm-examples/elm-bot-lines/
[elm-bot-lines-gh]: https://github.com/ivanceras/elm-examples/tree/master/elm-bot-lines
[svgbob]: https://github.com/ivanceras/svgbob
