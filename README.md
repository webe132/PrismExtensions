# PrismExtensions

The official extension store for [Prism Launcher +](https://github.com/webe132/PrismLauncher-plus).

Extensions are add-ons for the launcher itself (not Minecraft mods). The launcher
reads `index.json` from the root of this repository as its built-in store.

## Layout

```
index.json                          store index the launcher fetches
extensions/<id>/                     one folder per extension
  addon.json                         manifest
  main.js                            entry script
  settings.json                      optional settings schema
  README.md                          shown on the extension's page in the launcher
  <id>-<version>.zip                 downloadable package (addon.json at the zip root)
```

To publish an extension, add its folder under `extensions/`, commit a packaged
`.zip` whose root contains `addon.json`, and add an entry to `index.json` with a
`downloadUrl` pointing at that zip.
