const path = require("path");
const fs = require("fs");
const { defaultIgnores } = require("./spec");

// Should be used whenever we do not want to crawl directory
const noAction = {
  so: undefined,
  run: false,
  ignores: undefined
};

const isUnique = (value, index, self) => self.indexOf(value) === index;

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
      // if it crashes, return line will be skipped
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
        this.updateIgnores.error(e.message);
      }
    });
  }

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

  printFlags() {
    Object.values(this.flags).map(flag =>
      this.logger.message(flag.exp + " : " + flag.info)
    );
  }

  configure(args) {
    const [activeFlag, ...specifications] = args;
    //flag & expressions
    const ignores = this.readIgnores();

    // Note: the case statements are scoped else javascript compained about dublicate values
    switch (activeFlag) {
      case this.flags.help.exp:
        this.printFlags();
        return noAction;
      case this.flags.list.exp:
        this.printIgnores(ignores);
        return noAction;
      case this.flags.remove.exp: {
        const newIgnores = ignores.filter(
          ignore => !specifications.includes(ignore)
        );
        if (newIgnores.length === ignores.length) {
          this.logger.error(
            "None of expressions were found in the configuration"
          );
        } else {
          this.updateIgnores(newIgnores);
        }
        return noAction;
      }
      case this.flags.add.exp: {
        const invalidExpressions = specifications.filter(
          exp => !this.isRegExpValid(exp)
        );
        if (invalidExpressions.length !== 0) {
          invalidExpressions.map(exp =>
            this.logger.error(`Expression ${exp} is invalid`)
          );
          return noAction;
        }
        const newIgnores = ignores.concat(specifications).filter(isUnique);
        this.updateIgnores(newIgnores);
        return noAction;
      }
      case this.flags.customIgnore.exp: {
        return { run: true, ignores: specifications, so: false };
      }
      case this.flags.customJoin.exp: {
        return {
          run: true,
          ignores: ignores.concat(specifications).filter(isUnique),
          so: false
        };
      }
      case this.flags.ignore.exp: {
        return { run: true, ignores: [], so: false };
      }
      case this.flags.so.exp: {
        return { run: true, ignores, so: true };
      }
      default:
        // When using regular functionality
        if (activeFlag === undefined) {
          return { run: true, ignores, so: false };
        }
        this.logger.error("Invalide flag,use --help to list available flags");
        return noAction;
    }
  }

  isIgnored(ignores, path) {
    return ignores.some(exp => {
      const regExp = new RegExp(exp);
      return regExp.test(path);
    });
  }

  crawlPath(config, dir, parentPath = ["last"]) {
    const dirFiles = fs
      .readdirSync(dir)
      .filter(val => !this.isIgnored(config.ignores, val));
    const level = parentPath.length;

    for (let i = 0; i < dirFiles.length; i++) {
      const route = path.join(dir, dirFiles[i]);
      const isDir = fs.lstatSync(route).isDirectory();

      if (this.so) {
        this.logger.stdout("    ");
      }

      for (let j = 1; j < level; j++) {
        if (parentPath[j] === "last") {
          this.logger.stdout(" ");
        } else {
          this.logger.stdout(this.visuals.column);
        }
        this.logger.stdout(" ".repeat(this.visuals.tabSize));
      }

      if (i + 1 === dirFiles.length) {
        this.logger.stdout(this.visuals.corner);
      } else {
        this.logger.stdout(this.visuals.branch);
      }

      this.logger.stdout(this.visuals.line.repeat(this.visuals.tabSize));
      this.logger.stdout(dirFiles[i] + "\n");

      if (isDir) {
        let isLast = i + 1 === dirFiles.length ? "last" : "not";
        this.crawlPath(config, route, [...parentPath, isLast]);
      }
    }
  }

  crawl(config) {
    if (config.run === false) {
      return;
    }
    const basePath = process.cwd();
    this.crawlPath(config, basePath, ["last"]);
  }
}

module.exports = { Dlister };
