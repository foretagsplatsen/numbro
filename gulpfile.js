const gulp = require("gulp");
const del = require("del");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const plugins = require("gulp-load-plugins")();

gulp.task("default", ["lint", "tests"]);

gulp.task("js-lint", () => {
    return gulp.src(["./src/**/*.js", "./tests/**/*.js", "./languages/**/*.js"])
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});

gulp.task("lint", ["js-lint"]);

// Tests

gulp.task("pre-test", () => {
    return gulp.src(["./src/**/*.js", "./languages/**/*.js"])
        .pipe(plugins.istanbul())
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task("tests", ["pre-test"], () => {
    return gulp.src("./tests/**/*.js")
        .pipe(plugins.jasmine({
            reporter: new plugins.reporters.TerminalReporter()
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

gulp.task("babel", () =>
    gulp.src("src/numbro.js")
        .pipe(plugins.babel({
            presets: ["env"]
        }))
        .pipe(gulp.dest("dist"))
);

gulp.task("build", () => {
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
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(plugins.uglify())
        .on("error", plugins.util.log)
        .pipe(plugins.sourcemaps.write("./"))
        .pipe(gulp.dest("./dist"));
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
        .pipe(plugins.git.tag(version, `Release version ${version}`, function(err) {
            if (err) {
                throw err;
            }
        }));
});

// Clean

gulp.task("clean", (cb) => {
    return del([
        "dist",
    ], cb);
});
