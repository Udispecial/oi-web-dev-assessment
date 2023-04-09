import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import * as api from "../../api/index.js";
import Modal from "react-bootstrap/Modal";
import { Post, Paginations, Alerts } from "../../components";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { InputField } from "../../components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  const initialState = {
    description: "",
    title: "",
    category: "",
    tags: "",
  };
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getPosts = async (search, currentPage) => {
    setIsProcessing(true);
    try {
      const { data } = await api.getPost(search, currentPage);
      setPosts(data.data);
      setCurrentPage(data.currentPage);
      setTotal(data.total);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts(search, currentPage);
    const getCategories = async () => {
      try {
        const { data } = await api.getCategory();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    const getTags = async () => {
      try {
        const { data } = await api.getTag();
        setTags(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
    getTags();
  }, [search]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      if (currentId) {
        const { data } = await api.updatePost(currentId, formData);
        setFormData(initialState);
        setCurrentId(null);
        setSuccessMessage(data.message);
        setShowAlert(true);
        getPosts(search, currentPage);
        setIsProcessing(false);
      } else {
        const { data } = await api.createPost(formData);
        setSuccessMessage(data.message);
        setShowAlert(true);
        setFormData(initialState);
        getPosts(search, currentPage);
        setIsProcessing(false);
      }

      handleClose();
    } catch (error) {
      setShowAlert(true);
      setErrorMessage(error);
      setIsProcessing(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const prepareImage = (file) => {
    const reader = (readFile) =>
      new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(readFile);
      });

    reader(file).then((result) => {
      setFormData({ ...formData, photo: result });
    });
  };
  const deleteForm = async (id) => {
    alert("Are you sure you want to delete this post?");
    const { data } = await api.deletePost(id);
    getPosts(search, currentPage);
    setSuccessMessage(data.message);
    setShowAlert(true);
  };
  const comment = (id) => {
    navigate(`/all_posts/${id}`);
  };

  const editForm = (id) => {
    setCurrentId(id);
    const editData = posts.filter((item) => item._id === id);
    setFormData({
      ...editData[0],
      category: editData[0].categories[0]._id,
      tags: editData[0].tags[0]._id,
    });
    setShow(true);
  };
  const makeRequest = (page) => {
    setCurrentPage(page.target.innerHTML);
    getPosts(search, page.target.innerHTML);
  };
  return (
    <Container>
      <>
        {isProcessing && <Spinner animation="border" />}
        <Alerts
          key={`${successMessage}-${errorMessage}`}
          showAlert={showAlert}
          success={successMessage}
          error={errorMessage}
        />
        <div className="button_container">
          <input
            type="text"
            placeholder="search title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {user && (
            <Button variant="primary" onClick={handleShow}>
              Create Post
            </Button>
          )}
        </div>
        <Container>
          <Row>
            {posts.map((item) => (
              <Col sm={4}>
                <Post
                  item={item}
                  comment={comment}
                  destroy={deleteForm}
                  edit={editForm}
                />
              </Col>
            ))}
          </Row>
          <Paginations
            currentPage={currentPage}
            total={total}
            makeRequest={(page) => {
              makeRequest(page);
            }}
          />
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{currentId ? "Edit Post" : "Create Post"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <InputField
                name="title"
                label="Title"
                controlId="formBasicTitle"
                type="text"
                value={formData.title}
                handleChange={handleChange}
              />

              <InputField
                name="description"
                label="Description"
                controlId="formBasicDescription"
                as="textarea"
                row={3}
                value={formData.description}
                handleChange={handleChange}
              />
              <InputField
                name="category"
                label="Category"
                controlId="formBasicCategory"
                select
                options={categories.map((item) => ({
                  name: item.name,
                  value: item._id,
                }))}
                value={formData.category}
                handleChange={handleChange}
              />
              <InputField
                name="tags"
                label="Tags"
                controlId="formBasicTags"
                select
                value={formData.tags}
                options={tags.map((item) => ({
                  name: item.name,
                  value: item._id,
                }))}
                handleChange={handleChange}
              />
              <Form.Group className="mb-3" controlId="formBasicImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  name="image"
                  type="file"
                  onChange={(e) => prepareImage(e.target.files[0])}
                  accept="image/*"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {isProcessing ? (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    </Container>
  );
};

export default Dashboard;
