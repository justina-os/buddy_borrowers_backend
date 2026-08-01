import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";


const BASE_URL = "http://127.0.0.1:8000";


function Login(){

    const navigate = useNavigate();


    const [isLogin,setIsLogin] = useState(true);

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);


    const handleSubmit = async(e)=>{

        e.preventDefault();

        setError("");
        setLoading(true);


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
                        user_name:username,
                        email,
                        password
                    }
                );


                alert("Account created successfully!");


                setIsLogin(true);

                setUsername("");
                setPassword("");

            }

        }

        catch(err){

            if(err.response){

                setError(
                    err.response.data.detail ||
                    "Something went wrong."
                );

            }

            else{

                setError(
                    "Server not reachable."
                );

            }

        }

        finally{

            setLoading(false);

        }

    };


    return(

        <div className="container">

            <div className="card">


                <h1>
                    Buddy Borrowers
                </h1>


                <p className="subtitle">
                    Borrow. Lend. Connect.
                </p>



                <div className="toggle">


                    <button
                        type="button"
                        className={isLogin ? "active":""}
                        onClick={()=>{

                            setIsLogin(true);
                            setError("");

                        }}
                    >

                        Login

                    </button>


                    <button
                        type="button"
                        className={!isLogin ? "active":""}
                        onClick={()=>{

                            setIsLogin(false);
                            setError("");

                        }}
                    >

                        Sign Up

                    </button>


                </div>



                <form onSubmit={handleSubmit}>


                    {!isLogin && (

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            required
                        />

                    )}



                    <input
                        type="email"
                        placeholder="Kalvium Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />



                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />



                    <button
                        className="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"
                        }

                    </button>


                </form>



                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                <p className="community-note">

                    Only @kalvium.community accounts are supported.

                </p>


            </div>

        </div>

    );

}

export default Login;