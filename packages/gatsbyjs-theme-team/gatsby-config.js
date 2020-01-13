const withDefaults = require(`./lib/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);

  return {
    plugins: [{
        resolve: `gatsby-plugin-mdx`,
        options: {
          extensions: [`.mdx`, `.md`],
          gatsbyRemarkPlugins: [{
              resolve: `gatsby-remark-images`,
              options: {
                maxWidth: 1380,
                linkImagesToOriginal: false,
              },
            },
            {
              resolve: `gatsby-remark-copy-linked-files`
            },
            {
              resolve: `gatsby-remark-smartypants`
            },
          ],
          remarkPlugins: [require(`remark-slug`)],
        },
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: `${options.teamPath}/members`,
          name: "Member"
        }
      },
      `gatsby-transformer-sharp`,
      `gatsby-plugin-sharp`,
    ]
  };
};
