module.exports = grunt => {
    grunt.initConfig({
        nodeunit: {
            all: ["tests-nodeunits/**/*.js"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.registerTask("default", ["nodeunit"]);
};
