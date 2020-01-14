import { graphql } from "gatsby";
import Page from "./page";

export const query = graphql`
  query DevRelToolsTeamMembers {
    site {
      siteMetadata {
        title
      }
    }
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
`;

export default Page;
