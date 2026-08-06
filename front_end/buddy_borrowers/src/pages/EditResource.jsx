import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditResource.css";

const BASE_URL = "http://127.0.0.1:8000"

function EditResource() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const token = localStorage.getItem("token");

    const passedResource = location.state?.resource;

    const [resourceName, setResourceName] = useState("");
    const [resourceDescription, setResourceDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Object");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // ==========================================
    // LOAD EXISTING RESOURCE
    // ==========================================

    useEffect(() => {
        if (passedResource) {
            setResourceName(passedResource.resource_name || "");
            setResourceDescription(
                passedResource.resource_description || ""
            );
            setPrice(passedResource.price ?? "");
            setCategory(passedResource.category || "Object");

            setLoading(false);
            return;
        }

        // If page is refreshed, location.state disappears.
        // Fetch the resource again from backend.

        const fetchResource = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${BASE_URL}/resources/${id}`,
                    authConfig
                );

                const resource = response.data;

                setResourceName(resource.resource_name || "");
                setResourceDescription(
                    resource.resource_description || ""
                );
                setPrice(resource.price ?? "");
                setCategory(resource.category || "Object");

            } catch (err) {
                console.error("FETCH RESOURCE ERROR:", err);

                setError("Could not load this resource.");
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    // ==========================================
    // EDIT RESOURCE
    // Change endpoint/method here if your
    // FastAPI endpoint is different.
    // ==========================================

    const handleEditResource = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await axios.patch(
                `${BASE_URL}/resource/${id}`,
    {
        resource_name: resourceName,
        resource_description: resourceDescription,
        price: Number(price),
        category: category,
    },
    authConfig );

            alert("Resource updated successfully!");

            navigate(`/my-resources/${id}`);

        } catch (err) {
    console.error("EDIT RESOURCE ERROR:", err);
    console.log("BACKEND RESPONSE:", err.response?.data);

    if (err.response?.status === 422) {
        const detail = err.response.data?.detail;

        if (Array.isArray(detail)) {
            setError(
                detail.map((item) => item.msg).join(", ")
            );
        } else {
            setError("Invalid resource data.");
        }

    } else if (err.response) {

        setError(
            typeof err.response.data?.detail === "string"
                ? err.response.data.detail
                : "Could not update resource."
        );

    } else {
        setError("Server not reachable.");
    }
}
    };

    if (loading) {
        return (
            <div className="edit-page">
                <p className="edit-loading">
                    Loading resource...
                </p>
            </div>
        );
    }

    return (
        <div className="edit-page">

            <button
                className="edit-back"
                onClick={() => navigate(`/my-resources/${id}`)}
            >
                ← Back to Resource
            </button>

            <div className="edit-resource-panel">

                <div className="edit-resource-header">

                    <div>
                        <span className="edit-label">
                            EDIT RESOURCE
                        </span>

                        <h1>Edit Resource</h1>

                        <p>
                            Update your listing information.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="edit-close"
                        onClick={() =>
                            navigate(`/my-resources/${id}`)
                        }
                    >
                        ✕
                    </button>

                </div>

                {error && (
                    <div className="edit-error">
                        {error}
                    </div>
                )}

                <form
                    className="edit-resource-form"
                    onSubmit={handleEditResource}
                >

                    <div className="edit-field">

                        <label>Resource name</label>

                        <input
                            type="text"
                            placeholder="Resource name"
                            value={resourceName}
                            onChange={(e) =>
                                setResourceName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="edit-field">

                        <label>Description</label>

                        <textarea
                            placeholder="Description"
                            value={resourceDescription}
                            onChange={(e) =>
                                setResourceDescription(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="edit-form-row">

                        <div className="edit-field">

                            <label>Price</label>

                            <input
                                type="number"
                                min="0"
                                placeholder="Price"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="edit-field">

                            <label>Type</label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >
                                <option value="Object">
                                    Object
                                </option>

                                <option value="Skill">
                                    Skill
                                </option>
                            </select>

                        </div>

                    </div>

                    <div className="edit-actions">

                        <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={() =>
                                navigate(`/my-resources/${id}`)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-edit-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "✏️ Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditResource;