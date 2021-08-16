# Gluegun CLI
Scripts that will be necessary for the good functioning of the gluegun library throughout the CLI project creation process.
```
}
  "scripts": {
    "format": "prettier --write **/*.{js,ts,tsx,json}",
    "lint": "tslint -p .",
    "clean-build": "rm -rf ./build",
    "compile": "tsc -p .",
    "copy-templates": "if [ -e ./src/templates ]; then cp -a ./src/templates ./build/; fi",
    "build": "yarn format && yarn lint && yarn clean-build && yarn compile && yarn copy-templates",
    "prepublishOnly": "yarn build"
  },
}
```
Another block of code you might need when trying to use the gluegun outside the default project scope.
```
{
  "files": [
    "tsconfig.json",
    "tslint.json",
    "build",
    "LICENSE",
    "readme.md",
    "docs",
    "bin"
  ],
}
```
