import React, { useEffect, useState } from "react";
import "./Category.css";
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

const initialState = {
  name: "",
};

const Category = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getCategories = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.getCategory();
      setCategories(data);
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const deleteForm = async (id) => {
    alert("Are you sure you want to delete this category?");
    setIsProcessing(true);
    const { data } = await api.deleteCategory(id);
    setSuccessMessage(data.message);
    setShowAlert(true);
    getCategories();
    setIsProcessing(false);
  };

  const editForm = (id) => {
    setCurrentId(id);
    const editData = categories.filter((item) => item._id === id);
    setFormData({ ...formData, name: editData[0].name });
    setShow(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      if (currentId) {
        const { data } = await api.updateCategory(currentId, formData);
        setSuccessMessage(data.message);
        setShowAlert(true);
        setFormData(initialState);
        setCurrentId(null);
        getCategories();
        setIsProcessing(false);
      } else {
        const { data } = await api.createCategory(formData);
        setSuccessMessage(data.message);
        setShowAlert(true);
        setFormData(initialState);
        getCategories();
        setIsProcessing(false);
      }
      handleClose();
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            {user && (
              <Button variant="primary" onClick={handleShow}>
                Create Post
              </Button>
            )}
          </div>
          <div className="table_wrapper">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories ? (
                  categories.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
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
                    <td colspan={3}>No Category to show</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {currentId ? "Edit Category" : "Create Category"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <InputField
                  name="name"
                  label="Name"
                  controlId="formBasicName"
                  type="text"
                  value={formData.name}
                  handleChange={handleChange}
                />
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

export default Category;
