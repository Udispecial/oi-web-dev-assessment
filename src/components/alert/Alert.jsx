import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "./alert.css";

const Alerts = ({ showAlert, success, error }) => {
  const [show, setShow] = useState(showAlert);
  return (
    <>
      {show && (
        <Alert
          variant={success ? "success" : "danger"}
          onClose={() => setShow(false)}
          dismissible
        >
          <Alert.Heading>{success ? "Success!!" : "Error!!"}</Alert.Heading>
          <p>{success ? success : error}</p>
        </Alert>
      )}
      {/* {show && (
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Success!</Alert.Heading>
          <p>{success}</p>
        </Alert>
      )} */}
    </>
  );
};

export default Alerts;
