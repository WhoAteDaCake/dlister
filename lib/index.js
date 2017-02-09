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
			}
		};
		this.flagKeys = Object.keys(this.flags);
		this.ignoreConfig = JSON.parse(fs.readFileSync(configFile));

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
	printStd(string) {
		process.stdout.write(string);
	}
	printIgnores() {
		let ignoreString = JSON.stringify(this.ignoreConfig, null , "")
			.replace(/(\[)|\]|"/g,"")
			.replace(/\,/gm,"\n");

		process.stdout.write(ignoreString + "\n");
	}

	isPathValid(path) {
		for(let i = 0; i < this.ignoreConfig.length; i++) {
			let exp = new RegExp(this.ignoreConfig[i]);

			if(exp.test(path) == true) {
				return false;
			}
		}

		return true;
	}
	crawlPath(dir,level,parent) {//code is too dirty.
		let currDir = fs.readdirSync(dir);

		for(let i = 0; i < currDir.length; i++) {

			let fileRoute = path.join(dir,currDir[i]),
				isDir = fs.lstatSync(fileRoute).isDirectory();

			for(let j = 0; j < level ; j++) {
				if(parent === "last" && j + 1 === level) {
					this.printStd(" ");
				} else {
					this.printStd(this.visuals.column);
				}
				this.printStd(" ".repeat(this.visuals.tabSize))
			}

			if(i + 1 === currDir.length){
				this.printStd(this.visuals.corner);
			} else {
				this.printStd(this.visuals.branch);
			}

			this.printStd(this.visuals.line.repeat(this.visuals.tabSize));
			this.printStd(currDir[i] + "\n");

			if(isDir && this.isValidExp(currDir[i])) {
				let parentPos = (i + 1 === currDir.length)? "last" : "";

				this.crawlPath(path.join(dir,currDir[i]),level + 1,parentPos);
			}
		}
	}
}

let lister = new Dlister();

lister.crawlPath(directory,0,"");
// lister.printFlags()
//console.log(lister.findFlag("--l"));
