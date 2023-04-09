import React from "react";
import "./pagination.css";
import Pagination from "react-bootstrap/Pagination";

const Paginations = ({ currentPage, total, makeRequest }) => {
  let items = [];
  for (let number = 1; number <= total; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={(number) => makeRequest(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <div>
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default Paginations;
