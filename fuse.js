const { src, task, context } = require("fuse-box/sparky");
const { FuseBox, QuantumPlugin } = require("fuse-box");

context(class 
{
    getConfig() {
        return FuseBox.init({
            homeDir: "src",
            target: "universal@es6",
            output: "dist/$name.js",
            plugins: [
                this.isProduction && QuantumPlugin({
                    uglify: true,
                    treeshake: true,
                    bakeApiIntoBundle: true
                }),
            ],
        });
    }
});


task("default", async context => {
    const fuse = context.getConfig();

    fuse
      .bundle("plumbing-toolkit")
      .hmr()
      .watch()
      .instructions(">index.ts");
  
    await fuse.run();
});

task("dist", async context => {
    context.isProduction = true;
    const fuse = context.getConfig();

    fuse.bundle("plumbing-toolkit").instructions(">index.ts");
  
    await fuse.run();
});

task("clean", async context => {
    await src("./dist")
        .clean("dist/")
        .exec();
});