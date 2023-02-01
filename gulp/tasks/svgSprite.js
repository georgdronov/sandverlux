import gulpSVGSprite from "gulp-svg-sprite";

export const svgSprite = () => {
  return app.gulp
    .src(app.path.src.svgs)
    .pipe(
      gulpSVGSprite({
        dest: app.path.src.svgSprite,
        mode: {
          stack: {
            sprite: "../icons.svg",
            example: true,
          },
        },
        shape: {
          spacing: {
            padding: 0,
          },
          dimension: {
            maxWidth: 10,
            maxHeight: 10,
          },
        },
      })
    )
    .pipe(app.gulp.dest(app.path.src.svgSprite));
};
