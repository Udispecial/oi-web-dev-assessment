import React, { useState } from "react";
import "./Auth.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { InputField } from "../../components";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decoded from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/index.js";

const initialState = { name: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        const { data } = await api.signup(formData);
        localStorage.setItem("profile", JSON.stringify(data));
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await api.login(formData);
        localStorage.setItem("profile", JSON.stringify(data));
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const switchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  const googleSuccess = (res) => {
    const decoded = jwt_decoded(res.credential);
    const result = decoded;
    const token = res.credential;
    const data = { result, token };
    localStorage.setItem("profile", JSON.stringify(data));
    navigate("/dashboard");
  };

  return (
    <div className="auth">
      <div className="auth_container">
        <h5 className="text-primary text-center text-5">
          {isSignUp ? "Register" : "Login"}
        </h5>
        <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <InputField
              name="name"
              label="Name"
              controlId="formBasicName"
              type="text"
              handleChange={handleChange}
            />
          )}
          <InputField
            name="email"
            label="Email Address"
            controlId="formBasicEmail"
            type="text"
            handleChange={handleChange}
          />
          <InputField
            name="password"
            label="Password"
            controlId="formBasicPassword"
            type="password"
            handleChange={handleChange}
          />
          {isSignUp && (
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              controlId="formBasicConfirmPassword"
              type="password"
              handleChange={handleChange}
            />
          )}

          <Button variant="primary" type="submit">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <div>
            <p onClick={switchMode} className="switch__mode">
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </p>
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={() => alert("Google sign un was unsuccessful")}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
