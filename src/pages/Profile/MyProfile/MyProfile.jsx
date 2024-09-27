import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import ApiClient from '../../../service/apiclient/AxiosClient';
import { clearSession, getEmail } from '../../../service/jwt/JwtService';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    fullName: ''
  });

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email=getEmail();
        const response = await ApiClient.get('/user/email/'+email);
        const data = response.data.data;
        setProfile({
          fullName: data.name
        });
      } catch (error) {
        if (error?.response) {
          switch (error.response.status) {
            case 401:
              message.error(`Unauthorized: Please logout and clean your user token.`);
             clearSession();
              break;
            case 400:
              message.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              message.error(`Not Found: The requested resource could not be found.`);
              break;
            case 500:
              message.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            default:
              message.error('Failed to fetch profile data. Please try again.');
              message.error(error.response.data.error.message);
              break;
          }
        } else {
          message.error('Failed to fetch profile data. Please try again.');
          message.error(error.message);
        }
      }
    };

  
    fetchUserData();
  }, [token]); 

  return (
    <main className="main-content">
      <div className="position-relative custom-page">
        <h1 className="title">Welcome {profile.fullName}</h1>
      </div>
    </main>
  );
};

export default MyProfile;
