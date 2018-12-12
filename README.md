# JupyterLab Shell File

This extension is intended for creating and running a shell script file in JupyterLab.

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab_shell_script_file
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
