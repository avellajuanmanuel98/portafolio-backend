import { useEffect, useState } from "react";
import "./Profile.css";
import { API_BASE_URL } from "../config";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return null;

  return (
    <section className="profile-section">
      <div className="section-container">
        <div className="profile-card">
          {profile.avatar && (
            <img
              src={`${API_BASE_URL}/uploads/${profile.avatar}`}
              alt="Avatar"
              className="profile-avatar"
            />
          )}
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-links">
            {profile.links?.instagram && (
              <a
                href={profile.links.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
            {profile.links?.linkedin && (
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {profile.links?.email && (
              <a href={`mailto:${profile.links.email}`}>Email</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
