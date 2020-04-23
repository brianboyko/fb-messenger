import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { StyledPage } from "./styles";
import AboutWork from "./Work";

const VIEWER = gql`
  query {
    viewer {
      id
      username
      fullname
      # bio
      # work
    }
  }
`;

const WORK = gql`
  query Work($userId: ID!) {
    work(userId: $userId) {
      company
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      user {
        id
        fullname
      }
    }
  }
`;

const Profile = () => {
  const [fullname, setFullname] = useState("");
  const { data, loading, error } = useQuery(VIEWER);
  const [mutateUser, updateUserResponse] = useMutation(UPDATE_USER);
  const updateLoading = updateUserResponse.loading;

  const updateUser = (e) => {
    e.preventDefault();
    if (updateLoading) {
      return;
    }
    mutateUser({
      variables: {
        user: {
          fullname,
          id: data.viewer.id,
        },
      },
    });
  };

  if (error) {
    return <h2>{error.message}</h2>;
  } 
  
  if (loading || updateLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <StyledPage>
      <div>
        <h2>Profile</h2>
        <img alt="clone" src="/images/clone.jpg" />
        <form onSubmit={updateUser}>
          <label>
            Fullname
            <input
              onChange={(e) => setFullname(e.target.value)}
              type="text"
              value={fullname || data.viewer.fullname}
            />
          </label>
          <button type="submit">Save</button>
        </form>
        <hr />
        <AboutWork userId={data.viewer.id} />
      </div>
    </StyledPage>
  );
};

export default Profile;
