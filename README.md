[![Build Status](https://travis-ci.org/bunred/sync-plugins.svg?branch=master)](https://travis-ci.org/bunred/sync-plugins) [![Coverage Status](https://coveralls.io/repos/github/bunred/sync-plugins/badge.svg?branch=master)](https://coveralls.io/github/bunred/sync-plugins?branch=master)

#### How to use
One-click to sync(install/update) the plugins, you can use git repository to store the plugins' information.

```
yarn add @bunred/sync-plugins -D
```

create a new file `plugins-update.js`
```
const path = require("path")

const savePath = path.resolve(__dirname, "plugins-info.json")
const pluginsPath = path.resolve(__dirname, "./plugins")

const pluginsPrefixUrl =
  "https://raw.githubusercontent.com/bunred/bunadmin-plugins/master/navigation"
const pluginsInfoArr = require("./plugins-info.json") || []

const { syncPlugins } = require("@bunred/sync-plugins")

syncPlugins({ savePath, pluginsPath, pluginsPrefixUrl, pluginsInfoArr })
```

```
node plugins-update.js
```

See more on [bunadmin](https://github.com/bunred/bunadmin)  |  [bunadmin-plugins](https://github.com/bunred/bunadmin-plugins)
