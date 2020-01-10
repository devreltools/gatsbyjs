const withDefaults = require(`./lib/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);

  return {
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.teamMemberPath,
          name: "team-member"
        }
      }
    ].filter(Boolean)
  };
};
