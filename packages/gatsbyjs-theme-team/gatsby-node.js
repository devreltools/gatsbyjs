const fs = require(`fs`)
const path = require(`path`)
const mkdirp = require(`mkdirp`)
const Debug = require(`debug`)


const withDefaults = require(`./lib/default-options`);
const {
  teamSchema
} = require(`@devreltools/schema`)

const gatsbyTeamSchema = teamSchema.replace(/type Member {/g, "type Member implements Node {");

exports.createSchemaCustomization = ({
  actions
}) => {
  const {
    createTypes
  } = actions;

  createTypes(gatsbyTeamSchema);
};

exports.onPreBootstrap = ({
  store
}, themeOptions) => {
  const {
    program
  } = store.getState()
  const {
    teamPath
  } = withDefaults(themeOptions)

  const debug = Debug(`@devreltools/gatsbyjs-theme-team`);

  const dirs = [
    path.join(program.directory, teamPath, 'members')
  ]

  debug({
    'function': 'required-directories',
    'parameters': [dirs]
  })

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      debug({
        'function': 'mkdirp',
        'parameters': [dir]
      })
      mkdirp.sync(dir)
    }
  })
}

exports.onCreateNode = async ({
    node,
    actions,
    getNode,
    createNodeId
  },
  themeOptions
) => {
  const {
    createNode,
    createParentChildLink
  } = actions
  const {
    teamPath
  } = withDefaults(themeOptions)

  if (node.internal.type !== `Mdx`) {
    return
  }

  const fileNode = getNode(node.parent)
  const source = fileNode.sourceInstanceName

  debug({
    'function': 'createNode',
    'parameters': [{
      'source': source
    }]
  });

  if (node.internal.type === `Mdx` && source === "Member") {
    const filePath = createFilePath({
      node: fileNode,
      getNode,
      basePath: contentPath,
    })

    slug = urlResolve(`${teamPath}/members`, filePath);

    slug = slug.replace(/\/*$/, `/`)
    const fieldData = {
      name: node.frontmatter.name,
      email: node.frontmatter.email
    }

    const mdxMember = createNodeId(`${node.id} >>> MdxMember`)
    await createNode({
      ...fieldData,
      id: mdxMember,
      parent: node.id,
      children: [],
      internal: {
        type: `MdxMember`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Mdx implementation of the Member interface`,
      },
    })

    createParentChildLink({
      parent: node,
      child: getNode(mdxMember)
    })
  }
}
