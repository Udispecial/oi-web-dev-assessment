import React, { useEffect, useState } from "react";
import "./Posts.css";
import * as api from "../../api/index.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { InputField } from "../../components";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Paginations, Alerts } from "../../components";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

const Posts = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
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
    setSuccessMessage(data.message);
    setShowAlert(true);
    getPosts(search, currentPage);
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
      <div>
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
          <div className="table_wrapper">
            <Table striped bordered hover responsive>
              <thead className="table_head">
                <tr>
                  <th>image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Tag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts ? (
                  posts.map((item, index) => (
                    <tr>
                      <td className="img_col">
                        <img src={item.photo} alt="" />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.categories[0].name}</td>
                      <td>{item.tags[0].name}</td>
                      <td className="icons_container">
                        <AiFillEdit
                          className="icons"
                          onClick={() => editForm(item._id)}
                        />{" "}
                        <MdDelete
                          className="icons icon_delete"
                          onClick={() => deleteForm(item._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colspan={3}>No Posts to show</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <Paginations
            currentPage={currentPage}
            total={total}
            makeRequest={(page) => {
              makeRequest(page);
            }}
          />

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {currentId ? "Edit Post" : "Create Post"}
              </Modal.Title>
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
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </div>
    </Container>
  );
};

export default Posts;
