const { src, dest, parallel, series, watch} = require('gulp');



var gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    cssmin = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    inject = require('gulp-inject-string'),
    imagemin = require('imagemin'),
    imageminJpegtran = require('imagemin-jpegtran'),
    imageminPngquant = require('imagemin-pngquant');
    concat = require('gulp-concat');



var argv        =   require('yargs')
                        .default({ 
                            env    : 'dev'
                        }).argv,
    project     =   argv.path,
    file_style  =   argv.file,
    link_static =   argv.static,
    env         =   argv.env;

if (!file_style) file_style = project;



var paths = {
        source_folder   : "./source/" + project,
        dist_folder     : "dist/" + project,

        scss_source     : './source/' + project + '/scss/**/*.scss',
        css_dev         : './source/' + project + '/styles/css',
        css_dist        : './dist/' + project + '/styles/css',

        js_source       : './source/' + project + '/js/**/*.js',
        js_dist         : './dist/' + project + '/js',

        html_source     : "./source/" + project + '/html/**/*.html',
        html_dist       : "./dist/" + project + '/html',

        figImg_source   : "./source/" + project + '/figurations/**/*',
        figImg_dist     : "./dist/" + project + '/figurations',

        fonts_source    : "./source/" + project + '/fonts/**/*',
        fonts_dev       : "./source/" + project + '/styles/fonts',
        fonts_dist      : "./dist/" + project + '/styles/fonts',

        img_source      : "./source/" + project + '/img/**/*',
        img_dev         : "./source/" + project + '/styles/img',
        img_dist        : "./dist/" + project + '/styles/img',
    };
 


// > compile scss to css
function compile_scss_dev() {
    return src(paths.scss_source, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(paths.css_dev));
};

function compile_scss_dist() {
    return src(paths.scss_source, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(paths.css_dist));
};



// > copy 
async function copy_js() {    
    return src(paths.js_source)
        .pipe(dest(paths.js_dist));
};

async function copy_html() {    
    return src(paths.html_source)
        .pipe(dest(paths.html_dist));
};

async function copy_fig_img() {    
    return src(paths.figImg_source)
        .pipe(dest(paths.figImg_dist));
};

async function copy_font_dev() {    
    return src(paths.fonts_source)
        .pipe(dest(paths.fonts_dev));
};

async function copy_font_dist() {    
    return src(paths.fonts_source)
        .pipe(dest(paths.fonts_dist));
};



// > compress PNG
async function compress_png_dev() {    
    return imagemin([paths.img_source], {
        destination: paths.img_dev,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
};

async function compress_png_dist() {    
    return imagemin([paths.img_source], {
        destination: paths.img_dist,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
};



// > refresh on change
async function refresh_on_change(cb) {
    browserSync.reload();
    cb()
};



// Watch files
async function watch_dev() {
    browserSync.init({ server: { baseDir: "./" }, open: false, port: 3000 });
    watch(paths.scss_source,    series(compile_scss_dev, refresh_on_change));
    watch(paths.js_source,      series(refresh_on_change));
    watch(paths.html_source,    series(refresh_on_change));
    watch(paths.figImg_source,  series(refresh_on_change));
    watch(paths.img_source,     series(refresh_on_change));
}

// async function watch_dist() {
//     browserSync.init({ server: { baseDir: "./" }, open: false, port: 3000 });
//     watch(paths.scss_source,    series(compile_scss_dist, refresh_on_change));
//     watch(paths.js_source,      series(copy_js, refresh_on_change));
//     watch(paths.html_source,    series(copy_html,refresh_on_change));
//     watch(paths.figImg_source,  series(copy_fig_img, refresh_on_change));
//     watch(paths.img_source,     series(compress_png, refresh_on_change));
// }


// ===========
exports.dev = series(
    compile_scss_dev,
    copy_font_dev,
    compress_png_dev,
),watch_dev();

exports.build = series(
    compile_scss_dist,
    copy_js,
    copy_html,
    copy_fig_img,
    copy_font_dist,
    compress_png_dist,
);


/*
gulp dev    --path m-tienphong-2020
gulp build  --path m-tienphong-2020
*/


/*
Các phần cần hoàn thiện
>>>>>>>> Chưa làm được phần watch cho dist, mặc dù ko cần nhưng có vấn đề với phần watch này
 - split file
 - map relate to folder
 - watcher
 - support old style
 - report error
 */