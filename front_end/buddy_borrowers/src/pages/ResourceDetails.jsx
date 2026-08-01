import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResourceDetails.css";

const BASE_URL = "http://127.0.0.1:8000";

function ResourceDetails() {

    const location = useLocation();
    const navigate = useNavigate();

    const resource = location.state?.resource;

    const token = localStorage.getItem("token");

    if (!resource) {
        return (
            <div className="resource-details-page">
                <h2>Resource not found</h2>

                <button onClick={() => navigate("/home")}>
                    Back to Home
                </button>
            </div>
        );
    }

    const handleRequest = async () => {

        const offers = prompt(
            "What would you like to offer? You can enter money, a skill, or a message."
        );

        if (offers === null) {
            return;
        }

        try {

            await axios.post(
                `${BASE_URL}/request/${resource.resource_id}`,
                {
                    offers: offers
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Request sent successfully!");

        } catch (err) {

            console.error(err);

            if (err.response) {
                alert(err.response.data.detail);
            } else {
                alert("Could not connect to server.");
            }

        }
    };


    return (
        <div className="resource-details-page">

            <button
                className="details-back"
                onClick={() => navigate("/home")}
            >
                ← Back to Home
            </button>


            <div className="resource-details-card">

                <div className="details-image">

                    <span>
                        {resource.category === "Skill" ? "🧠" : "📦"}
                    </span>

                </div>


                <span className="details-category">
                    {resource.category}
                </span>


                <h1>
                    {resource.resource_name}
                </h1>


                <p className="details-description">
                    {resource.resource_description || "No description provided."}
                </p>


                <div className="details-info">

                    <div>
                        <span>Price</span>

                        <strong>
                            ₹{resource.price}
                        </strong>
                    </div>


                    <div>
                        <span>Status</span>

                        <strong>
                            {resource.status}
                        </strong>
                    </div>

                </div>


                <button
                    className="request-resource-button"
                    onClick={handleRequest}
                    disabled={resource.status !== "available"}
                >
                    {resource.status === "available"
                        ? "Request Resource"
                        : "Currently Unavailable"}
                </button>

            </div>

        </div>
    );
}

export default ResourceDetails;