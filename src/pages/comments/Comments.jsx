import React, { useState, useEffect } from "react";
import "./Comments.css";
import * as api from "../../api/index.js";
import Table from "react-bootstrap/Table";
import { FcApprove } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { Alerts } from "../../components";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

const Comments = () => {
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getComments = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.getComments();
      setComments(data);
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  const deleteForm = async (id) => {
    alert("Are you sure you want to delete this comment?");
    setIsProcessing(true);
    const { data } = await api.deleteComment(id);
    setSuccessMessage(data.message);
    setShowAlert(true);
    getComments();
    setIsProcessing(false);
  };

  const approveComment = async (id) => {
    alert("Are you sure you want to approve this comment?");
    setIsProcessing(true);
    const { data } = await api.updateComments(id);
    setSuccessMessage(data.message);
    setShowAlert(true);
    getComments();
    setIsProcessing(false);
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

          <div className="table_wrapper">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Commentor Name</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {comments ? (
                  comments.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.comment}</td>
                      <td>{item.approved === 0 ? "Unapproved" : "Approved"}</td>
                      <td className="icons_container">
                        <FcApprove
                          className="icons icon_approve"
                          onClick={() => approveComment(item._id)}
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
                    <td colspan={3}>No Comments to show</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </>
      </div>
    </Container>
  );
};

export default Comments;
