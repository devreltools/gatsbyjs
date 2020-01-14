const Debug = require(`debug`);
const frontmatter = require("front-matter");
const fs = require(`fs`);
const { urlResolve, createContentDigest } = require(`gatsby-core-utils`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const mkdirp = require(`mkdirp`);
const path = require(`path`);
const uuid = require("uuid/v4");
const { teamSchema } = require(`@devreltools/schema`);
const debug = Debug(`@devreltools/gatsbyjs-theme-team`);

const gatsbyTeamSchema = teamSchema.replace(
  /type Member {/g,
  "type Member implements Node {"
);

let publicPath;
let contentPath;

exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();

  publicPath = themeOptions.publicPath || `/team`;
  contentPath = themeOptions.contentPath || `content/team`;

  const dirs = [path.join(program.directory, contentPath, "members")];

  debug({
    function: "required-directories",
    parameters: [dirs]
  });

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      debug({
        function: "mkdirp",
        parameters: [dir]
      });
      mkdirp.sync(dir);
    }
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(gatsbyTeamSchema);
};

exports.onCreateNode = ({ node, actions, getNode }, options) => {
  const { createNode } = actions;

  if (node.internal.type !== `File`) {
    return;
  }

  if (!node.sourceInstanceName) {
    return;
  }

  if (node.sourceInstanceName !== "Member") {
    return;
  }

  const data = fs.readFileSync(`${node.dir}/${node.relativePath}`, "utf8");

  const filePath = createFilePath({
    node: node,
    getNode,
    basePath: contentPath
  });

  const slug = urlResolve(publicPath, "member", filePath);

  const attributes = frontmatter(data).attributes;

  const fields = { ...attributes, slug: slug };

  createNode({
    id: uuid(),
    parent: node.id,
    description: fields.name,

    ...fields,

    children: [],
    internal: {
      type: `Member`,
      contentDigest: createContentDigest(fields)
    }
  });
};
