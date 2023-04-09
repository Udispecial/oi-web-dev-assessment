import React, { useState, useEffect } from "react";
import "./postDetails.css";
import { useParams } from "react-router-dom";
import * as api from "../../api/index.js";
import { Alerts } from "../../components";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { InputField } from "../../components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";

const PostDetail = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();

  const initialState = {
    comment: "",
    postId: "",
    name: "",
  };

  const { id } = useParams();
  const [post, setPost] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const getPost = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.getPostById(id);
      setPost(data);
      console.log(data.comments);
      setIsProcessing(false);
    } catch (error) {
      setShowAlert(true);
      setErrorMessage(error);
      setIsProcessing(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getPost();
    setFormData({ ...formData, postId: id, name: user.result.name });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data } = await api.createComment(formData);
      setSuccessMessage(data.message);
      setShowAlert(true);
      setFormData({ ...formData, comment: "" });
      getPost();
      setIsProcessing(false);
      console.log(data);
    } catch (error) {
      //   setShowAlert(true);
      //   setErrorMessage(error.message);
      setIsProcessing(false);
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      {isProcessing && <Spinner animation="border" />}
      <Alerts
        key={`${successMessage}-${errorMessage}`}
        showAlert={showAlert}
        success={successMessage}
        error={errorMessage}
      />
      <Container>
        <div className="upper_row">
          <Row>
            <Col sm={5}>
              <div className="img_container">
                <img src={post.photo} alt="" />
              </div>
            </Col>
            <Col sm={7}>
              <div className="page_details">
                <h5>{post.categories[0].name}</h5>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <span>#{post.tags[0].name}</span>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            {post.comments.map((item) => (
              <Card body>
                {item.comment}
                <br />
                <span className="comment_span">{item.name}</span>
              </Card>
            ))}
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputField
            name="comment"
            // label="Name"
            controlId="formBasicComment"
            as="textarea"
            row={4}
            value={formData.description}
            handleChange={handleChange}
          />
          <Button variant="primary" type="submit">
            Submit Comment
          </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default PostDetail;
