import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Schema location
  schema: "./src/schema.graphql",
  // where to write the generated files
  generates: {
    "./src/types.ts": {
      plugins: ["typescript", "typescript-resolvers"], // plugins for the generation
      // config: {
      //   contextType: "./context#DataSourceContext", // file path of context relative to ./src/types.ts
      // }
    },
  },
};

export default config;