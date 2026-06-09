# SyncFolder

Keeps chosen folders in sync across all of your instances. Instead of copying
between instances directly, it uses one **shared folder** as the hub: every
selected folder is mirrored between that hub and each instance, so a file saved
while playing one version is available in every other. The newest copy of each
file always wins, and nested files (such as worlds) are handled too.

## Settings

**Folders** (tick the ones you want synced):

| Setting | Game folder |
|---------|-------------|
| Sync shaders | `shaderpacks` |
| Sync resource packs | `resourcepacks` |
| Sync schematics | `schematics` |
| Sync worlds | `saves` |

**Storage:**

| Setting | Description |
|---------|-------------|
| Shared folder path | Folder where synced files are kept. Leave empty to use the extension's own data folder. |
| Show a notification after syncing | Pop up a message when files are copied. |

Open the settings from the **Extensions Settings** page: select this extension and
click the gear **Settings** button.
