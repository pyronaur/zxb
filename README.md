# 🪣 zxb

*a bucket for your zx scripts*

**zxb** is a [zx](https://github.com/google/zx) script manager to help you write, use, edit and even share zx scripts quickly.

One of the things I love most about being a developer is continuous improvement. **zx** made writing shell scripts for everyday tasks fun again. But that introduced a new problem - where do I place all my scripts? How do I run them? What did I call that thing I wrote last month? Where did I place it?

Writing shell scripts with **zx** is so easy that it became difficult to manage all of them. That's why I decided to build **zxb**.

Just like **zx** helps you write shell scripts better, **zxb** helps you manage what you've written better.



## 🚀 Quick Start

1. [Install zx](https://github.com/google/zx#install) first:

```
npm i -g zx
```

2. Run the install script:

```
zx https://raw.githubusercontent.com/pyronaur/zxb/main/src/inc/install.mjs
```

3. Reload terminal and load `zxb` for the first time. Done!

### 🤖 Your first script

Create a new **zxb** managed script by running.

I'll create an ls command that will list files only by your specified extension. Call it **lse**.
```
zxb lse
```

This will create a `lse.mjs` file in your directory and link it up as a bin so that you can run it from anywhere as `lse` command.

Now add in a bit script magic:

```js
#!/usr/bin/env zx
const ext = argv._[1];
const ls = await globby(`*.${ext}`);
console.log(ls.join("\n"));
```

That's it!

## 🧻 Documentation

 **Available commands:**

 `zxb link [--force]`
 Ensure all your script files have an executable in the bin directory.
 
 `zxb install <url>`
 Install a remote `zx` script and save it locally.
 
 `zxb add_source`
 Add an additional directory to use as a script source.

 `zxb clean`
 Remove bin files from the bin directory that don't have a matching script.

 `zxb create <script-name>`
 Create a new script

 `zxb edit [script-name]`
 Edit scripts. If no script name is specified, will open all scripts and the ~/.zxb directory

 `zxb remove <script-name>`
 Remove and unlink a script

 `zxb list | zxb ls`
 List all known scripts.

 `zxb update`
 Update zxb from GitHub


## 🎨 Customization

### Code Editor

`zxb` is going to try to use your `EDITOR` environment variable and fall back to **VSCode** as the editor when opening script files.

You must have [VSCode CLI Tools](https://code.visualstudio.com/docs/editor/command-line) installed for files to be opened automatically in VSCode.

In your shell configuration file, set an `EDITOR` environment variable:

```sh
# In .zshrc or .bashrc
export EDITOR="/usr/bin/vim"
```
 
**Note:**
VSCode supports both of these commands:
```sh
> code /path/to/scripts/my-script.mjs
> code /path/to/scripts
```

So if you want your editor to work properly, make sure it can accept both a path to a single script file and a path to a directory. 

