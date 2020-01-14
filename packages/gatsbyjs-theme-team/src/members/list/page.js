import React from "react";

export default props => {
  const members = props.data.allMember.edges;

  const listMembers = members.map(({ node }) => {
    return <li>{node.name}</li>;
  });

  return (
    <>
      <ul>{listMembers}</ul>
    </>
  );
};
