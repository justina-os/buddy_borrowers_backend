import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function Login() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    // NEW: controls OTP verification screen
    const [otpStep, setOtpStep] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // NEW: stores OTP entered by user
    const [otp, setOtp] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            // ---------------- LOGIN ----------------

            if (isLogin) {

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

            // ---------------- SIGNUP ----------------

            else {

                await axios.post(
                    `${BASE_URL}/signup`,
                    {
                        user_name: username,
                        email,
                        password
                    }
                );

                // Backend has sent OTP.
                // Do NOT switch to login yet.
                setOtpStep(true);
            }

        }

        catch (err) {

            if (err.response) {

                setError(
                    err.response.data.detail ||
                    "Something went wrong."
                );

            } else {

                setError("Server not reachable.");

            }

        }

        finally {

            setLoading(false);

        }

    };


    // ---------------- OTP VERIFICATION ----------------

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await axios.post(
                `${BASE_URL}/verify_signup`,
                null,
                {
                    params: {
                        mail_id: email,
                        code: otp
                    }
                }
            );

            alert("Account created successfully!");

            // Return user to login
            setOtpStep(false);
            setIsLogin(true);

            setUsername("");
            setPassword("");
            setOtp("");

        }

        catch (err) {

            if (err.response) {

                setError(
                    err.response.data.detail ||
                    "OTP verification failed."
                );

            } else {

                setError("Server not reachable.");

            }

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="container">

            <div className="card">

                <h1>
                    Buddy Borrowers
                </h1>

                <p className="subtitle">
                    Borrow. Lend. Connect.
                </p>


                {/* NORMAL LOGIN / SIGNUP SCREEN */}

                {!otpStep && (

                    <>

                        <div className="toggle">

                            <button
                                type="button"
                                className={isLogin ? "active" : ""}
                                onClick={() => {

                                    setIsLogin(true);
                                    setError("");

                                }}
                            >
                                Login
                            </button>


                            <button
                                type="button"
                                className={!isLogin ? "active" : ""}
                                onClick={() => {

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
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />

                            )}


                            <input
                                type="email"
                                placeholder="Kalvium Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />


                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
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
                                        : "Send OTP"
                                }

                            </button>

                        </form>

                    </>

                )}


                {/* OTP SCREEN */}

                {otpStep && (

                    <form onSubmit={handleVerifyOtp}>

                        <p className="subtitle">
                            We sent a verification code to
                            <br />
                            <strong>{email}</strong>
                        </p>


                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value)
                            }
                            maxLength={6}
                            required
                        />


                        <button
                            className="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }

                        </button>


                        <button
                            type="button"
                            onClick={() => {

                                setOtpStep(false);
                                setOtp("");
                                setError("");

                            }}
                        >
                            Back
                        </button>

                    </form>

                )}


                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}


                {!otpStep && (

                    <p className="community-note">
                        Only @kalvium.community accounts are supported.
                    </p>

                )}

            </div>

        </div>

    );

}

export default Login;