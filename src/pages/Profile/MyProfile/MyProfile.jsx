import React, { useState, useEffect } from 'react';
import showMessage from '../../../utils/Message';
import ApiClient from '../../../service/apiclient/AxiosClient';
import { clearSession, getEmail } from '../../../service/jwt/JwtService';
import './MyProfile.css';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    status: '',
    roles: [],
  });

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email=getEmail();
        const response = await ApiClient.get('/user/email/'+email);
        const data = response.data.data;
        setProfile({
          fullName: data?.name,
          email: data?.email,
          phoneNumber: data?.phoneNumber,
          status: data?.status,
          roles: data?.roles,
            
        });
      } catch (error) {
        if (error?.response) {
          switch (error.response.status) {
            case 401:
              showMessage.error(`Unauthorized: Please logout and clean your user token.`);
              clearSession(error?.response?.data?.error?.message);              break;
            case 400:
              showMessage.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              showMessage.error(`Not Found: The requested resource could not be found.`);
              break;
            case 500:
              showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            default:
              showMessage.error('Failed to fetch profile data. Please try again.');
              showMessage.error(error.response.data.error.message);
              break;
          }
        } else {
          showMessage.error('Failed to fetch profile data. Please try again.');
          showMessage.error(error.message);
        }
      }
    };

  
    fetchUserData();
  }, [token]); 

  return (
<main className="main-content">
  <div className="position-relative custom-page">
    <h1 className="title">Welcome {profile.fullName}</h1>
    <div className="user-info-container">
      <div className="user-info">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
        <p><strong>Status:</strong> {profile.status}</p>
        <p><strong>Roles:</strong> {profile.roles.join(', ')}</p>
      </div>
    </div>
  </div>
</main>
  );
};

export default MyProfile;
