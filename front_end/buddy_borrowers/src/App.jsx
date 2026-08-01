import { Routes,Route,Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ManageResource from "./pages/ManageResource";
import ResourceDetails from "./pages/ResourceDetails";
import Chat from "./pages/Chat";
function App(){

    return(

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/home"
                element={<Home />}
            />

            <Route
                path="*"
                element={<Navigate to="/" />}
            />

            <Route
                    path="/my-resources/:resource_id"
                    element={<ManageResource />}
                />

            <Route
                path="/resources/:resourceId"
                element={<ResourceDetails />}
                />

            <Route
                path="/chat/:requestId"
                element={<Chat />}
                />

        </Routes>

    );

}

export default App;