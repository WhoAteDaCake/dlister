const visuals = {
  corner: "└",
  line: "─",
  column: "│",
  branch: "├",
  tabSize: 2
};

const flags = {
  add: {
    exp: "--a",
    info: "Adds a given expression to ignore list"
  },
  customIgnore: {
    exp: "--ci",
    info: "Overlooks ignore list and only ignores given expressions"
  },
  customJoin: {
    exp: "--cj",
    info: "Joins given argument list with the ignore list"
  },
  ignore: {
    exp: "--i",
    info: "Overlooks ignore list"
  },
  remove: {
    exp: "--r",
    info: "Removes given expressions from ignore list"
  },
  list: {
    exp: "--l",
    info: "Lists current ignore list"
  },
  help: {
    exp: "--help",
    info: "Lists available commands"
  },
  so: {
    exp: "--so",
    info: "Adds left padding of 4 spaces"
  }
};
const configFileName = ".dlister";
const defaultIgnores = ["\\.git", "node_modules"];

module.exports = { visuals, flags, configFileName, defaultIgnores };
