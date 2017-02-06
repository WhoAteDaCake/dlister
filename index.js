#!/usr/bin/env node

const path = require("path"),
	fs = require("fs");

const corner = "└",
	line = "─",
	column = "│",
	branch = "├",
	tab = 2;

const flags = {
	add : "-a",//adds file name to default
	customIgnore : "-ci",//removes defaults,ignores specified file names
	customJoin : "-cj",//merges specified file names with defaults and ignores
	ignore : "-i",//ignores defaults
	remove : "-r",//removes file names from defaults
	list : "-l",//lists defaults
	help : "-help",//lists comands
};

let configFile = path.join(__dirname,"ignores.json"),
	ignores = JSON.parse(fs.readFileSync(configFile)),
	directory = process.cwd(),
	flagActive = process.argv[2],
	args = process.argv.slice(3,process.argv.length);

function writeStd(string) {
	if(typeof string !== "string") {
		throw new Error("Value passed to writeStd has to be a string",string)
	}
	process.stdout.write(string);
}
function writeToFile(fname,txt) {
	fs.writeFile(fname, txt,(err) => {
    if(err) {
      throw new Error("Failed writing new ignores to " + configFile);
    }
	});
}
function writeFlagInfo(flag,text) {
	writeStd("  " + flag + " : " + text + "\n");
}

function checkName(name) {
	for(let i = 0; i < ignores.length; i++) {
		let exp = new RegExp(ignores[i]);

		if(exp.test(name) === true) {
			return false;
		}
	}
	return true;
}
function crawl(dir,level,parent) {
	let currDir = fs.readdirSync(dir);

	for(let i = 0; i < currDir.length; i++) {

		let fileRoute = path.join(dir,currDir[i]),
			isDir = fs.lstatSync(fileRoute).isDirectory();

		for(let j = 0; j < level ; j++) {
			if(parent === "last" && j + 1 === level) {
				writeStd(" ");
			} else {
				writeStd(column);
			}
			writeStd(" ".repeat(tab))
		}

		if(i + 1 === currDir.length){
			writeStd(corner);
		} else {
			writeStd(branch);
		}

		writeStd(line.repeat(tab));
		writeStd(currDir[i] + "\n");

		if(isDir && checkName(currDir[i])) {
			let parentPos = (i + 1 === currDir.length)? "last" : "";
			crawl(path.join(dir,currDir[i]),level + 1,parentPos);
		}
	}
}

function addIgnores(newIgnores,oldIgnores,file) {
	newIgnores.push(...oldIgnores);
	newIgnores = [...new Set(newIgnores)]
	writeToFile(file,JSON.stringify(newIgnores));
}
function removeIgnores(toRemove,oldIgnores,file) {
	let newIgnores = oldIgnores.filter(val =>
		(toRemove.indexOf(val) < 0)? true : false
	);
	writeToFile(file,JSON.stringify(newIgnores));
}

switch(flagActive) {
	case flags.add :
		addIgnores(args,ignores,configFile);
		return;
	case flags.remove :
		removeIgnores(args,ignores,configFile);
		return;
	case flags.list :
		let ignoresString = JSON.stringify(ignores, null, 2);
		ignoresString = ignoresString.replace(/(\[\n)|(\n\])/g, "");
		writeStd(ignoresString + "\n");
		return;
	case flags.help :
		writeStd("Flags :\n");
		writeFlagInfo(flags.add,"Will add a file name to ignore list");
		writeFlagInfo(flags.customIgnore,"Will overlook ignore list and use given arguments");
		writeFlagInfo(flags.customJoin,"Will join given arguments with ignore list");
		writeFlagInfo(flags.ignore,"Will overlook ignore list");
		writeFlagInfo(flags.list,"Will list the ignore list");
		writeFlagInfo(flags.help,"Will list available commands");
		return;
	case flags.customIgnore :
		ignores = [...args];
		break;
	case flags.customJoin :
		ignores.push(...args);
		break;
	case flags.ignore :
		ignores = [];
		break;
}

crawl(directory,0,"");
//add help tag
