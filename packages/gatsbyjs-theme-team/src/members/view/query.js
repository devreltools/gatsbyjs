import { graphql } from "gatsby";
import Page from "./page";

export default Page;

export const query = graphql`
  query DevRelToolsTeamMember(
    $id: String!
    $previousId: String
    $nextId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    member(id: { eq: $id }) {
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
    previous: member(id: { eq: $previousId }) {
      id
      name
      slug
    }
    next: member(id: { eq: $nextId }) {
      id
      name
      slug
    }
  }
`;
