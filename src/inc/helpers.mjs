async function confirm(q, defaultAnswer = "n") {
	let yes_no = `(y/N)`;
	if (defaultAnswer === "y") {
		yes_no = `(Y/n)`;
	}

	let answer = await question(`${q} ${yes_no} `);

	if (!answer) {
		answer = defaultAnswer;
	}

	return "y" === answer;
}

export { confirm };
