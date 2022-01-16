#!/usr/bin/env zx
import * as actions from "./inc/commands.mjs";
import env_requirements from "./inc/env-requirements.mjs";
import { search } from "./inc/sources.mjs";

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

if (actions[input] || aliases[input]) {
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
	console.log(`${chalk.bold(input)} doesn't exist.`)
	action = "create";
	utilityName = input;
}

if (action === "help" || !input) {
	console.log(`\n${chalk.bold("Usage")}: nbins <action>\n`);
	console.log(chalk.bold(`Available actions:`));
	console.log(actionList(actions));
	console.log();
	process.exit();
}

function actionList(actions) {
	return (
		"  " + // <-- Compensates for trim()
		Object.keys(actions)
			.map((name) => `\n  ◉ ${name}`)
			.join("")
			.trim()
	);
}


if (action) {
	const requestedUtility = await search(utilityName) || {}
	try {
		// Not the best of designs, but it'll do for now. Famous last words. I know.
		if( action === "create" ) {
			await actions["create"](utilityName)
		} else {
			await actions[action](requestedUtility);
		}
	} catch (e) {
		console.log(chalk.bold.red("Error: ") + e.message);
	}
}
