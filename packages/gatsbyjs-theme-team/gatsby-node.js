import { teamSchema } from "@devreltools/schema";

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = teamSchema;

  createTypes(typeDefs);
};
