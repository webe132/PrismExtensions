Launcher.log("Schematic Sync starting");

var folderName = Launcher.setting("schematicsFolder", "schematics");
var notifyOnSync = Launcher.setting("notify", true);
var extraExts = String(Launcher.setting("extraExtensions", ""))
    .split(",")
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(function (s) { return s.length > 0; });

var SCHEMATIC_EXTS = ["litematic", "schem", "schematic", "nbt"].concat(extraExts);

function extOf(path) {
    var i = path.lastIndexOf(".");
    return i < 0 ? "" : path.substring(i + 1).toLowerCase();
}

function baseName(path) {
    var p = path.replace(/\\/g, "/");
    var i = p.lastIndexOf("/");
    return i < 0 ? p : p.substring(i + 1);
}

function isSchematic(path) {
    return SCHEMATIC_EXTS.indexOf(extOf(path)) !== -1;
}

var instances = Launcher.instances();
if (!instances || instances.length < 2) {
    Launcher.log("Need at least two instances to sync; nothing to do.");
} else {
    var dirs = [];
    for (var i = 0; i < instances.length; i++) {
        if (instances[i].gameDir)
            dirs.push(instances[i].gameDir + "/" + folderName);
    }

    var newest = {};
    for (var d = 0; d < dirs.length; d++) {
        var files = Launcher.listFiles(dirs[d]);
        for (var f = 0; f < files.length; f++) {
            var path = files[f];
            if (!isSchematic(path))
                continue;
            var name = baseName(path);
            var mtime = Launcher.fileModifiedMs(path);
            if (!newest[name] || mtime > newest[name].mtime)
                newest[name] = { path: path, mtime: mtime };
        }
    }

    var uniqueCount = 0;
    for (var key in newest)
        uniqueCount++;

    var copied = 0;
    for (var d2 = 0; d2 < dirs.length; d2++) {
        Launcher.ensureDir(dirs[d2]);
        for (var n in newest) {
            var src = newest[n].path;
            var target = dirs[d2] + "/" + n;
            if (src === target)
                continue;
            var needsCopy = !Launcher.fileExists(target) ||
                            Launcher.fileModifiedMs(target) < newest[n].mtime;
            if (needsCopy && Launcher.copyFile(src, target)) {
                copied++;
                Launcher.log("Synced " + n + " -> " + dirs[d2]);
            }
        }
    }

    Launcher.log("Schematic Sync done: " + uniqueCount + " unique schematic(s), " + copied + " file(s) copied.");
    if (notifyOnSync && copied > 0)
        Launcher.notify("Schematic Sync", "Synced " + copied + " schematic file(s) across " + dirs.length + " instances.");
}
