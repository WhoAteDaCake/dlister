#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const { visuals, flags, configFileName } = require("./spec");
const { Dlister } = require("./Dlister");

const homedir = require("os").homedir();
const configFile = path.join(homedir, configFileName);
// Skip the first 2 because first is node verion and second is file path
const args = process.argv.slice(2, process.argv.length);

const lister = new Dlister(configFile, visuals, flags);
const config = lister.configure(args);
lister.crawl(config);
// lister.readFlags(flagActive, args, directory);
