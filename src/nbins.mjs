#!/usr/bin/env zx
import * as actions from "./inc/commands.mjs";
import utility from "./inc/info.mjs";
import env_requirements from "./inc/env-requirements.mjs";

if (true !== env_requirements()) {
  console.log(`Quit. Requirements not met.`);
  process.exit();
}

const input = argv._[1];

let action;
let utilityName;

if (actions[input]) {
  action = argv._[1];
  utilityName = argv._[2];
}

if (!action) {
  console.log("Usage:\n utils <action>.\n");
}

if (!action || argv.h || input === "help") {
  console.log("Available actions:");
  console.log(actionList(actions));
  process.exit();
}

function actionList(actions) {
  return (
    " " + // <-- Compensates for trim()
    Object.keys(actions)
      .map((name) => `\n - ${name}`)
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
  const requestedUtility = utility.paths(utilityName);
  try {
    await actions[action](requestedUtility);
  } catch (e) {
    console.log(e);
  }
}
