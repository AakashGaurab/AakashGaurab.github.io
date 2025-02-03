import React from "react";
import styled from "styled-components";

const Switch = ({ showDropDown, handleShowDropDown }) => {
  const burgerClick = () => {
    handleShowDropDown(!showDropDown);
  };
  return (
    <StyledWrapper>
      <div className="container">
        <input
          className="label-check"
          id="label-check"
          type="checkbox"
          onClick={burgerClick}
        />
        <label htmlFor="label-check" className="hamburger-label">
          <div className="line1" />
          <div className="line2" />
          <div className="line3" />
          <label />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .label-check {
    display: none;
  }

  .hamburger-label {
    width: 40px; /* Reduced from 70px */
    height: 23px; /* Reduced from 58px */
    display: flex;
    cursor: pointer;
    position: relative;
  }

  .hamburger-label div {
    width: 30px; /* Reduced from 70px */
    height: 4px; /* Reduced from 6px */
    background-color: #fff;
    position: absolute;
  }

  .line1 {
    transition: all 0.3s;
  }

  .line2 {
    margin: 8px 0 0 0; /* Adjusted spacing */
    transition: 0.3s;
  }

  .line3 {
    margin: 16px 0 0 0; /* Adjusted spacing */
    transition: 0.3s;
  }

  #label-check:checked + .hamburger-label .line1 {
    transform: rotate(-28deg) scaleX(0.6) translate(-20px, -2px); /* Rotate and move to the right */
    border-radius: 50px 50px 50px 0;
  }

  #label-check:checked + .hamburger-label .line3 {
    transform: rotate(28deg) scaleX(0.6) translate(-20px, 2px); /* Rotate and move to the right */
    border-radius: 0 50px 50px 50px;
  }

  #label-check:checked + .hamburger-label .line2 {
    border-top-left-radius: 50px; /* Changed to match the new direction */
    border-bottom-left-radius: 50px; /* Changed to match the new direction */
    width: 25px; /* Keep the width consistent */
    transform: translateX(0.5px); /* Shift slightly to the left for alignment */
  }
`;

export default Switch;
