# asciitosvg-grid

Basic ascii-to-svg renderer (built out of [ivanceras/elm-examples/elm-bot-lines][elm-bot-lines-gh]).

The svg output is aligned to a grid, with all text in the system-default `monospace` font.

Automatically optimizes svg output using [SVGO][svgo], since the renderer produces inefficient SVG.

Render either by executable or by server, which allows for ASCII diagrams embedded directly into markdown and rendered with no build step.

## Executable Usage

### Installation

```sh
npm install --global asciitosvg-grid
```

### Usage

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

### FAQ

### Are you really using Puppeteer to open a webpage running a modified version of an ancient Elm example app rather than trying to extract the core convert function from the app's source?

This is just an executable I created to replace going to [this page][elm-bot-lines] every time I wanted to tweak my legacy ascii diagrams. If you want an ascii-to-svg renderer, you should probably use [svgbob][svgbob] (by the same author as [elm-bot-lines][elm-bot-lines]), which comes with its own executable:

```sh
cargo install --git https://github.com/ivanceras/svgbob/ --path svgbob_cli
```

<!-- ### Do you do anything more respectable?

🤔 -->

## Server Version

```sh
$ encodeascii -f raw -m < demo/input.txt
![ascii diagram rendered with asciitosvg](http://localhost:3000/raw/\
\.\-\-\-\-\-\-\-\-\-\-\-\-\-\.\
\|\ \H\e\l\l\o\ \W\o\r\l\d\ \|\
\|\ \ \ \ \ \ \ \ \.\-\-\-\-\+\
\|\_\_\_\_\_\_\_\/)
$ node server.js
Listening...
```

```md
If I were a pigeon and a glass of chalces and a black bag and we stepped outside and the crowd was going on. The snow was the last wood and he spoke. I was sure I thought he was going to sleep a little now and he could afford tomorrow while he hated.

![ascii diagram rendered with asciitosvg](http://localhost:3000/raw/\
\.\-\-\-\-\-\-\-\-\-\-\-\-\-\.\
\|\ \H\e\l\l\o\ \W\o\r\l\d\ \|\
\|\ \ \ \ \ \ \ \ \.\-\-\-\-\+\
\|\_\_\_\_\_\_\_\/)
```

<center>&darr;</center>

<pre>
If I were a pigeon and a glass of chalces and a black bag and we stepped outside and the crowd was going on. The snow was the last wood and he spoke. I was sure I thought he was going to sleep a little now and he could afford tomorrow while he hated.

<img src="./demo/output.svg">
</pre>

<small>filler text generated using [Break the Block](https://codepen.io/jczimm/full/rKJjMM/)</small>

## License

[MIT](https://choosealicense.com/licenses/mit/)

[elm-bot-lines]: https://ivanceras.github.io/elm-examples/elm-bot-lines/
[elm-bot-lines-gh]: https://github.com/ivanceras/elm-examples/tree/master/elm-bot-lines
[svgbob]: https://github.com/ivanceras/svgbob
[svgo]: https://github.com/svg/svgo

## TODO

- [ ] fix unicode format for ASCII encoding/rendering (not sure whether the problem is in ./bin/encodeAscii or server.js)
- [ ] add to README under Server Version: a **description of server/md img embed functionality** (copy about running the server and embedding diagrams in markdown img src)