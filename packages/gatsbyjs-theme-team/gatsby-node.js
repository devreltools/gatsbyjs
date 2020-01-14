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

  const slug = urlResolve(publicPath, "members", filePath);

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

const MembersPage = require.resolve("./src/members/list/query");
const MemberPage = require.resolve("./src/members/view/query.js");

exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;

  const graphqlMembers = await graphql(`
    {
      allMember(sort: { fields: [name], order: ASC }, limit: 1000) {
        edges {
          node {
            id
            slug
            name
            email
            handles {
              github
              gitlab
              slack
              twitter
            }
          }
        }
      }
    }
  `);

  if (graphqlMembers.errors) {
    reporter.panic(graphqlMembers.errors);
  }

  const { allMember } = graphqlMembers.data;
  const members = allMember.edges;

  members.forEach(({ node: member }, index) => {
    const previous = index === member.length - 1 ? null : member[index + 1];
    const next = index === 0 ? null : member[index - 1];

    const { slug } = member;

    createPage({
      path: slug,
      component: MemberPage,
      context: {
        id: member.id,
        previousId: previous ? previous.node.id : undefined,
        nextId: next ? next.node.id : undefined
      }
    });
  });

  createPage({
    path: `${publicPath}/members`,
    component: MembersPage,
    context: {}
  });
};
