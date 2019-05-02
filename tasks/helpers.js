const yargs = require('yargs');
const log = require('fancy-log');
const config = require('./config');
const gulpLoadPlugins = require('gulp-load-plugins');
const fs = require('fs');
const path = require('path');

const $ = gulpLoadPlugins();

function errorAlert(error) {
  if (!config.production) {
    $.notify.onError({ title: 'SCSS Error', message: 'Check your terminal', sound: 'Sosumi' })(error);
    log(error.messageFormatted ? error.messageFormatted : error.message);
  }
  this.emit('end');
}
module.exports.errorAlert = errorAlert;

function pathTo(relativePath) {
  return `${config.project}/${relativePath}`;
}
module.exports.pathTo = pathTo;

module.exports.projectPath = config.project;

const treeMaker = (dir) => {
  return new Promise((resolve, reject) => {
    const children = [];

    fs.readdir(dir, async (err, list) => {
      if (err) reject();

      for (let child of list) {
        const childPath = `${dir}/${child}`;
        const isDir = fs.lstatSync(childPath).isDirectory();

        if (isDir) {
          const subtree = await treeMaker(childPath);
          children.push({ [child]: subtree });
        } else {
          const valideExts = ['.md', '.html'];
          const fileExt = path.extname(child);
          if (valideExts.includes(fileExt)) children.push(child);
        }
      };

      resolve(children);
    });
  });
};

module.exports.dirTree = async (rootPath) => {
  const tree = await treeMaker(rootPath);
  return tree;
};
