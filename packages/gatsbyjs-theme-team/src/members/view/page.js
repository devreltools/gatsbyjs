import React from "react";

export default props => {
  const member = props.data.member;
  return (
    <>
      <h1>{member.name}</h1>
      <h2>{member.email}</h2>
      <ul>
        {member.handles.github ? <li>GitHub: {member.handles.github}</li> : ""}
        {member.handles.gitlab ? <li>GitLab: {member.handles.gitlab}</li> : ""}
        {member.handles.slack ? <li>Slack: {member.handles.slack}</li> : ""}
        {member.handles.twitter ? (
          <li>Twitter: {member.handles.twitter}</li>
        ) : (
          ""
        )}
      </ul>
    </>
  );
};
