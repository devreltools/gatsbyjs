const fs = require(`fs`);
const path = require(`path`);
const mkdirp = require(`mkdirp`);
const Debug = require(`debug`);
const { createContentDigest } = require(`gatsby-core-utils`);
const { teamSchema } = require(`@devreltools/schema`);
const frontmatter = require("front-matter");
const uuid = require("uuid/v4");

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

exports.onCreateNode = (
  { node, actions, createNodeId, createContentDigest, getNode },
  options
) => {
  const { createNode, createParentChildLink } = actions;

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
  const fields = frontmatter(data).attributes;

  createNode({
    id: uuid(),
    parent: node.id,
    description: fields.name,

    name: fields.name,
    email: fields.email,
    handles: fields.handles,

    children: [],
    internal: {
      type: `Member`,
      contentDigest: createContentDigest("a-node-id")
    }
  });
};
