const path = require("path");
const fs = require("fs");
const { defaultIgnores } = require("./spec");

// Should be used whenever we do not want to crawl directory
const noAction = {
  so: undefined,
  run: false,
  ignores: undefined
};

class Dlister {
  constructor(configFile, visuals, flags) {
    this.configFile = configFile;
    this.visuals = visuals;
    this.flags = flags;

    // Default logger, can be changed using updateLogger() function
    this.logger = {
      message: console.log.bind(console),
      error: console.error.bind(console),
      stdout: message => process.stdout.write(message)
    };
  }

  updateLogger(message, error, stdout) {
    this.logger = { message, error, stdout };
  }

  isRegExpValid(exp) {
    try {
      new RegExp(exp);
      // Because if it crashes, return line will be skipped
      return true;
    } catch (e) {
      return false;
    }
  }
  updateIgnores(config) {
    fs.writeFile(this.configFile, JSON.stringify(config), e => {
      if (e) {
        this.logger.error(
          "Failed writing new ignores to" + this.configFile + "\n\n"
        );
        this.logger.error(e.message);
      }
    });
  }

  // addExpression(exp) {
  //   if (this.isValidExp(exp)) {
  //     this.ignoreConfig.push(exp);
  //     this.updateExpression(this.configFile, this.ignoreConfig);
  //   } else {
  //     console.error('Invalid expression given "' + exp + '"');
  //   }
  // }
  // removeExp(exp) {
  //   if (this.ignoreConfig.indexOf(exp) >= 0) {
  //     let location = this.ignoreConfig.indexOf(exp);

  //     this.ignoreConfig.splice(location, 1);
  //     this.updateExpression(this.configFile, this.ignoreConfig);
  //   } else {
  //     console.error('Expression "' + exp + '" was not found');
  //   }
  // }

  readIgnores() {
    let file;
    let result;
    try {
      file = fs.readFileSync(this.configFile, "utf-8");
    } catch (e) {
      // This is in order not to break older versions
      // As these are very common it's likely that they will want to be skipped
      return defaultIgnores;
    }
    try {
      result = JSON.parse(file);
    } catch (e) {
      this.logger.error("Failed to parse config file, assuming no pre-defined");
      result = [];
    }

    return result;
  }
  printIgnores(items) {
    const ignoreString = JSON.stringify(items, null, "")
      .replace(/(\[)|(\])/g, "")
      .replace(/\,/gm, "\n") // In order to multiline
      .replace(/\\\\/, "\\"); // fixes issue where json needs to escape backslash
    this.logger.stdout(ignoreString + "\n");
  }

  // findFlag(exp) {
  //   for (let i = 0; i < this.flagKeys.length; i++) {
  //     if (this.flags[this.flagKeys[i]].exp === exp) {
  //       return this.flags[this.flagKeys[i]];
  //     }
  //   }

  //   console.error("Could not find :", exp, " flag");
  //   return false;
  // }
  printFlags() {
    Object.values(this.flags).map(flag =>
      this.logger.message(flag.exp + " : " + flag.info)
    );
  }

  configure(args) {
    const [activeFlag, ...specs] = args;
    //flag & expressions
    const ignores = this.readIgnores();

    switch (activeFlag) {
      case this.flags.help.exp:
        this.printFlags();
        return noAction;
      case this.flags.list.exp:
        this.printIgnores(ignores);
        return noAction;
      case this.flags.remove.exp:
        const newIgnores = ignores.filter(ignore => !specs.includes(ignore));
        if (newIgnores.length === ignores.length) {
          this.logger.error(
            "None of expressions were found in the configuration"
          );
        } else {
          this.updateIgnores(newIgnores);
        }
        return noAction;
    }

    return noAction;
    // case this.flags.remove.exp:
    //   newIgnores = this.ignoreConfig.filter(
    //     val => (exps.indexOf(val) < 0 ? true : false)
    //   );

    //   if (newIgnores.length === this.ignoreConfig.length) {
    //     console.error("Expression not found");
    //   }
    //   this.updateExpression(this.configFile, newIgnores);
    //   return;
    // case this.flags.add.exp:
    //   newIgnores.push(...this.ignoreConfig);
    //   newIgnores.push(...exps);

    //   newIgnores = [...new Set(newIgnores)];
    //   this.updateExpression(this.configFile, newIgnores);
    //   return;
    // case this.flags.customIgnore.exp:
    //   this.ignoreConfig = exps;
    //   break;
    // case this.flags.customJoin.exp:
    //   this.ignoreConfig.push(...exps);
    //   break;
    // case this.flags.ignore.exp:
    //   this.ignoreConfig = [];
    //   break;
    // case this.flags.so.exp:
    //   this.so = true;
    //   break;
    // default:
    //   if (typeof activeFlag !== "undefined") {
    //     console.error("Invalide flag,use --help to list available flags");
    //     return;
    //   }

    //   this.crawlPath(dir);
  }

  // printStd(string) {
  //   process.stdout.write(string);
  // }
  // isPathValid(path) {
  //   for (let i = 0; i < this.ignoreConfig.length; i++) {
  //     let exp = new RegExp("^" + this.ignoreConfig[i] + "$");

  //     if (exp.test(path) == true) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }
  crawl(config) {
    if (config.run === false) {
      return;
    }
    console.log(config);
  }
  // crawlPath(dir, parentPath = ["last"]) {
  //   let dirFiles = fs.readdirSync(dir).filter(val => this.isPathValid(val)),
  //     level = parentPath.length;

  //   for (let i = 0; i < dirFiles.length; i++) {
  //     let route = path.join(dir, dirFiles[i]),
  //       isDir = fs.lstatSync(route).isDirectory();

  //     if (this.so) {
  //       this.printStd("    ");
  //     }

  //     for (let j = 1; j < level; j++) {
  //       if (parentPath[j] === "last") {
  //         this.printStd(" ");
  //       } else {
  //         this.printStd(this.visuals.column);
  //       }
  //       this.printStd(" ".repeat(this.visuals.tabSize));
  //     }

  //     if (i + 1 === dirFiles.length) {
  //       this.printStd(this.visuals.corner);
  //     } else {
  //       this.printStd(this.visuals.branch);
  //     }

  //     this.printStd(this.visuals.line.repeat(this.visuals.tabSize));
  //     this.printStd(dirFiles[i] + "\n");

  //     if (isDir) {
  //       let isLast = i + 1 === dirFiles.length ? "last" : "not";
  //       this.crawlPath(route, [...parentPath, isLast]);
  //     }
  //   }
  // }
}

module.exports = { Dlister };
