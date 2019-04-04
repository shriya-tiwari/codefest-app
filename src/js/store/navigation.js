export const navigation = {
  hierarchy: {
    "~": {
      ".": "/",
      events: {
        ".": "/events"
      },
      haxplore: {
        ".": "/haxplore"
      }
    },
    "404": {
      "~": {
        ".": "/"
      }
    }
  },
  getPwdFromCurrent: function(current) {
    if (!current) return [];
    let rawPath = current.split("/");
    return rawPath.filter(el => !!el);
  },
  getLinksFromPwd: function(pwd) {
    var current = null;
    var result = [];
    pwd.forEach(dir => {
      if (current) current = current[dir];
      else current = this.hierarchy[dir];
      result.push(current["."] || "/");
    });
    return result;
  },
  getCurrentNav: function(pwd) {
    var current = null;
    var parent = null;
    pwd.forEach(dir => {
      parent = current;
      if (current) current = current[dir];
      else current = this.hierarchy[dir];
    });
    current[".."] = parent;
    return current;
  },
  listContents: function(pwd) {
    var possibleNav = this.getCurrentNav(pwd);
    var result = {};
    for (let key in possibleNav) {
      if (possibleNav[key])
        result[key] = possibleNav[key]["."] || possibleNav["."];
      else result[key] = null;
    }
    return result;
  },
  getTargetPageUrl: function(pwd, targetDir) {
    if (targetDir === "/" || targetDir === "~") return "/";
    if (targetDir === ".") return this.getLinksFromPwd(pwd).splice(-1)[0];
    let backNav = targetDir.match(/^(\.\.)(\/\.\.)*/g);
    if (backNav) {
      pwd = pwd.slice(0, -backNav[0].split("/").length);
      targetDir = targetDir.slice(backNav[0].length);
    }

    let currentDir = null;
    if (pwd && pwd.length > 0) {
      let hierarchy = this.getCurrentNav(pwd);
      let route = this.getPwdFromCurrent(targetDir);
      if (route.length === 0) {
        return hierarchy["."];
      }
      route.forEach(dir => {
        if (currentDir) currentDir = currentDir[dir];
        else currentDir = hierarchy[dir];
      });
    }
    if (currentDir) return currentDir["."];
  }
};

export const terminal = {
  history: [],
  getHistory: function() {
    return this.history;
  },
  addToHistory: function(pwd, status, input, output) {
    this.history.push({ pwd, status, input, output });
  },
  clearHistory: function() {
    this.history.splice(0, this.history.length);
  }
};