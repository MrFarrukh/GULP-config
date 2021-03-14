"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");

const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin")
const plumber = require("gulp-plumber")
const rename = require("gulp-rename")
const rigger = require("gulp-rigger")
const sass = require("gulp-sass")
const browsersync = require("browser-sync")
const panini = require("panini")
const uglify = require("gulp-uglify")
const stripcsscomments = require("gulp-strip-css-comments")
const pug = require("gulp-pug")


var path = {
    build: {
        html: "dist/",
        css: "dist/assets/css/",
        js: "dist/assets/js/",
        images: "dist/assets/img/",
        font: "dist/assets/font/"
    },
    src: {
        html: "src/*.html",
        pug: "src/pug/pages/**/*.pug",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/**/style.scss",
        images: "src/assets/img/**/*.{jpg,png,gif,svg,ico}",
        font: "src/assets/font/*"
    },
    watch: {
        html: "src/**/*.html",
        pug: "src/pug/**/*.pug",
        js: "src/assets/js/**/*.js",
        css: "src/assets/**/*.scss",
        images: "src/assets/img/**/*.{jpg,png,gif,svg,ico}",
        font: "src/assets/font/*"
    },
    clean: "./dist"
}

function html(){
    return src(path.src.html, {base: 'src/'})
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function font(){
  return src(path.src.font, {
      base: 'src/assets/font/'
  })
  .pipe(dest(path.build.font))
  .pipe(browsersync.stream())
}

function browserSync(done){
    browsersync.init({
      server: {
        baseDir: "./dist/"
      },
      port: 3000
    });
  }
  
  function browserSyncReload(done){
    browsersync.reload();
  }
    
  function css(){
    return src(path.src.css, {base: 'src/assets/sass/'})
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano())
        .pipe(stripcsscomments())
        .pipe(rename({
          suffix: ".min",
          extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
  }

  function pugg(){
      return src(path.src.pug, {
          base: 'src/pug/pages/'
      })
      .pipe(pug({
          pretty: true
      }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
  }
   
  function js() {
    return src(path.src.js, {base: 'src/assets/js/'})
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
  }
 
  function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images));
  }    

  function clean() {
    return del(path.clean);
  }
  

  function watchFiles() {
    gulp.watch([path.watch.pug], pugg);
    gulp.watch([path.watch.font], font);
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
  }
  const build = gulp.series(clean, gulp.parallel(pugg,font, html, css, js, images))
  const watch = gulp.parallel(build, watchFiles, browserSync);
  
exports.html = html;
exports.css = css;
exports.js = js;
exports.font = font; 
exports.pugg = pugg;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch; 
