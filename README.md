# asciitosvg-grid

Basic ascii-to-svg renderer (built out of [ivanceras/elm-examples/elm-bot-lines][elm-bot-lines-gh]).

The svg output is aligned to a grid, with all text in the system-default `monospace` font.

Automatically optimizes svg output using [SVGO][svgo], since the renderer produces inefficient SVG.

Use either locally (executable version) or with the API, which allows for ASCII diagrams embedded directly into markdown and rendered with no build step.

## Executable Version

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

## API Version

```sh
$ encodeascii -f raw -m < demo/input.txt
![ascii diagram rendered with asciitosvg](https://asciitosvg.now.sh/render/raw/\
\.\-\-\-\-\-\-\-\-\-\-\-\-\-\.\
\|\ \H\e\l\l\o\ \W\o\r\l\d\ \|\
\|\ \ \ \ \ \ \ \ \.\-\-\-\-\+\
\|\_\_\_\_\_\_\_\/)
```

```md
If I were a pigeon and a glass of chalces and a black bag and we stepped outside and the crowd was going on. The snow was the last wood and he spoke. I was sure I thought he was going to sleep a little now and he could afford tomorrow while he hated.

![ascii diagram rendered with asciitosvg](https://asciitosvg.now.sh/render/raw/\
\.\-\-\-\-\-\-\-\-\-\-\-\-\-\.\
\|\ \H\e\l\l\o\ \W\o\r\l\d\ \|\
\|\ \ \ \ \ \ \ \ \.\-\-\-\-\+\
\|\_\_\_\_\_\_\_\/)
```

&darr;

If I were a pigeon and a glass of chalces and a black bag and we stepped outside and the crowd was going on. The snow was the last wood and he spoke. I was sure I thought he was going to sleep a little now and he could afford tomorrow while he hated.

![same output as output.svg from demo](./demo/output.svg)

<sub>filler text generated using [Break the Block](https://codepen.io/jczimm/full/rKJjMM/)</sub>

## License

[MIT](https://choosealicense.com/licenses/mit/)

[elm-bot-lines]: https://ivanceras.github.io/elm-examples/elm-bot-lines/
[elm-bot-lines-gh]: https://github.com/ivanceras/elm-examples/tree/master/elm-bot-lines
[svgbob]: https://github.com/ivanceras/svgbob
[svgo]: https://github.com/svg/svgo

## TODO

- [ ] fix unicode format for ASCII encoding/rendering (not sure whether the problem is in ./bin/encodeascii or render.js)
- [ ] add to README under API Version: a **description of render.js/md img embed functionality** (copy about running the lambdas and embedding diagrams in markdown img src)
- [ ] write "Usage" text (USAGE) in render.js

- [ ] put a html landing page at `/` &mdash; include a link to `/edit`

- [ ] create editor.js with routing `/edit/[\\s\\S]*`: serves textarea, encoding options, and encoder result
  - redirect `/edit` to `/edit/`
  - if there is data provided after the slash, pre-load the textarea with that
  - the web app should be written using hyperapp
  - the form should POST to a \[bash\] lambda at `/encode/[\\s\\S]+` running encodeascii and returning the result

(should leverage `routes` in `now.json`: route `/` and `/edit` to their respective html pages (using static lambda) and `/render/[\\s\\S]+` to render.js)

- [x] change server.js to render.js and change routing to `/render/[\\s\\S]+`
  - [x] update encodeascii and README
- [x] change encodeascii default host to asciitosvg.now.sh
- [ ] npm publish 0.1.1 at a good milestone

- [ ] in asciitosvg-web, automatically uglify and inline main.js into index.html @ head (using \[uglify 3\] and html-inline)
- [ ] accept color option (to make the lines and text white, instead of black, for example)
- [ ] add support for using svgbob instead of asciitosvg for renderer
- [ ] submit <asciitosvg.now.sh> to \[awesome-zeit\]

- [ ] disable Now deployment automatic aliasing to asciitosvg.now.sh; it should only be able to be set manually (so a failed deploy doesn't automatically break images everywhere)