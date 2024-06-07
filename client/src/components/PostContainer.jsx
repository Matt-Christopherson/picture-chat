import React from "react";

const PostContainer = ({ postList = [] }) => {
  return (
    <section id="posted-images" className="scroll-container" style={{ marginTop: "20px" }}>
      {postList.map((post, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <img src={post} alt={`Post ${index + 1}`} style={{ maxWidth: "100%" }} />
        </div>
      ))}
    </section>
  );
};

export default PostContainer;
