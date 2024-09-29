import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import showMessage from '../../../utils/Message';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Modal, Form, Input, Select } from 'antd';
import "./Login.css";
import ApiClient from "../../../service/apiclient/AxiosClient";
import { clearSession } from "../../../service/jwt/JwtService";
const { Option } = Select;
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!userName.trim() || !password.trim()) {
        setError("Please enter your email and password.");
        return;
      }
      if(password.length < 6){
        setError("Password must be at least 6 characters long.");
        return;
      }
    

      const response = await ApiClient.post(`/auth/login`, {
        email: userName.trim(),
        password: password.trim()
      });
      const token = response.data.data.token;
      localStorage.setItem("userToken", token);
      navigate("/profile");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      if (error?.response) {
        switch (error.response.status) {
          case 401:
            setError(`Unauthorized: Please logout and clean your user token.`);
            clearSession();
            break;
          case 400:
            setError(`Bad Request: ${error.response.data.error.message}`);
            break;
          case 500:
            setError(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
            break;
          case 404:
            setError(`Not Found: ${error.response.data.error.message}.`);
            break;
          case 412:
            setError(`Precondition Failed: ${error.response.data.error.message}`);
            break;
          default:
            setError(`Failed to login user. Please try again.`);
            setError(error.response.data.error.message);
            break;
        }
      } else {
        setError(`Failed to login user. Please try again.`);
        setError(error.message);
      }
      if (err?.response) {
        setError(err.response.data.error.message);
      } else {
        setError(err?.message);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!!token)
      navigate("/profile");
  }, []);

  useEffect(() => {
    const errorMessage = localStorage.getItem("errorMessages");
    if (errorMessage) {
      setError(errorMessage);
    }
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleOk = () => {

    form
      .validateFields()
      .then(async values => {


        let data = JSON.stringify({
          name: values.name?.trim(),
          email: values.email?.trim(),
          phoneNumber: values.phoneNumber?.trim(),
          password: values.password?.trim()
        });

        await ApiClient.post('/member/register', data)
          .then((response) => {
            console.log('Response:', JSON.stringify(response.data));

            if (response.data.status === true) {
              showMessage.success('Account created successfully!');
              form.resetFields();
              setIsModalVisible(false);
            }
            else {
              showMessage.error(response.data.error.message);
            }

          })
          .catch((error) => {
            if (error?.response) {
              switch (error.response.status) {
                case 401:
                  showMessage.error(`Unauthorized: Please logout and clean your user token.`);
                  clearSession();
                  break;
                case 400:
                  showMessage.error(`Bad Request: ${error.response.data.error.message}`);
                  break;
                case 500:
                  showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
                  break;
                case 404:
                  showMessage.error(`Not Found: The requested resource could not be found.`);
                  break;
                case 412:
                  showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
                  break;
                default:
                  showMessage.error('Failed to create account. Please try again.');
                  showMessage.error(error.response.data.error.message);
                  break;
              }
            } else {
              showMessage.error('Failed to create account. Please try again.');
              showMessage.error(error.message);
            }
          });
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("errorMessages");
  });




  return (
    <div className="login-background">

      <div className="overlay"></div>
      <div className="wrapper">
        <section className="vh-100 bg-image">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-lg-6 col-md-8 mt-5 log-cont">
                <div className="logo-account">
                  <button id="primary-btn" className="right" onClick={showModal}>Register</button>
                </div>
                <div className="card bg-dark">
                  <div className="card-body">
                    <div className="auth-form">
                      <h2 className="text-center mb-4">Login your account</h2>
                      <form onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          <label htmlFor="floatingInput">Email</label>
                        </div>
                        <div className="form-floating mb-2 position-relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="Password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label htmlFor="Password">Password</label>
                          <button
                            type="button"
                            className="btn btn-link position-absolute"
                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                          </button>
                        </div>
                        <div className="text-center mt-3">
                          <button type="submit" className="btn btn-primary" id="primary-btn">
                            Sign In
                          </button>
                        </div>
                        {error && (
                          <div className="text-center mt-3 text-danger">
                            {error}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal
        title="Create New Account"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
        onOk={handleOk} // Submit form and send data via axios
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
          >
            <PhoneInput
                country={'in'}
                onChange={(phone) => form.setFieldsValue({ phoneNumber: phone })} // Update form value
              />

          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter the password' },
              { min: 6, message: 'Password must be at least 6 characters long' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm the password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
