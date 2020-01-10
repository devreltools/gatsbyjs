exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type SocialHandles {
      github: String
      gitlab: String
      slack: String
      twitter: String
    }

    type TeamMember implements Node @dontInfer {
      name: String!
      email: String!
      handles: SocialHandles
    }
  `;
  createTypes(typeDefs);
};
