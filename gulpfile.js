const gulp = require("gulp");
const del = require("del");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const path = require("path");
const fs = require("fs");
const reporters = require("jasmine-reporters");

const plugins = require("gulp-load-plugins")({
    rename: {
        "gulp-jasmine-browser": "jasmineBrowser"
    }
});

gulp.task("default", ["lint", "tests"]);

gulp.task("lint", ["lint:js"]);

gulp.task("lint:js", () => {
    return gulp.src(["./src/**/*.js", "./tests/**/*.js", "./languages/**/*.js"])
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format("unix"))
        .pipe(plugins.eslint.failAfterError());
});

// Tests

gulp.task("pre-test", () => {
    return gulp.src(["./src/**/*.js", "./languages/**/*.js"])
        .pipe(plugins.istanbul())
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task("tests", ["pre-test"], () => {
    return gulp.src("./tests/**/*.js")
        .pipe(plugins.jasmine({
            reporter: new reporters.TerminalReporter()
        }))
        .pipe(plugins.istanbul.writeReports());
    // .pipe(plugins.istanbul.enforceThresholds({thresholds: {global: 90}}));
});

gulp.task("jasmine", () => {
    return gulp.src(["src/**/*.js", "./tests/**/*.js"])
        .pipe(plugins.jasmineBrowser.specRunner())
        .pipe(plugins.jasmineBrowser.server({port: 8888}));
});

// Coverage

gulp.task("basic-coverage", () => {
    return gulp.src("").pipe(plugins.shell("istanbul cover ./node_modules/.bin/jasmine --captureExceptions")
    );
});

// Build

gulp.task("build", ["build:src", "build:src:min", "build:languages", "build:all-languages"]);

gulp.task("build:src", () => {
    const babelify = require("babelify");
    // set up the browserify instance on a task basis
    let b = browserify({
        standalone: "numbro",
        entries: "./src/numbro.js",
        debug: true,
        transform: [babelify]
    });

    return b.bundle()
        .pipe(source("numbro.js"))
        .pipe(buffer())
        // Add transformation tasks to the pipeline here.
        .on("error", plugins.util.log)
        .pipe(gulp.dest("./dist"));
});

gulp.task("build:src:min", () => {
    const babelify = require("babelify");
    // set up the browserify instance on a task basis
    let b = browserify({
        standalone: "numbro",
        entries: "./src/numbro.js",
        debug: true,
        transform: [babelify]
    });

    return b.bundle()
        .pipe(source("numbro.min.js"))
        .pipe(buffer())
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(plugins.uglify())
        .on("error", plugins.util.log)
        .pipe(plugins.sourcemaps.write("./"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("build:languages", () => {
    const babelify = require("babelify");
    return gulp.src("./languages/**/*.js")
        .pipe(plugins.foreach((stream, file) => {
            let fullName = file.history[0];
            let extension = path.extname(fullName);
            let baseName = path.basename(fullName, extension);

            let b = browserify({
                standalone: `numbro.${baseName}`,
                entries: fullName,
                debug: true,
                transform: [babelify]
            });

            return b.bundle()
                .pipe(source(`${baseName}.min${extension}`))
                .pipe(buffer())
                .pipe(plugins.sourcemaps.init({loadMaps: true}))
                .pipe(plugins.uglify())
                .on("error", plugins.util.log)
                .pipe(plugins.sourcemaps.write("./"))
                .pipe(gulp.dest("./dist/languages/"));
        }));
});

gulp.task("build:all-languages", ["build:languages"], (cb) => {
    let dir = "./dist";
    fs.readdir(`${dir}/languages`, (_, files) => {
        let langFiles = files
            .filter(file => file.match(/\.js$/))
            .map(file => `exports["${file.replace(".min.js", "")}"]=require("./languages/${file}");`).join("");
        fs.writeFile(`${dir}/languages.min.js`, langFiles, cb);
    });
});

// Bumping

const referencesToVersion = [
    "./package.json",
    "./bower.json",
    "./component.json",
    "./src/**/*.js"
];

gulp.task("bump:major", () => {
    gulp.src(referencesToVersion, {base: "./"})
        .pipe(plugins.bump({
            type: "major",
            global: true
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("bump:minor", () => {
    gulp.src(referencesToVersion, {base: "./"})
        .pipe(plugins.bump({
            type: "minor",
            global: true
        }))
        .pipe(gulp.dest("./"));
});

gulp.task("bump:patch", () => {
    gulp.src(referencesToVersion, {base: "./"})
        .pipe(plugins.bump({
            type: "patch",
            global: true
        }))
        .pipe(gulp.dest("./"));
});

// Release

gulp.task("release", () => {
    let version = require("./package.json").version;
    return gulp.src("./package.json")
        .pipe(plugins.confirm({
            question: `Are you sure you want to publish a new release with version ${version}? (yes/no)`,
            input: "_key:y"
        }))
        .pipe(plugins.git.tag(version, `Release version ${version}`, err => {
            if (err) {
                throw err;
            }
        }));
});

// Clean

gulp.task("clean", ["clean:build"]);

gulp.task("clean:build", (cb) => {
    return del(["dist"], cb);
});
