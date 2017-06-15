const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('./config');
const fs = require('fs');

const dirs = ['atoms', 'molecules', 'organisms', 'pages'];
const components = [];

const prepare = (done) => {
  dirs.forEach((dir) => {
    let files = fs.readdirSync(`${config.project}/${config.src}components/${dir}`);
    
    // ignore .gitkeep
    const gitKeepIndex = files.indexOf('.gitkeep');
    if (gitKeepIndex > -1) {
      files = [...files.slice(0, gitKeepIndex), ...files.slice(gitKeepIndex + 1)];
    }

    files.forEach(file => components.push(`./components/${dir}/${file}`));
  });
  
  return gulp.src('./templates/index.html')
    .pipe($.replace('/* SOURCES */', `"${components.join('","')}"`))
    .pipe(gulp.dest(config.dest, {cwd: config.project}));
}

module.exports = prepare;