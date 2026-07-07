/**
 * @type {import('electron-builder').Configuration}
 */
export default {
  appId: "com.jotaroxyz.imageResizer",
  productName: "ImageResizer",
  directories: {
    output: "package"
  },
  files: [
    "package.json",
    {
      from: "dist/electron",
      to: "dist/electron"
    },
    {
      from: "dist/react",
      to: "dist/react"
    }
  ],
  icon: "./icon.png",
  extraResources: ["dist/electron/preload.cjs"],
  publish: {
    provider: "github",
    owner: "jotaroxyz",
    repo: "imageResizer",
    publishAutoUpdate: false
  },
  mac: {
    target: "dmg",
    artifactName: "${productName}-${os}-${arch}.${ext}"
  },
  linux: {
    target: "AppImage",
    category: "Utility",
    artifactName: "${productName}-${os}-${arch}.${ext}"
  },
  win: {
    target: ["portable", "msi"],
    artifactName: "${productName}-${os}-${arch}.${ext}"
  },
  msi: {
    artifactName: "${productName}-${os}-${arch}-installer.${ext}"
  },
  portable: {
    artifactName: "${productName}-${os}-${arch}-portable.${ext}"
  }
};