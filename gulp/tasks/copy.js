export const copy = () => {
  const files = app.gulp
    .src(app.path.src.files)
    .pipe(app.gulp.dest(app.path.build.files));
  const favicons = app.gulp
    .src(app.path.src.favicon)
    .pipe(app.gulp.dest(app.path.build.favicon));
  const robots = app.gulp
    .src(app.path.src.robots)
    .pipe(app.gulp.dest(app.path.build.html));

  return app.plugins.merge(files, favicons, robots);
};
