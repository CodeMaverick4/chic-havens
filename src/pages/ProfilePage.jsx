import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const auth = useSelector(state => state.auth);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: auth?.email || '',
    phone: auth?.phoneNumber || '',
    address: auth?.address || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth?.displayName) {
      const names = auth.displayName.split(' ');
      setProfileData({
        ...profileData,
        firstName: names[0] || '',
        lastName: names[1] || ''
      });
    }
  }, [auth]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-content">
      <h3 className="mb-4">Profile</h3>

      <div className="profile-section">
        <h5 className="mb-3">Basic Details</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h5 className="mb-3">Contact Details</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h5 className="mb-3">Address</h5>
        <textarea
          className="form-control"
          rows="3"
          name="address"
          value={profileData.address}
          onChange={handleProfileChange}
          disabled={!isEditing}
        ></textarea>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4">
        {isEditing ? (
          <>
            <button className="btn btn-outline-dark" onClick={() => setIsEditing(false)}>
              CANCEL
            </button>
            <button className="btn btn-dark" onClick={handleSaveProfile}>
              SAVE
            </button>
          </>
        ) : (
          <button className="btn btn-dark" onClick={() => setIsEditing(true)}>
            EDIT PROFILE
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
