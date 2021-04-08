import * as React from "react";
import Header from "./header/Header";
import Content from "./body/Content";

// test auth
import Signup from "./auth/Signup";
import {Container} from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

//import { Counter } from '../redux_sample/Counter';

function App() {
  return (
    <div className="flex flex-col w-screen h-screen">
      {/* <Counter /> */}
      <Container
    className="d-flex align-items-center justify-content-center"
    style= {{minHeight: "100vh"}}>
      <div className="w-100" style={{ maxWidth: "500px"}}>
        <Signup/>

      </div>

    </Container>

      {/* <Header />
      <Content /> */}
    </div>
  );
}

export default App;
