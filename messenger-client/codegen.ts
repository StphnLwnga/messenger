import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Schema location
  schema: "./lib/graphql/schema.graphql",
  // where to write the generated files
  generates: {
    "./lib/graphql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"], // plugins for the generation
      // config: {
      //   contextType: "./context#DataSourceContext", // file path of context relative to ./lib/types.ts
      // }
    },
  },
};

export default config;

// TODO: add plugins here