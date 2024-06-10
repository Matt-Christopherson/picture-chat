import React from "react";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../utils/queries";

const PostContainer = () => {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section
      id="posted-images"
      className="scroll-container"
      style={{ marginTop: "20px" }}
    >
      {data.posts.map((post, index) => (
        <div class="post-div" key={index} style={{ marginBottom: "10px" }}>
          <img
            src={post.postImage}
            alt={`Post ${index + 1}`}
            style={{ maxWidth: "100%" }}
          />
          <p id="created-by">Created by: {post.user}</p>
        </div>
      ))}
    </section>
  );
};

export default PostContainer;
