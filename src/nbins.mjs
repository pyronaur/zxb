#!/usr/bin/env zx
import * as actions from "./inc/commands.mjs";
import npaths from "./inc/npaths.mjs";
import env_requirements from "./inc/env-requirements.mjs";

if (true !== env_requirements()) {
  console.log(`Environment requirements not met.`);
  process.exit();
}

const input = argv._[1];

let action;
let utilityName;

if (actions[input]) {
  action = argv._[1];
  utilityName = argv._[2];
}

if( argv.h || input === "help" ) {
	action = "help";
}

// Offer to create utility if it doesn't exist.
if( input && ! action ) {
	console.log(`${chalk.bold(input)} doesn't exist.`)
	action = "create";
	utilityName = input;
}

if ( action === "help" || ! input) {
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

const alias = {
  ls: "list",
};
if (alias[action]) {
  action = alias[command];
}

if (action) {
  const requestedUtility = npaths.paths(utilityName);
  try {
    await actions[action](requestedUtility);
  } catch (e) {
    console.log(e);
  }
}
