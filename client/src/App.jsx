import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home/index";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="app__body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
