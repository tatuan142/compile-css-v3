// ====================================
// gulp file
// ====================================
/*
* TABLE OF CONTENTS
*
* require gulp
* define paths of folder, project name
* error
* copy
* compress PNG
* delete
* abf
* === CORE
* === TACH THONG TIN V2
* === BAOMOI DESKTOP
*/
// > require gulp
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



if (env == 'dev'){
    var paths = {
        source_folder   : "./source/" + project,
        dist_folder     : "dist/" + project,

        scss_source     : './source/' + project + '/scss/',
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
}
else{
    var paths = {
        source_folder   : "./source",
        dist_folder     : "./build",

        scss_source     : './source/scss/',
        css_dist        : './build/App_Themes/css',

        js_source       : './source/js/',
        js_dist         : './build/Jscripts',

        html_source     : "./source/demo-html/**/*",
        html_dist       : "./build/Demo-html",

        fonts_source    : "./source/fonts/**/*",
        fonts_dist      : "./build/App_Themes/fonts",

        img_source      : "./source/img",
        img_dist        : "./build/App_Themes/img",

        project_name    : "m-sggp"
    };
}

// > error
function reportError(error, css_file) {
    var text = error.toString();
    text = text.replace(/\n/gm, " \\A ");
    text = text.replace(/('|")/gm, " ");
    gulp.src(paths.css_dist + '/' + css_file, { allowEmpty: true })
        .pipe(inject.append("body:before{content : '" + text + "';white-space: pre;padding: 50px;display: block;}"))
        .pipe(gulp.dest(paths.css_dist))
        .pipe(browserSync.stream({ once: true }));
};

gulp.task('style', async function() {
    if (!file_style) file_style = project;
    gulp.src(paths.scss_source + file_style + ".scss", { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', function(err) {
            reportError(err, file_style + ".css");
        }))
        .pipe(cssmin())
        // .pipe(rename({
        //     basename: paths.project_name,
        //     suffix: '.min'
        // }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css_dist));
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src([
            // import plugin
            paths.js_source + 'vendor/modernizr.js',
            paths.js_source + 'vendor/jquery.min.js',
            paths.js_source + 'vendor/jquery-migrate.js',
            paths.js_source + 'vendor/bootstrap.min.js',
            paths.js_source + 'vendor/jquery.bxslider.js',
            paths.js_source + 'vendor/jquery.matchHeight-min.js',
            paths.js_source + 'vendor/jquery.scrollbar.min.js'
            // end import plugin
        ], { allowEmpty: true })
        .pipe(concat(paths.project_name + '.js'))
        // .pipe(gulp.dest(paths.js_dist)) // make normal js for debug
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js_dist))
        .pipe(browserSync.stream());
});


// > copy 
gulp.task('copy_js', async function() {    
    gulp.src(paths.js_source)
        .pipe(gulp.dest(paths.js_dist));
});

gulp.task('copy_html', async function() {    
    gulp.src(paths.html_source)
        .pipe(gulp.dest(paths.html_dist));
});

gulp.task('copy_fig_img', async function() {    
    gulp.src(paths.figImg_source)
        .pipe(gulp.dest(paths.figImg_dist));
});

gulp.task('copy_font', async function() {    
    gulp.src(paths.fonts_source)
        .pipe(gulp.dest(paths.fonts_dist));
});

// > compress PNG
gulp.task('compress_png', async function() {    
    imagemin([paths.img_source], {
        destination: paths.img_dist,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
});

// // > delete
gulp.task('delete', async function() {    
    del.sync([paths.dist_folder + '/*', '!' + paths.dist_folder + '/.git']);
});

// // > abf
gulp.task('abf', async function() {
    if (!file_style) file_style = project;
    if (link_static) {
        gulp.src(paths.css_dist + '/' + file_style + '.css', { allowEmpty: true })
            .pipe(rename({basename: file_style + '-abf'}))
            .pipe(inject.replace('../fonts', link_static + '/fonts'))
            .pipe(inject.replace('../img', link_static + '/img'))
            .pipe(gulp.dest(paths.css_dist));
    }
    else{
        console.log('no static link');
    }
});


gulp.task('browsersync', function (done) {
    browserSync.reload();
    done();
});

// Watch files
function watchFiles() {
    browserSync.init({ server: { baseDir: "./" }, open: false, port: 3000 });
    gulp.watch(paths.scss_source, gulp.series('style', 'browsersync'));
    gulp.watch(paths.js_source, gulp.series('browsersync'));
    gulp.watch(paths.html_source, gulp.series('browsersync'));
    gulp.watch(paths.figImg_source, gulp.series('browsersync'));
    gulp.watch(paths.img_source, gulp.series('browsersync'));
}

gulp.task('dev',
    gulp.series(
        'style',
        // 'scripts',
        // 'copy_js',
        // 'copy_html',
        // 'copy_fig_img',
        'copy_font',
        'compress_png'
    ),
    watchFiles()
);

/*
gulp dev --path m-tienphong-2020
*/


gulp.task('compile-test', async function() {
    gulp.src('./source/m-tienphong-2020/scss-test/folder-structure/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        // .pipe(rename({
        //     basename: paths.project_name,
        //     suffix: '.min'
        // }))
        .pipe(sourcemaps.write('../css-test/maps'))
        .pipe(gulp.dest('./source/m-tienphong-2020/css-test'));
});

function compile_scss(scss_file, css_file) {
    gulp.src(scss_file, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../css-test/maps'))
        .pipe(gulp.dest(paths.css_dist));
};


gulp.task('test',
    gulp.series(
        compile_scss('./source/m-tienphong-2020/scss-test/folder-structure/**/*.scss', './source/m-tienphong-2020/css-test')
    ),
    watchFiles()
);


















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

        scss_source     : './source/' + project + '/scss-test/**/*.scss',
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
function compile_scss_dev(cb) {
    return src(paths.scss_source, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(paths.css_dev))
        .pipe(browserSync.stream({ once: true }));
    cb();
};

function compile_scss_dist(cb) {
    return src(paths.scss_source, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../maps'))
        .pipe(dest(paths.css_dist))
        .pipe(browserSync.stream({ once: true }));
    cb();
};



// > copy 
async function copy_js(cb) {    
    return src(paths.js_source)
        .pipe(dest(paths.js_dist));
    cb()
};

async function copy_html(cb) {    
    return src(paths.html_source)
        .pipe(dest(paths.html_dist));
    cb()
};

async function copy_fig_img(cb) {    
    return src(paths.figImg_source)
        .pipe(dest(paths.figImg_dist));
    cb()
};

async function copy_font(cb) {    
    return src(paths.fonts_source)
        .pipe(dest(paths.fonts_dist));
    cb()
};



// > compress PNG
async function compress_png(cb) {    
    imagemin([paths.img_source], {
        destination: paths.img_dist,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
    cb()
};



// > refresh on change
function refresh_on_change(cb) {
    browserSync.reload();
    cb()
};



// Watch files
function watch_dev() {
    browserSync.init({ server: { baseDir: "./" }, open: false, port: 3000 });
    watch(paths.scss_source,    series(compile_scss_dev, refresh_on_change));
    watch(paths.js_source,      series(refresh_on_change));
    watch(paths.html_source,    series(refresh_on_change));
    watch(paths.figImg_source,  series(refresh_on_change));
    watch(paths.img_source,     series(refresh_on_change));
}

function watch_dist() {
    browserSync.init({ server: { baseDir: "./" }, open: false, port: 3000 });
    watch(paths.scss_source,    series(compile_scss_dist, refresh_on_change));
    watch(paths.js_source,      series(copy_js, refresh_on_change));
    watch(paths.html_source,    series(copy_html,refresh_on_change));
    watch(paths.figImg_source,  series(copy_fig_img, refresh_on_change));
    watch(paths.img_source,     series(compress_png, refresh_on_change));
}


// ===========
exports.dev = series(
    compile_scss_dev,
),watchFiles();

exports.build = series(
    compile_scss_dist,
    copy_js,
    copy_html,
    copy_fig_img,
    copy_font,
    compress_png,
),watchFiles();


/*
gulp dev    --path m-tienphong-2020   
gulp build  --path m-tienphong-2020   
*/


/*
Các phần cần hoàn thiện
 - split file
 - map relate to folder
 - watcher
 - support old style
 - report error
 */