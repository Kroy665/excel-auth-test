
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Routes/Register'
import Login from './Routes/Login'
import Dashboard from './Routes/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
