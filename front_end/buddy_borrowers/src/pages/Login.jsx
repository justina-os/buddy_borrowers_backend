import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const BASE_URL = "http://127.0.0.1:8000";

function Login() {

    const navigate = useNavigate();

    const [isLogin,setIsLogin] = useState(true);

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState("");

    const handleSubmit = async(e)=>{

        e.preventDefault();

        setError("");

        try{

            if(isLogin){

                const response = await axios.post(
                    `${BASE_URL}/login`,
                    {
                        email,
                        password
                    }
                );

                localStorage.setItem(
                    "token",
                    response.data.access_token
                );

                navigate("/home");

            }

            else{

                await axios.post(
                    `${BASE_URL}/signup`,
                    {
                        username,
                        email,
                        password
                    }
                );

                alert("Account created successfully!");

                setIsLogin(true);

            }

        }

        catch(err){

            if(err.response){

                setError(err.response.data.detail);

            }

            else{

                setError("Server not reachable.");

            }

        }

    }

    return(

        <div className="container">

            <div className="card">

                <h1>Buddy Borrowers</h1>

                <p className="subtitle">
                    Borrow. Lend. Connect.
                </p>

                <div className="toggle">

                    <button
                    className={isLogin ? "active":""}
                    onClick={()=>setIsLogin(true)}
                    >

                        Login

                    </button>

                    <button
                    className={!isLogin ? "active":""}
                    onClick={()=>setIsLogin(false)}
                    >

                        Sign Up

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {!isLogin && (

                        <input
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        />

                    )}

                    <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                    />

                    <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                    />

                    <button className="submit">

                        {isLogin ? "Login":"Create Account"}

                    </button>

                </form>

                {error &&

                <p className="error">

                    {error}

                </p>

                }

            </div>

        </div>

    )

}

export default Login;