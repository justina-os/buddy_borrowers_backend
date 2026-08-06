import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ManageResource.css";
import {
    House,
    Package,
    Brain,
    Inbox,
    Pencil,
    Heart,
    Lock,
    Trash2,
    Settings,
    CheckCircle,
    Bell,
    MessageCircle,
    Plus,Lightbulb
} from "lucide-react";


const BASE_URL = import.meta.env.VITE_API_URL;

function ManageResource() {

    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    const authConfig = {
    headers: {
        Authorization: `Bearer ${token}`
    }};

    const resource = location.state?.resource;

    const handleDelete = async () => {

    const confirmed = window.confirm(
        `Are you sure you want to delete "${resource.resource_name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {

        await axios.delete(
            `${BASE_URL}/resources/${resource.resource_id}`,
            authConfig
        );

        alert("Resource deleted successfully.");

        navigate("/home");

    } catch (err) {

        console.error("DELETE RESOURCE ERROR:", err);

        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
        }

        alert(
            err.response?.data?.detail ||
            "Could not delete resource."
        );
    }
};

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
    {resource.category === "Skill" ? (
        <Lightbulb size={72} strokeWidth={1.5} />
    ) : (
        <Package size={72} strokeWidth={1.5} />
    )}
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
        navigate(`/my-resources/${resource.resource_id}/edit`, {
            state: { resource }
        })
    }
>
    <Pencil size={18} />
    Edit Resource
</button>

<div className={`resource-status-action ${resource.status}`}>
    {resource.status === "rented" ? (
        <>
            <Lock size={18} />
            Currently Rented
        </>
    ) : (
        <>
            <CheckCircle size={18} />
            Available
        </>
    )}
</div>

<button className="delete-button" onClick={handleDelete}>
    <Trash2 size={18} />
    Delete Resource
</button>
</div>

            </div>

        </div>
    );
}

export default ManageResource;