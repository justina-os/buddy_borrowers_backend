import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ManageResource.css";

function ManageResource() {

    const location = useLocation();
    const navigate = useNavigate();

    const resource = location.state?.resource;

    if (!resource) {
        return (
            <div className="manage-page">
                <h2>Resource not found</h2>

                <button onClick={() => navigate("/home")}>
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="manage-page">

            <button
                className="back-button"
                onClick={() => navigate("/home")}
            >
                ← Back to Home
            </button>

            <div className="manage-card">

                <div className="resource-icon">
                    {resource.category === "Skill" ? "🧠" : "📦"}
                </div>

                <span className="manage-category">
                    {resource.category}
                </span>

                <h1>{resource.resource_name}</h1>

                <p className="manage-description">
                    {resource.resource_description || "No description"}
                </p>

                <div className="resource-info">

                    <div>
                        <span>Price</span>
                        <strong>₹{resource.price}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>{resource.status}</strong>
                    </div>

                </div>

                <div className="manage-actions">

                    <button
                    className="edit-resource-button"
                    onClick={() =>
                    navigate(
                    `/my-resources/${resource.resource_id}/edit`,
                    {
                        state: { resource }
                     }
                     )
                             }
                    >
                        ✏️ Edit Resource
                    </button>

                    <button className="request-button">
                        📩 View Requests
                    </button>

                    <button className="delete-button">
                        🗑 Delete Resource
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ManageResource;