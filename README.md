# dlister
A npm package to list directory tree in terminal

## Installation guide
```
npm install dlister -g
```

## Available flags :
```
--a : Adds a given expression to ignore list
--ci : Overlooks ignore list and only ignores given expressions
--cj : Joins given argument list with the ignore list
--i : Overlooks ignore list
--r : Removes given expressions from ignore list
--l : Lists current ignore list
--help : Lists available commands
--so : Adds left padding of 4 spaces

```

When adding or removing expressions for ignore file suround them in quotes
```
dlister --a ".*\.o" "node_modules" ".*\.json"
```

Depending on your npm installation, you might have to use `sudo` when running `dlister`. For example
```
sudo dlister --a "node_modules"
```
