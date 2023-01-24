export const server = () => {
  app.plugins.browsersync.init(
    {
      open: false,
      server: {
        baseDir: `${app.path.build.html}`,
        serveStaticOptions: {
          extensions: ["html"],
        },
      },
      port: 3000,
    },
    function (err, bs) {
      bs.addMiddleware("*", function (req, res) {
        res.writeHead(302, {
          location: "404",
        });
        res.end("Redirecting!");
      });
    }
  );
};
