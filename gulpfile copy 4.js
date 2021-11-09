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

var argv =  require('yargs')
            .default({ 
                env    : 'cms'
            })
            .argv;
var project = argv.path;
var file_style = argv.file;
var link_static = argv.static;
var env = argv.env;

if (env == 'bm'){
    var paths = {
        source_folder: "./source/" + project ,
        dist_folder: "dist/" + project ,
        scss_dev: './source/' + project + '/scss/',
        css: './dist/' + project + '/styles/css',
        js_dev: './source/' + project + '/js/',
        js: './dist/' + project + '/js',
        html_dev: "./source/" + project + '/html/**/*.html',
        html: "./dist/" + project + '/html',
        figImg_dev: "./source/" + project + '/figurations/**/*',
        figImg: "./dist/" + project + '/figurations',
        fonts_dev: "./source/" + project + '/fonts/**/*',
        fonts: "./dist/" + project + '/styles/fonts',
        img_dev: "./source/" + project + '/img/**/*',
        img: "./dist/" + project + '/styles/img',
    };
}
else{
    var paths = {
        source_folder: "./source",
        dist_folder: "./build",
        scss_dev: './source/scss/',
        css: './build/App_Themes/css',
        js_dev: './source/js/**/*',
        js: './build/Jscripts',
        html_dev: "./source/demo-html/**/*",
        html: "./build/Demo-html",
        fonts_dev: "./source/fonts/**/*",
        fonts: "./build/App_Themes/fonts",
        img_dev: "./source/img",
        img: "./build/App_Themes/img",
        project_name: "viettimes"
    };
}

// > error
function reportError(error, project, css_file) {
    var text = error.toString();
    text = text.replace(/\n/gm, " \\A ");
    text = text.replace(/('|")/gm, " ");
    gulp.src(paths.css + '/' + css_file, { allowEmpty: true })
        .pipe(inject.append("body:before{content : '" + text + "';white-space: pre;padding: 50px;display: block;}"))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.stream({ once: true }));
};

gulp.task('style', async function() {
    if (!file_style) file_style = project;
    gulp.src(paths.scss_dev + file_style + ".scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', function(err) {
            reportError(err, project, file_style + ".css");
        }))
        .pipe(cssmin())
        .pipe(rename({
            basename: paths.project_name,
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css));
});

// scripts task
gulp.task('scripts', function() {
    return gulp.src([
            // import plugin
            './source/js/vendor/modernizr.js',
            './source/js/vendor/jquery.min.js',
            './source/js/vendor/jquery-migrate.js',
            './source/js/vendor/bootstrap.min.js',
            './source/js/vendor/jquery.bxslider.js',
            './source/js/vendor/jquery.matchHeight-min.js',
            './source/js/vendor/jquery.scrollbar.min.js'
            // end import plugin
        ], { allowEmpty: true })
        .pipe(concat(paths.project_name + '.js'))
        // .pipe(gulp.dest(paths.js)) // make normal js for debug
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());
});


// > copy 
gulp.task('copy_js', async function() {    
    gulp.src(paths.js_dev)
        .pipe(gulp.dest(paths.js));
});

gulp.task('copy_html', async function() {    
    gulp.src(paths.html_dev)
        .pipe(gulp.dest(paths.html));
});

gulp.task('copy_fig_img', async function() {    
    gulp.src(paths.figImg_dev)
        .pipe(gulp.dest(paths.figImg));
});

gulp.task('copy_font', async function() {    
    gulp.src(paths.fonts_dev)
        .pipe(gulp.dest(paths.fonts));
});

// > compress PNG
gulp.task('compress_png', async function() {    
    imagemin([paths.img_dev], {
        destination: paths.img,
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
        gulp.src(paths.css + '/' + file_style + '.css', { allowEmpty: true })
            .pipe(rename({basename: file_style + '-abf'}))
            .pipe(inject.replace('../fonts', link_static + '/fonts'))
            .pipe(inject.replace('../img', link_static + '/img'))
            .pipe(gulp.dest(paths.css));
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
    gulp.watch(paths.scss_dev, gulp.series('style', gulp.parallel( 'abf', 'browsersync')));
    gulp.watch(paths.js_dev, gulp.series('copy_js', 'browsersync'));
    gulp.watch(paths.html_dev, gulp.series('copy_html', 'browsersync'));
    gulp.watch(paths.img_dev, gulp.series('compress_png', 'browsersync'));
}

gulp.task('cms',
    gulp.series(
        'style',
        'scripts',
        'copy_js',
        'copy_html',
        'copy_font',
        'compress_png'
    ),
    watchFiles()
);

/*
gulp cms --file styles
*/