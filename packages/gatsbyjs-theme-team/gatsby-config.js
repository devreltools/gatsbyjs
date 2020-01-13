module.exports = themeOptions => {
  return {
    plugins: [
      {
        resolve: "gatsby-source-filesystem",
        options: {
          path: `${themeOptions.contentPath}/members`,
          name: `Member`
        }
      }
    ]
  };
};
