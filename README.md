
> Still WIP, but I'm hoping this'll be ready by the end of the week.


# 🦦 nbins

nbins is a [zx](https://github.com/google/zx) script manager that makes it effortless to write reusable scripts quickly.

Ever wanted to make a quick script to perform a repetitive task, but held back because setting it all up is just too painful?

zx makes it really easy to write bash scripts with JavaScript, which is awesome, but you still need to place those files somewhere, alias them, etc.

Wouldn't it be great if you could create a globally executable script in seconds? That's exactly what nbins does.

## Documentation

When you run `nbins new lsn`, nbins will create a new `lsn.mjs` file in your scripts directory and create an executable bin file that you can run by just typing `lsn` in your terminal.

Full power of shell, written in JavaScript, executed like a real terminal application. All that in a few seconds.

For sample scripts see [examples](#examples)


> This is a WIP

## Install

1. [Install zx](https://github.com/google/zx#install) first:

```
npm i -g zx
```

2. Run the install script:

```
zx https://raw.githubusercontent.com/pyronaur/nbins/main/install.mjs
```

## Examples

Still working on it...

But here's a quick example:

### lsn

I often forget the exact scripts I can run with `npm run *` that are defined in various project `package.json`, so I built this in a couple minutes and saved as `lsn.mjs`:

```javascript
#!/usr/bin/env zx
if( ! fs.pathExistsSync( './package.json')) {
	console.log("Can't find package.json in the current directory");
	process.exit(0);
}

const contents = await fs.readFile('./package.json', 'utf8');
const json = JSON.parse(contents);

for( const script of Object.keys( json.scripts ) ) {
	const command = json.scripts[script];
	console.log(chalk.bold(script) + "\n" + command);
	console.log();
}
```
