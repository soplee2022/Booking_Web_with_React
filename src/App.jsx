import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Home } from "./pages/Home";
import { Rooms } from "./pages/Rooms"
import singleRoom from "./images/room1/singleRoom.jpeg";
import Dialog from "./container/Dialog";

function App() {
  const [count, setCount] = useState(0);
  const imgAry = [singleRoom];
  console.log(imgAry);
  return (
    <>
      {/* <Home></Home>
      <Rooms></Rooms> */}
      <Dialog/>
    </>


<<<<<<< Updated upstream
=======
    // <Rooms></Rooms>

    <Dialog/>
>>>>>>> Stashed changes
  );
}

export default App;
