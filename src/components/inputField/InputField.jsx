import React from "react";
import "./InputField.css";
import Form from "react-bootstrap/Form";

const InputField = ({
  name,
  label,
  controlId,
  type,
  handleChange,
  as,
  row,
  select,
  options,
  value,
}) => {
  return (
    <div>
      {" "}
      <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>

        {select ? (
          <Form.Select
            onChange={handleChange}
            name={name}
            required
            value={value}
          >
            <option value="">--select--</option>
            {options.map((item) => (
              <option value={item.value}>{item.name}</option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control
            name={name}
            type={type}
            onChange={handleChange}
            required
            as={as}
            row={row}
            value={value}
          />
        )}
      </Form.Group>
    </div>
  );
};

export default InputField;
