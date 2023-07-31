module.exports = {
  "appId": "com.app.billapp",
  "productName": "BillApp",
  "files": [
    "build/**/*",
    "electron/main.js",
    "electron/db.js",
    "electron/dbquery.js",
    "electron/updater.js",
    "electron/calculation.js",
    "package.json"
  ],
  "win": {
    "icon": "public/app_icon.ico",
    "verifyUpdateCodeSignature": false
  },
  "extraResources": [
    "db.sqlite"
  ],
  "extends": null,
  "mac": {
    "type": "distribution"
  },
  "publish": {
    "provider": "github",
    "owner": "Rejjak",
    "token" : "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"
  }
};
