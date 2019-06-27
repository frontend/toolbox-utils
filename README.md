<h1 align="center">Welcome to Toolbox Utils 👋</h1>
<p>
  <img src="https://img.shields.io/badge/node-%3E%3D8-blue.svg" />
  <a href="http://frontend.github.io/toolbox/">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/frontend/toolbox-utils/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

> toolbox-utils is the encapsulated build task module. Based on Gulp and Webpack, those utilities offers you anything you need in your frontend development process in a single dev dependency.

### 🏠 [Homepage](http://frontend.github.io/toolbox/)

## Prerequisites

- node &gt;=8

## Install

```sh
yarn add toolbox-utils
```

## Usage

```sh
toolbox serve
toolbox build
```

## Develop

In order to work to this repo, please achieve the following steps in order to have a proper testing environment :
1. **Clone the repo** locally
2. Go to the directory and run the following commands :
    ```bash
    $ yarn install
    $ ln -s "$(pwd)/index.js" "$(pwd)/node_modules/.bin/toolbox" && ln -s "$(pwd)" "$(pwd)/node_modules/toolbox-utils"
    ```
2. **Generate a sibling project** using the [`generator-toolbox`](https://github.com/frontend/generator-toolbox)
3. In your **generated project's root**, execute:
    ```bash
    $ rm -rf ./node_modules
    $ ln -s "$(pwd)/../toolbox-utils/node_modules" "$(pwd)/node_modules"
    ```
4. Now you can test your tasks in the generated project thanks to the symlinks !

## Author

* Github: [@frontend](https://github.com/frotnend)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/frontend/toolbox-utils/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Frontend](https://github.com/frotnend).<br />
This project is [MIT](https://github.com/frontend/toolbox-utils/blob/master/LICENSE) licensed.

