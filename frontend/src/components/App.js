import styled from "styled-components";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import GlobalStyles from "./GlobalStyles";
import { useState,useEffect } from "react";
import Reservations from "./Reservations";

const App = () => {
  const [reservation, setReservation] = useState("");
  useEffect(() => {
    setReservation(JSON.parse(localStorage.getItem("reservation")));
  }, []);
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header reservation={reservation}/>
      <Main>
        <Switch>
          <Route exact path="/">
            <SeatSelect setReservation={setReservation} />
          </Route>
          <Route exact path="/confirmed">
            <Confirmation reservation={reservation}/>
          </Route>
          <Route path="/view-reservation">
            <Reservations reservation={reservation}/>
          </Route>
        </Switch>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px);
`;

export default App;
