import browserSync from "browser-sync";
import newer from "gulp-newer";
import debug from "gulp-debug";
import gulpIf from "gulp-if";
import merge from "merge-stream";

export const plugins = {
  browsersync: browserSync,
  newer: newer,
  debug: debug,
  merge: merge,
  if: gulpIf,
};
