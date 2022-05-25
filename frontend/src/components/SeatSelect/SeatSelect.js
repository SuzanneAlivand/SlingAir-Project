import Plane from "./Plane.js";
import styled from "styled-components";
import { useState } from "react";
import { Redirect } from "react-router-dom";

const SeatSelect = ({ setReservation }) => {
  const [currentFlight, setCurrentFlight] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const change = (e) => {
    console.log(e.target.value);
    setCurrentFlight(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/add-reservation", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        flight: currentFlight,
        seat: selectedSeat,
        givenName,
        surname,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 201) {
          setStatus(201);
          setMessage(data.message);
          setReservation(data.data);
          localStorage.setItem("reservation", JSON.stringify(data.data));
        } else {
          setMessage(data.message);
        }
      });
  };
  return (
    <div>
      <Div>
        <label for="flights">Flight Number :</label>
        <select name="flights" id="flights" onChange={change}>
          <option value="" disabled selected hidden>
            Select a flight
          </option>
          <option value="SA231">SA231</option>
        </select>
      </Div>
      <h2>Select your seat and Provide your information!</h2>
      <PlanDiv>
        <Plane flight={currentFlight} setSelectedSeat={setSelectedSeat} />
        <FormDiv>
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: "center", padding: "8px" }}>
              {selectedSeat ? (
                <p>Selected Seat: {`${selectedSeat}`}</p>
              ) : (
                <p>Selected Seat: none</p>
              )}
            </div>
            <input
              type="text"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Last Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <button type="submit">Confirmation</button>
            {status === 201 ? (
              <Redirect to="/confirmed" />
            ) : (
              <Message>{message ? <p>{message}</p> : null}</Message>
            )}
          </form>
        </FormDiv>
      </PlanDiv>
    </div>
  );
};

export default SeatSelect;

const Div = styled.div`
  background-color: red;
  padding: 15px 18px;
  label {
    margin-right: 20px;
  }
  select {
    padding: 7px;
    outline: none;
    border: none;
  }
`;

const PlanDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 80px;
`;
const FormDiv = styled.div`
  border: 2px solid var(--color-alabama-crimson);
  margin-top: 180px;
  height: 280px;
  width: 350px;
  padding: 20px 20px 30px 20px;
  form {
    flex-direction: column;
    justify-content: center;
  }
  input {
    outline: none;
    font-size: 18px;
    width: 277px;
    margin-bottom: 2px;
  }
  button {
    border-radius: 4px;
    outline: none;
    border: 2px solid var(--color-orange);
    background: #ff4e00;
    width: 100%;
    margin-top: 2px;
    cursor: pointer;
  }
`;
const Message = styled.div`
  text-align: center;
  margin-top: 4px;
`;
