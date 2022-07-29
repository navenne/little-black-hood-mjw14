import esbuildServe from "esbuild-serve";

esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["src/game.ts"],
    bundle: true,
    outfile: "public/bundle.js",
  },
  { root: "public" }
);