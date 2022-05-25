import { useEffect, useState } from "react";
import styled from "styled-components";

const Reservations = ({ reservation }) => {
  const [reservations, setReservations] = useState("");
  useEffect(() => {
    if (reservation) {
      const _id = reservation._id;
      fetch(`/api/get-reservations/${_id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setReservations(data.data);
        })
        .catch((error) => {})
        .finally(() => {});
    }
  }, [reservation]);

  return (
    <Wrapper>
      {reservations
        ? reservations.map((res) => {
            return (
              <ConfirmationDiv>
                <p>Reservation #: {res._id}</p>
                <p>Flight #: {res.flight}</p>
                <p>Seat #: {res.seat}</p>
                <p>
                  Name #: {res.givenName} {res.surname}
                </p>
                <p>Email #: {res.email}</p>
              </ConfirmationDiv>
            );
          })
        : null}
    </Wrapper>
  );
};

export default Reservations;

const Wrapper = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 2;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ConfirmationDiv = styled.div`
  border: 2px solid var(--color-alabama-crimson);
  padding: 20px;
  margin-bottom: 30px;
`;
