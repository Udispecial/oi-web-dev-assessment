import React, { useEffect, useState } from "react";
import "./Tags.css";
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

const Tags = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [show, setShow] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const getTags = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.getTag();
      setTags(data);
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    getTags();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteForm = async (id) => {
    alert("Are you sure you want to delete this tag?");
    setIsProcessing(true);
    const { data } = await api.deleteTag(id);
    setIsProcessing(false);
    setSuccessMessage(data.message);
    setShowAlert(true);
    getTags();
  };
  const [formData, setFormData] = useState(initialState);
  const editForm = (id) => {
    setCurrentId(id);
    const editData = tags.filter((item) => item._id === id);
    setFormData({ ...formData, name: editData[0].name });
    setShow(true);
  };
  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      if (currentId) {
        const { data } = await api.updateTag(currentId, formData);
        setSuccessMessage(data.message);
        setShowAlert(true);
        getTags();
        setIsProcessing(false);
      } else {
        const { data } = await api.createTag(formData);
        setSuccessMessage(data.message);
        setShowAlert(true);
        getTags();
        setIsProcessing(false);
      }
      handleClose();
    } catch (error) {
      setIsProcessing(false);
      console.log(error);
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
                  <th>Tag Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tags ? (
                  tags.map((item, index) => (
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
                    <td colspan={3}>No Tags to show</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{currentId ? "Edit Tag" : "Create Tag"}</Modal.Title>
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

export default Tags;
