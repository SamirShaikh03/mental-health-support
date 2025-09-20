import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/user/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("Unable to load user details."));
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {error && (
        <p className="profile-error">{error}</p>
      )}
      {!user && !error && (
        <p className="profile-loading">Loading user details...</p>
      )}
      {user && (
        <div className="profile-card">
          {/* Updated avatar image tag to use initials-based avatar */}
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0077b6&color=fff&size=100`}
            alt={user.name ? `${user.name}'s Avatar` : "User Avatar"}
            className="profile-avatar"
            onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=User&background=0077b6&color=fff&size=100"; }}
          />
          <div className="profile-details">
            <p>
              <strong>Name:</strong> <span>{user.name}</span>
            </p>
            <p>
              <strong>Email:</strong> <span>{user.email}</span>
            </p>
            <p>
              <strong>Age:</strong> <span>{user.age}</span>
            </p>
            <p>
              <strong>Location:</strong> <span>{user.location}</span>
            </p>
            <p>
              <strong>College:</strong> <span>{user.college}</span>
            </p>
            <p>
              <strong>Joined:</strong> <span>{user.joined || user.joinDate}</span>
            </p>
            <p>
              <strong>Status:</strong> <span>{user.status}</span>
            </p>
            <p>
              <strong>Bio:</strong> <span>{user.bio}</span>
            </p>
            <p>
              <strong>Interests:</strong> <span>{user.interests && user.interests.join(", ")}</span>
            </p>
          </div>
        </div>
      )}
      <style>{`
        .profile-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 1rem;
          box-sizing: border-box;
          width: 100%;
        }
        .profile-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .profile-error {
          color: red;
          text-align: center;
        }
        .profile-loading {
          text-align: center;
        }
        .profile-card {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-details {
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.75rem 1rem;
          text-align: left;
          margin-left:35px;
        
        }
        .profile-details p {
          margin: 0;
          display: contents; /* Allows p to be part of the grid */
        }
        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
        }
        @media (max-width: 600px) {
          .profile-container {
            padding: 0.5rem;
          }
          .profile-title {
            font-size: 1.5rem;
          }
          .profile-card {
            padding: 0.5rem;
          }
          .profile-avatar {
            width: 70px;
            height: 70px;
          }
        }
      `}</style>
    </div>
  );
}
