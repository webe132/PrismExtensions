Launcher.log("SyncFolder starting");

var TYPES = [
    { key: "syncShaders", folder: "shaderpacks", def: false },
    { key: "syncResourcePacks", folder: "resourcepacks", def: false },
    { key: "syncSchematics", folder: "schematics", def: true },
    { key: "syncWorlds", folder: "saves", def: false }
];

var hub = String(Launcher.setting("hubPath", "")).trim();
if (!hub)
    hub = Launcher.dataDir + "/shared";
var notifyOnSync = Launcher.setting("notify", true);

function norm(path) {
    return path.replace(/\\/g, "/");
}

function relativeTo(root, path) {
    var r = norm(root);
    var p = norm(path);
    if (r.charAt(r.length - 1) !== "/")
        r = r + "/";
    if (p.indexOf(r) === 0)
        return p.substring(r.length);
    return p.substring(p.lastIndexOf("/") + 1);
}

var enabled = [];
for (var t = 0; t < TYPES.length; t++) {
    if (Launcher.setting(TYPES[t].key, TYPES[t].def))
        enabled.push(TYPES[t].folder);
}

if (enabled.length === 0) {
    Launcher.log("Nothing selected to sync.");
} else {
    var roots0 = [hub];
    var instances = Launcher.instances();
    if (instances) {
        for (var i = 0; i < instances.length; i++) {
            if (instances[i].gameDir)
                roots0.push(instances[i].gameDir);
        }
    }

    var totalCopied = 0;
    for (var e = 0; e < enabled.length; e++) {
        var folder = enabled[e];
        var roots = [];
        for (var b = 0; b < roots0.length; b++)
            roots.push(roots0[b] + "/" + folder);

        var newest = {};
        for (var r = 0; r < roots.length; r++) {
            var files = Launcher.listFilesRecursive(roots[r]);
            for (var f = 0; f < files.length; f++) {
                var key = relativeTo(roots[r], files[f]);
                var mtime = Launcher.fileModifiedMs(files[f]);
                if (!newest[key] || mtime > newest[key].mtime)
                    newest[key] = { path: files[f], mtime: mtime };
            }
        }

        for (var r2 = 0; r2 < roots.length; r2++) {
            Launcher.ensureDir(roots[r2]);
            for (var k in newest) {
                var src = newest[k].path;
                var target = roots[r2] + "/" + k;
                if (norm(src) === norm(target))
                    continue;
                var needs = !Launcher.fileExists(target) || Launcher.fileModifiedMs(target) < newest[k].mtime;
                if (needs && Launcher.copyFile(src, target)) {
                    totalCopied++;
                    Launcher.log("Synced " + folder + "/" + k + " -> " + roots[r2]);
                }
            }
        }
    }

    Launcher.log("SyncFolder done: " + totalCopied + " file(s) copied across " + enabled.length + " folder type(s) via " + hub);
    if (notifyOnSync && totalCopied > 0)
        Launcher.notify("SyncFolder", "Synced " + totalCopied + " file(s) through the shared folder.");
}
