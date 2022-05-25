import styled from "styled-components";
import { useState,useEffect } from "react";
import tombstone from "../assets/tombstone.png";


const Confirmation = ({reservation}) => {

  return (
    <>
      {reservation ? (
        <Wrapper>
          <ConfirmationDiv>
            <p
              style={{
                color: "var(--color-alabama-crimson)",
                textAlign: "center",
                borderBottom: "1px solid var(--color-alabama-crimson)",
                marginBottom: "8px",
                fontSize: "20px",
              }}
            >
              Your flight is confirmed!
            </p>
            <p>Reservation #: {reservation._id}</p>
            <p>Flight #: {reservation.flight}</p>
            <p>Seat #: {reservation.seat}</p>
            <p>
              Name #: {reservation.givenName} {reservation.surname}
            </p>
            <p>Email #: {reservation.email}</p>
          </ConfirmationDiv>
          <img src={tombstone} />
        </Wrapper>
      ) : <h2 style={{marginTop:"50px"}}>You have not any reservation!</h2>}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 600px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 2;
  img {
    width: 180px;
    height: 180px;
  }
`;
const ConfirmationDiv = styled.div`
  border: 2px solid var(--color-alabama-crimson);
  padding: 20px;
  margin-bottom: 30px;
`;
export default Confirmation;
