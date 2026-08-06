import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";



import buddyHero from "../assets/buddy-hero.png";

import {
    House,
    Package,
    Brain,
    Inbox,
    ClipboardList,
    Heart,
    User,
    Settings,
    Search,
    Bell,
    MessageCircle,
    Plus,Lightbulb
} from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000"

function Home() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [resources,setResources] = useState([]);
    const [myResourceCount, setMyResourceCount] = useState(0);
    const [myRequestCount, setMyRequestCount] = useState(0);
    const [search,setSearch] = useState("");
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [showAddResource,setShowAddResource] = useState(false);
    const [viewMode,setViewMode] = useState("none");
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [chats, setChats] = useState([]);
    // Add Resource form

    const [resourceName,setResourceName] = useState("");

    const [resourceDescription,setResourceDescription] = useState("");

    const [price,setPrice] = useState("");

    const [category,setCategory] = useState("Object");


    const [myRequests, setMyRequests] = useState([]);


    // TODO:
    // Later connect this to a user/profile endpoint

    const [user, setUser] = useState({
    user_name: "Student"
});

    // Used for authenticated endpoints

    const authConfig = {

        headers:{

            Authorization:`Bearer ${token}`

        }

    };

    useEffect(() => {

    const fetchMyResourceCount = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/resources/my_resources`,
                authConfig
            );

            setMyResourceCount(response.data.length);

        } catch (err) {

            console.error("Could not load resource count:", err);

        }

    };

    fetchMyResourceCount();

                    }, []);


    useEffect(() => {

    const fetchMyRequestCount = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/requests/my_requests`,
                authConfig
            );

            setMyRequestCount(response.data.length);

        } catch (err) {

            console.error("Could not load request count:", err);

        }

    };

    fetchMyRequestCount();

}, []);

    useEffect(() => {

    const fetchUser = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/me`,
                authConfig
            );

            setUser(response.data);

        } catch (err) {

            console.error("Could not fetch user:", err);

        }

    };

    fetchUser();

}, []);


    // =========================
    // SEARCH RESOURCE
    //
    // GET /resources
    // =========================

    const handleSearch = async(e)=>{

        e.preventDefault();

        if(!search.trim()){
            return;
        }

        try{

            setLoading(true);

            setError("");


            const response = await axios.get(

                `${BASE_URL}/resources`,

                {

                    params:{

                        item:search

                    }

                    // Search endpoint currently
                    // does not require authentication

                }

            );


            setResources(response.data);
            setViewMode("none");

        }

        catch(err){

            console.error(err);

            setError("Could not search resources.");

        }

        finally{

            setLoading(false);

        }

    };


    // =========================
    // MY RESOURCES
    //
    // GET /resources/my_resources
    // JWT REQUIRED
    // =========================

    const handleMyResources = async()=>{
         console.log("BROWSER TOKEN:", token);  

        try{

            setLoading(true);

            setError("");


            const response = await axios.get(

                `${BASE_URL}/resources/my_resources`,

                authConfig

            );
            setResources(response.data);
            setMyResourceCount(response.data.length);
            setViewMode("my-resources");

        }

        catch(err){

            console.error(err);


            if(
                err.response &&
                err.response.status === 401
            ){

                localStorage.removeItem("token");

                navigate("/");

                return;

            }


            setError("Could not load your resources.");

        }

        finally{

            setLoading(false);

        }

    };
    const handleChats = async () => {

    try {
        setLoading(true);
        setError("");

        const response = await axios.get(
            `${BASE_URL}/chats`,
            authConfig
        );

        console.log("CHATS:", response.data);

        setChats(response.data);
        setViewMode("chats");

    } catch (err) {
        console.error("CHAT LIST ERROR:", err);

        setError(
            err.response?.data?.detail ||
            "Could not load chats."
        );

    } finally {
        setLoading(false);
    }
};
    const handleReturnResource = async (resourceId, requestId) => {

    try {
        setError("");

        await axios.patch(
            `${BASE_URL}/resource/${resourceId}/${requestId}/return`,
            {},
            authConfig
        );

        // Remove it from active chats
        setChats((previousChats) =>
            previousChats.filter(
                (chat) => chat.request_id !== requestId
            )
        );

    } catch (err) {

        console.error(
            "RETURN RESOURCE ERROR:",
            err.response?.data
        );

        setError(
            err.response?.data?.detail ||
            "Could not return resource."
        );
    }
};

    const handleMyRequests = async () => {

    console.log("MY REQUESTS BUTTON CLICKED");

    try {

        setLoading(true);
        setError("");

        const response = await axios.get(
            `${BASE_URL}/requests/my_requests`,
            authConfig
        );

        console.log("MY REQUESTS RESPONSE:", response.data);

        setMyRequests(response.data);
        setViewMode("my-requests");

    } catch (err) {

        console.error("MY REQUESTS ERROR:", err);

    } finally {

        setLoading(false);

    }
};
    


    // =========================
    // ADD RESOURCE
    //
    // POST /resources
    // JWT REQUIRED
    // =========================

    const handleIncomingRequests = async () => {

    try {

        setLoading(true);
        setError("");

        const response = await axios.get(
            `${BASE_URL}/requests`,
            authConfig
        );

        console.log("INCOMING REQUESTS:", response.data);

        setIncomingRequests(response.data);
        setViewMode("incoming-requests");

    } catch (err) {

        console.error("INCOMING REQUEST ERROR:", err);

        setError("Could not load incoming requests.");

    } finally {

        setLoading(false);

    }

            };


    const handleAcceptRequest = async (resourceId, requestId) => {

    try {

        setError("");

        await axios.patch(
            `${BASE_URL}/resource/${resourceId}/${requestId}`,
            {},
            authConfig
        );

        // Update UI immediately after successful acceptance
        setIncomingRequests((previousRequests) =>
            previousRequests.map((request) =>
                request.request_id === requestId
                    ? { ...request, status: "accepted" }
                    : request
            )
        );

    } catch (err) {
    console.error("ACCEPT REQUEST ERROR:", err.response?.data);

    setError(
        err.response?.data?.detail ||
        "Could not accept request."
    );
}
};


const handleRejectRequest = async (resourceId, requestId) => {

    try {

        setError("");

        // DUMMY ENDPOINT FOR NOW
        await axios.patch(
            `${BASE_URL}/requests/${requestId}/reject`,
            {},
            authConfig
        );

        setIncomingRequests((previousRequests) =>
            previousRequests.map((request) =>
                request.request_id === requestId
                    ? { ...request, status: "rejected" }
                    : request
            )
        );

    } catch (err) {

        console.error("REJECT REQUEST ERROR:", err);

        setError("Could not reject request.");

    }

};

    const handleAddResource = async(e)=>{

        e.preventDefault();

        try{

            setError("");


            await axios.post(

                `${BASE_URL}/resources`,

                {

                    resource_name:resourceName,

                    resource_description:resourceDescription,

                    price:price,

                    status:"available",

                    category:category

                },

                authConfig

            );


            alert("Resource added successfully!");


            setResourceName("");

            setResourceDescription("");

            setPrice("");

            setCategory("Object");


            setShowAddResource(false);


            // Refresh My Resources after adding

            handleMyResources();

        }

        catch(err){

            console.error(err);


            if(err.response){

                setError(
                    err.response.data.detail ||
                    "Could not add resource."
                );

            }

            else{

                setError("Server not reachable.");

            }

        }

    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = ()=>{

        localStorage.removeItem("token");

        navigate("/");

    };


    return(

        <div className="home-container">


            {/* =========================
                SIDEBAR
            ========================== */}


            <aside className="sidebar">


                <div className="logo">


                    <div className="logo-icon">

                        BB

                    </div>


                    <div>

                        <h2>Buddy</h2>

                        <h2>Borrowers</h2>

                    </div>


                </div>



                <nav>

    <button className="nav-link selected">
        <House size={18} />
        <span>Home</span>
    </button>

    {/* TODO: Later give endpoint */}
    {/* <button className="nav-link">
        <Package size={18} />
        <span>Browse Items</span>
    </button> */}

    {/* TODO: Later give endpoint */}
    {/* <button className="nav-link">
        <Brain size={18} />
        <span>Browse Skills</span>
    </button> */}

    <button
        className="nav-link"
        onClick={handleMyRequests}
    >
        <Inbox size={18} />
        <span>My Requests</span>
    </button>

    <button
        className="nav-link"
        onClick={handleMyResources}
    >
        <ClipboardList size={18} />
        <span>My Resources</span>
    </button>

    <button
        className="nav-link"
        onClick={handleIncomingRequests}
    >
        <MessageCircle size={18} />
        <span>View Requests</span>
    </button>

    {/* <button className="nav-link">
        <Heart size={18} />
        <span>Favourites</span>
    </button>

    <button className="nav-link">
        <User size={18} />
        <span>Profile</span>
    </button> */}

    <button
        className="nav-link"
        onClick={handleChats}
    >
        <MessageCircle size={18} />
        <span>Accepted requests</span>
    </button>

    {/* <button className="nav-link">
        <Settings size={18} />
        <span>Settings</span>
    </button> */}

</nav>



                <div className="share-box">


                    <h3>

                        Share something useful today!

                    </h3>


                    <p>

                        List an item or skill and help
                        someone on campus.

                    </p>


                    <button
                        className="share-button"
                        onClick={()=>setShowAddResource(true)}
                    >

                        + Add Resource

                    </button>


                </div>


            </aside>



            {/* =========================
                MAIN
            ========================== */}


            <main className="main-content">



                {/* =========================
                    TOP BAR
                ========================== */}


                <header className="topbar">

    {/* SEARCH */}
    <form
        className="search-box"
        onSubmit={handleSearch}
    >
        <Search
            size={19}
            className="search-icon"
        />

        <input
            type="text"
            placeholder="Search items or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    </form>


    <div className="top-actions">

        {/* Notifications */}
        <button className="icon-button">
            <Bell size={19} />
        </button>

        {/* Messages */}
        <button className="icon-button" onClick={handleChats}>
            <MessageCircle size={19} />
        </button>




                        <div className="mini-profile">


                            <div className="avatar">

                                {user.user_name[0]}

                            </div>


                            <span>

                                Hi, {user.user_name}

                            </span>


                        </div>



                        <button
                            className="logout"
                            onClick={handleLogout}
                        >

                            Logout

                        </button>


                    </div>


                </header>



                {/* =========================
                    HERO
                ========================== */}


                <section className="hero">

    <div className="hero-content">

        <h1>
            Welcome back, {user.user_name}!
        </h1>

        <p>
            Borrow. Lend. Share skills. Build connections.
        </p>

        <div className="stats">

            <div className="stat-card">
                <span>Your Resources</span>

                <strong>
                    {myResourceCount}
                </strong>

                <small>
                    View your listings
                </small>
            </div>


            <div className="stat-card">
                <span>Requests</span>

                <strong>{myRequestCount}</strong>

                <small>
                    Yet to connect
                </small>
            </div>

        </div>

    </div>


    <div className="hero-art">
        <img
            src={buddyHero}
            alt="Students sharing resources"
        />
    </div>

</section>



                {/* =========================
                    ADD RESOURCE BUTTON
                ========================== */}


                <div className="add-row">


                    <button
                        className="add-button"
                        onClick={()=>setShowAddResource(true)}
                    >

                        + Add Resource

                    </button>


                </div>



                {/* =========================
                    ADD RESOURCE FORM
                ========================== */}


                {showAddResource && (


                    <div className="add-resource-panel">


                        <div className="add-resource-header">


                            <div>

                                <h2>

                                    Add Resource

                                </h2>


                                <p>

                                    Add an object or share a skill.

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={()=>setShowAddResource(false)}
                            >

                                ✕

                            </button>


                        </div>



                        <form
                            className="resource-form"
                            onSubmit={handleAddResource}
                        >


                            <input
                                type="text"
                                placeholder="Resource name"
                                value={resourceName}
                                onChange={
                                    (e)=>setResourceName(e.target.value)
                                }
                                required
                            />



                            <textarea
                                placeholder="Description"
                                value={resourceDescription}
                                onChange={
                                    (e)=>setResourceDescription(e.target.value)
                                }
                                required
                            />



                            <input
                                type="text"
                                placeholder="Price"
                                value={price}
                                onChange={
                                    (e)=>setPrice(e.target.value)
                                }
                                required
                            />



                            <select
                                value={category}
                                onChange={
                                    (e)=>setCategory(e.target.value)
                                }
                            >


                                <option value="Object">

                                    Object

                                </option>


                                <option value="Skill">

                                    Skill

                                </option>


                            </select>



                            <button
                                type="submit"
                                className="add-button"
                            >

                                Add Resource

                            </button>


                        </form>


                    </div>


                )}



                {/* =========================
                    RESOURCE RESULTS
                ========================== */}


                <section className="explore">


                    <div className="explore-heading">


                        <h2>

                            Resources

                        </h2>


                        <p>

                            Search for resources or view
                            your own listings.

                        </p>


                    </div>



                    {/* These remain visual for now */}

                    <div className="filters">


                        <div className="filter-buttons">


                            <button className="filter-active">

                                All

                            </button>


                            {/* TODO:
                                Waiting for browse-item behaviour
                            */}

                            <button>

                                Items

                            </button>


                            {/* TODO:
                                Waiting for browse-skill behaviour
                            */}

                            <button>

                                Skills

                            </button>


                        </div>



                        <div className="future-filters">


                            {/* TODO V3 */}

                            <select defaultValue="all">


                                <option value="all">

                                    All Categories

                                </option>


                            </select>



                            {/* TODO V3 */}

                            <select defaultValue="newest">


                                <option value="newest">

                                    Sort by: Newest

                                </option>


                            </select>


                        </div>


                    </div>



                    {error && (


                        <p className="home-error">

                            {error}

                        </p>


                    )}



                    {loading ? (

    <p className="loading">
        Loading...
    </p>

) : (

    <>
        {/* =========================
            MY REQUESTS
        ========================== */}

       {viewMode === "chats" ? (

    <div className="resource-grid">

        {chats.length > 0 ? (

            chats.map((chat) => (

                <article
                    className="resource-card"
                    key={chat.request_id}
                >

                    <div className="resource-image">
                        <span><MessageCircle size={17}/></span>
                    </div>

                    <div className="resource-details">

                        <h3>
                            {chat.resource_name}
                        </h3>

                        <p className="description">
                            {chat.resource_description || "No description"}
                        </p>

                        <p>
                            <strong>Status: </strong>
                            {chat.request_status}
                        </p>

                        <div className="chat-actions">

    <button
        className="chat-button"
        onClick={() =>
            navigate(`/chat/${chat.request_id}`)
        }
    >
        <MessageCircle size={17} />
        Open Chat
    </button>

    <button
        className="return-button"
        onClick={() =>
            handleReturnResource(
                chat.resource_id,
                chat.request_id
            )
        }
    >
        ↩ Returned
    </button>

</div>

                    </div>

                </article>

            ))

        ) : (

            <div className="no-resources">
                <h3>No chats yet</h3>
                <p>Accepted requests will appear here.</p>
            </div>

        )}

    </div>

) : viewMode === "incoming-requests" ? (

    <div className="resource-grid">

        {incomingRequests.length > 0 ? (

            incomingRequests.map((request, index) => (

                <article
                    className="resource-card"
                    key={index}
                >

                    <div className="resource-image">
    <Inbox size={55} strokeWidth={1} className="resource-icon" />
</div>

                    <div className="resource-details">

    <h3>
        {request.resource_name}
    </h3>

    <p className="description">
        {request.resource_description || "No description"}
    </p>


   <div className="card-actions">

    {request.request_status === "requested" && (
        <>
            <button
                className="accept-button"
                onClick={() =>
                    handleAcceptRequest(
                        request.resource_id,
                        request.request_id
                    )
                }
            >
                Accept
            </button>

            <button
                className="reject-button"
                onClick={() =>
                    handleRejectRequest(
                        request.request_id
                    )
                }
            >
                Reject
            </button>
        </>
    )}

    {(request.request_status === "requested" ||
      request.request_status === "accepted") && (
        <button
            className="chat-button"
            onClick={() =>
                navigate(`/chat/${request.request_id}`)
            }
        >
            Chat
        </button>
    )}

</div>
</div>

                </article>

            ))

        ) : (

            <div className="no-resources">
                <h3>No incoming requests</h3>
                <p>Nobody has requested your resources yet.</p>
            </div>

        )}

    </div>

        ) : viewMode === "my-requests" ? (

            <div className="resource-grid">

                {myRequests.length > 0 ? (

                    myRequests.map((request, index) => (

                        <article
                            className="resource-card"
                            key={index}
                        >

                            <div className="resource-image">

                                <span><Inbox size={55} strokeWidth={1}/></span>

                            </div>

                            <div className="resource-details">

                                <h3>
                                    {request.resource_name}
                                </h3>

                                <p className="description">
                                    {request.resource_description || "No description"}
                                </p>

                                <p>
                                    <strong>Offer: </strong>
                                    {request.offers}
                                </p>

                                <p>
                                    <strong>Status: </strong>
                                    {request.status}
                                </p>

                                {request.status !== "rejected" &&
 request.status !== "returned" && (

    <button
        className="chat-button"
        onClick={() =>
            navigate(`/chat/${request.request_id}`)
        }
    >
        <MessageCircle size={17}/>
        Chat
    </button>

)}

                            </div>

                        </article>

                    ))

                ) : (

                    <div className="no-resources">
                        <h3>No requests yet</h3>
                        <p>You haven't requested any resources.</p>
                    </div>

                )}

            </div>

        ) : (

            /* =========================
                NORMAL / MY RESOURCES
            ========================== */

            <div className="resource-grid">

                {resources.map((resource) => (

                    <article
                        className={`resource-card ${
                            viewMode === "my-resources"
                                ? "clickable-resource"
                                : ""
                        }`}
                        key={resource.resource_id}
                        onClick={() => {

                            if (viewMode === "my-resources") {

                                navigate(
                                    `/my-resources/${resource.resource_id}`,
                                    {
                                        state: { resource }
                                    }
                                );

                            } else {

                                navigate(
                                    `/resources/${resource.resource_id}`,
                                    {
                                        state: { resource }
                                    }
                                );

                            }

                        }}
                    >
<div className="resource-image">

    {resource.category === "Skill" ? (
        <Lightbulb size={52} strokeWidth={1} />
    ) : (
        <Package size={52} strokeWidth={1} />
    )}

    <button className="heart">
        ♡
    </button>

    <span className="category-badge">
        {resource.category}
    </span>

</div>

                        <div className="resource-details">

                            <h3>
                                {resource.resource_name}
                            </h3>

                            <p className="description">
                                {resource.resource_description}
                            </p>

                            <p className="price">
                                {resource.price}
                            </p>

                            <div className="owner-row">

                                <span>
                                    👤 Campus Member
                                </span>

                                <span>
                                    ⭐ --
                                </span>

                            </div>

                        </div>

                    </article>

                ))}


                {resources.length === 0 && (

                    <div className="no-resources">

                        <h3>
                            Find something to borrow
                        </h3>

                        <p>
                            Use the search bar above, or open My Resources
                            to see your listings.
                        </p>

                    </div>

                )}

            </div>

        )}

    </>

)}


                </section>


            </main>


        </div>

    );

}

export default Home;