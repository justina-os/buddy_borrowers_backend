import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function Home() {
    return <h1>Welcome Home</h1>;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}

export default App;