import gulp from "gulp";
import cp from "child_process";
import gutil from "gulp-util";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, "--buildDrafts --buildFuture"));

gulp.task("build", ["js", "hugo"]);
gulp.task("build-preview", ["js", "hugo-preview"]);

gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("Webpack output:");
    console.log(stats.toString({ // eslint-disable-line no-console
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

gulp.task("server", ["hugo", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, extraArgs) {
  const command = `hugo -d ../dist -s site -b http://localhost:3001 --cleanDestinationDir ${extraArgs || ""}`.trim();
  gutil.log("COMMAND", command);

  return cp.exec(command, (err, stdin, stderr) => {
    gutil.log("Hugo output:");
    console.log(stdin); //eslint-disable-line no-console

    if (err) {
      browserSync.notify("Hugo build failed :(");
      cb();
    } else {
      browserSync.reload();
      cb();
    }
  });
}
