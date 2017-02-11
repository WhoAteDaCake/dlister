#!/usr/bin/env node

const path = require("path"),
	fs = require("fs");

const configFile = path.join(__dirname,"ignores.json"),
	directory = process.cwd(),
	flagActive = process.argv[2],
	args = process.argv.slice(3,process.argv.length);

class Dlister {

	constructor() {
		this.visuals = {
			corner : "└",
			line : "─",
			column : "│",
			branch : "├",
			tabSize : 2,
		};
		this.flags = {
			add : {
				exp : "--a",
				info : "Adds a given expression to ignore list"
			},
			customIgnore : {
				exp : "--ci",
				info : "Overlooks ignore list and only ignores given expressions"
			},
			customJoin : {
				exp : "--cj",
				info : "Joins given argument list with the ignore list"
			},
			ignore : {
				exp : "--i",
				info : "Overlooks ignore list"
			},
			remove : {
				exp : "--r",
				info : "Removes given expressions from ignore list"
			},
			list : {
				exp : "--l",
				info : "Lists current ignore list"
			},
			help : {
				exp : "--help",
				info : "Lists available commands"
			},
			so : {
				exp : "--so",
				info : "Adds left padding of 4 spaces"
			}
		};
		this.flagKeys = Object.keys(this.flags);

		this.isValidExp = this.isValidExp.bind(this);
		this.findFlag = this.findFlag.bind(this);
		this.printFlag = this.printFlag.bind(this);
		this.printFlags = this.printFlags.bind(this);
		this.printIgnores = this.printIgnores.bind(this);
		this.updateExp = this.updateExp.bind(this);
		this.addExp = this.addExp.bind(this);
		this.removeExp = this.removeExp.bind(this);
		this.isPathValid = this.isPathValid.bind(this);
		this.crawlPath = this.crawlPath.bind(this);
		this.printStd = this.printStd.bind(this);
		this.readFlags = this.readFlags.bind(this);

		this.ignoreConfig = this.readIgnores(configFile);
		this.so = false;//will this be posted on stackoverflow
	}
	isValidExp(exp) {
		let isValid = true;

		try {
			new RegExp(exp);
		} catch (e) {
			isValid = false;
		}

		return isValid;
	}
	updateExp(fname,config) {
		fs.writeFile(fname, JSON.stringify(config),(err) => {
	    if(err) {
	      throw new Error("Failed writing new ignores to" + configFile + "\n\n",err);
	    }
		});
	}
	addExp(exp) {
		if(this.isValidExp(exp)) {
			this.ignoreConfig.push(exp);
			this.updateExp(configFile,this.ignoreConfig);
		} else {
			console.error('Invalid expression given "' + exp + '"');
		}
	}
	removeExp(exp) {
		if(this.ignoreConfig.indexOf(exp) >= 0) {
			let location = this.ignoreConfig.indexOf(exp);

			this.ignoreConfig.splice(location, 1);
			this.updateExp(configFile,this.ignoreConfig);

		} else {
			console.error('Expression "' + exp + '" was not found');
		}
	}

	readIgnores(fname) {
		let ignores = JSON.parse(
			fs.readFileSync(configFile,"utf-8")
		);

		return ignores;
	}
	printIgnores() {
		let ignoreString = JSON.stringify(this.ignoreConfig, null , "")
			.replace(/(\[)|(\])/g,"")
			.replace(/\,/gm,"\n")
			.replace(/\\\\/,"\\");//fixes issue where json needs to escape backslash

		process.stdout.write(ignoreString + "\n");
	}

	findFlag(exp) {
		for(let i = 0; i < this.flagKeys.length; i++) {
			if(this.flags[this.flagKeys[i]].exp === exp) {
				return this.flags[this.flagKeys[i]];
			}
		}

		console.error("Could not find :",exp," flag");
		return false;
	}
	printFlag(flag) {
		console.log(flag.exp + " : " + flag.info);
	}
	printFlags() {
		for(let i = 0; i < this.flagKeys.length; i++) {
			this.printFlag(this.flags[this.flagKeys[i]]);
		}
	}
	readFlags(activeFlag,exps,dir) {//flag & expressions
		let newIgnores = [];

		switch(activeFlag) {//need to layout so break after return is not needed.
			case this.flags.help.exp :
				this.printFlags();
				return;
			case this.flags.list.exp :
				this.printIgnores();
				return;
			case this.flags.remove.exp :
				newIgnores = this.ignoreConfig.filter(val =>
					(exps.indexOf(val) < 0)? true : false
				);

				if(newIgnores.length === this.ignoreConfig.length) {
					console.error("Expression not found");
				}
				this.updateExp(configFile,newIgnores);
				return;
			case this.flags.add.exp :
				newIgnores.push(...this.ignoreConfig);
				newIgnores.push(...exps);

				newIgnores = [...new Set(newIgnores)];
				this.updateExp(configFile,newIgnores);
				return;
			case this.flags.customIgnore.exp :
				this.ignoreConfig = exps;
				break;
			case this.flags.customJoin.exp :
				this.ignoreConfig.push(...exps);
				break;
			case this.flags.ignore.exp :
				this.ignoreConfig = [];
				break;
			case this.flags.so.exp :
				this.so = true;
				break;
			default :
				if(typeof activeFlag !== "undefined") {
					console.error("Invalide flag,use --help to list available flags");
					return;
				}
		}

		this.crawlPath(dir);
	}

	printStd(string) {
		process.stdout.write(string);
	}
	isPathValid(path) {
		for(let i = 0; i < this.ignoreConfig.length; i++) {
			let exp = new RegExp("^" + this.ignoreConfig[i] + "$");

			if(exp.test(path) == true) {
				return false;
			}
		}

		return true;
	}
	crawlPath(dir,parentPath = ["last"]) {
		let dirFiles = fs.readdirSync(dir)
				.filter(val => this.isPathValid(val)),
			level = parentPath.length;

		for(let i = 0; i < dirFiles.length; i++) {
			let route = path.join(dir,dirFiles[i]),
				isDir = fs.lstatSync(route).isDirectory();

			if(this.so) {
				this.printStd("    ");
			}

			for(let j = 1; j < level; j++) {
				if(parentPath[j] === "last") {
					this.printStd(" ");
				} else {
					this.printStd(this.visuals.column);
				}
				this.printStd(" ".repeat(this.visuals.tabSize))
			}

			if(i + 1 === dirFiles.length){
				this.printStd(this.visuals.corner);
			} else {
				this.printStd(this.visuals.branch);
			}

			this.printStd(this.visuals.line.repeat(this.visuals.tabSize));
			this.printStd(dirFiles[i] + "\n");

			if(isDir) {
				let isLast = ((i + 1) === dirFiles.length)? "last" : "not";
				this.crawlPath(route,[...parentPath,isLast]);
			}

		}
	}


}

let lister = new Dlister();
lister.readFlags(flagActive,args,directory);
