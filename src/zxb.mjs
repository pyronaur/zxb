#!/usr/bin/env zx
import { commands } from "./inc/commands.mjs";
import env_requirements from "./inc/env-requirements.mjs";

// Turn off verbose mode by default
$.verbose = argv.verbose || false;

function list(commands) {

	return (
		Object.keys(commands)
			.map((name) => {
				const { desc, usage } = commands[name];


				let output = `\n  `
				output += `${chalk.bold(name)}`
				if (usage) {
					output += ` - `
					output += usage
				}
				output += `\n  `
				output += chalk.dim(desc)
				output += `\n`

				return output;
			})
			.join("")
	);
}

if (true !== await env_requirements()) {
	console.log(`Environment requirements not met.`);
	process.exit();
}

const input = argv._[1];
const aliases = {
	ls: "list",
	rm: "remove",
	new: "create"
};

let action;
let subtask;

if (commands[input] || aliases[input]) {
	action = argv._[1];
	subtask = argv._[2];
}

if (argv.h || input === "help") {
	action = "help";
}


if (aliases[input]) {
	action = aliases[input];
}


// Offer to create utility if it doesn't exist.
if (input && !action) {
	action = "create";
	subtask = input;
}

if (action === "help" || !input) {
	console.log(chalk.bold(`\n  Available commands:`));
	console.log(list(commands));
	console.log();
	process.exit();
}

if (action) {
	try {
		await commands[action].command(subtask);
	} catch (e) {
		console.log(chalk.bold.red("Error: ") + e.message);
	}
}
