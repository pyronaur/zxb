#!/usr/bin/env zx
import { commands } from "./inc/commands.mjs";
import env_requirements from "./inc/env-requirements.mjs";
import { search } from "./inc/sources.mjs";

// Turn off verbose mode by default
$.verbose = argv.verbose || false;

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
let utilityName;

if (commands[input] || aliases[input]) {
	action = argv._[1];
	utilityName = argv._[2];
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
	utilityName = input;
}

if (action === "help" || !input) {
	console.log(`\n${chalk.bold("Usage")}: zxb <action>\n`);
	console.log(chalk.bold(`Available commands:`));
	console.log(actionList(commands));
	console.log();
	process.exit();
}

function actionList(commands) {
	return (
		"  " + // <-- Compensates for trim()
		Object.keys(commands)
			.map((name) => `\n  ◉ ${name}`)
			.join("")
			.trim()
	);
}


if (action) {
	const requestedUtility = await search(utilityName) || {}
	try {
		// Not the best of designs, but it'll do for now. Famous last words. I know.
		if (action === "create") {
			await commands["create"](utilityName)
		} else {
			await commands[action](requestedUtility);
		}
	} catch (e) {
		console.log(chalk.bold.red("Error: ") + e.message);
	}
}
