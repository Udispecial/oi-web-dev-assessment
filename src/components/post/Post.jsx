import React from "react";
import "./Post.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";

const Post = ({ item, comment, edit, destroy }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  return (
    <Card style={{ width: "18rem", marginBottom: "1rem" }}>
      <Card.Img
        variant="top"
        src={item.photo}
        height="150px"
        style={{ objectFit: "cover" }}
      />
      <Card.Body className="card__body">
        <p>
          {item.categories[0].name} <span>#{item.tags[0].name}</span>
        </p>
        <Card.Title as="h2">{item.title}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
      {user && (
        <div className="icon_container">
          <FaRegComment className="icons" onClick={() => comment(item._id)} />
          <AiFillEdit className="icons" onClick={() => edit(item._id)} />
          <MdDelete
            className="icons icon_delete"
            onClick={() => destroy(item._id)}
          />
        </div>
      )}
    </Card>
    // </div>
  );
};

export default Post;
