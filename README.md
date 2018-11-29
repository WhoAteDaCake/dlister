# dlister

A npm package to list directory tree in terminal. Current version only supports 1 flag usage per call.

## Installation guide

```
npm install dlister -g
```

## Available flags :

```
--add
    Adds a given expression to ignore list
--remove
    Removes given expressions from ignore list
--list
    Lists current ignore list
--just
    Overlooks ignore list and only ignores given expression
--pure
    Overlooks ignore list completely
--with
    Joins given argument to the ignore list
--so
    Adds left padding of 4 spaces
--path
    Specifies the path to be ran from
--help
    Lists all available commands

```

When adding or removing expressions for ignore file suround them in quotes

```
dlister --a ".*\.o" "node_modules" ".*\.json"
```

Depending on your npm installation, you might have to use `sudo` when running `dlister`. For example

```
sudo dlister --a "node_modules"
```
