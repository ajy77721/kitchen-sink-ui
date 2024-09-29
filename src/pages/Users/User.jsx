import React, { useEffect, useState } from 'react';
import './User.css';
import { Modal, Button, Form, Input, Select, Checkbox } from 'antd';
import showMessage from '../../utils/Message';
import DataTable from '../../components/Table/Table';
import ApiClient from '../../service/apiclient/AxiosClient';
import { clearSession, getEmail, isAdminRole, isVisitorRole } from '../../service/jwt/JwtService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
const { Option } = Select;
//

const UserDashboard = () => {

  const [data, setData] = useState([]);
  const [dataWithoutSearch, setDataWithoutSearch] = useState([]);

  //  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const currentEmail = getEmail();
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const onStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  // Function to fetch user data from API
  const fetchUserData = async () => {
    // setIsLoading(true);  // Show loading state
    try {
      const response = await ApiClient.get('/user');
      console.log('API Response:', response);
      if (response.status === 200 && response.data) {
        const users = response.data.data || []
        setData(users);
        setDataWithoutSearch(users);
        // Ensure data is an array
      } else {
        console.error('Unexpected API response:', response);
        showMessage.error('Failed to load user data');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            showMessage.error('Unauthorized: Please logout and clean your user token.');
            clearSession();
            break;
          case 403:
            //  setIsLoading(true);
            showMessage.error(error.response.data.error.message);
            break;
          case 400:
            showMessage.error('Bad Request: ' + error.response.data.error.message);
            break;
          case 404:
            showMessage.error('Not Found: The user data could not be found.');
            break;
          case 500:
            showMessage.error('Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.');
            break;
          default:
            showMessage.error('Error fetching user data: ' + error.response.data.error.message);
            break;
        }
      } else {
        showMessage.error('Error fetching user data. Please try again.');
      }
    } finally {
      // setIsLoading(false);  // Hide loading state
    }
  };
  // Show the modal for adding new user
  const showModal = () => {
    if (!isAdminRole()) {
      showMessage.error('You do not have permission to access this functionality. Please contact the Administrator.');
    } else {
      setIsModalVisible(true);
    }
  };

  // Handle modal close action
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleResetPassword = async (resetDto) => {
    try {
      await ApiClient.post('/user/reset-password', resetDto)
        .then((response) => {
          if (response.data.status) {
            showMessage.success('Password reset successfully');
            fetchUserData();
          } else {
            showMessage.error('Failed to reset password');
            showMessage.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                showMessage.error(`Unauthorized: Please logout and clean your user token.`);
                clearSession();
                break;
              case 400:
                showMessage.error(`Bad Request: ${error.response.data.error.message}`);
                break;
              case 404:
                showMessage.error(`Not Found: The requested resource could not be found.`);
                break;
              case 500:
                showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
                break;
              case 412: // Precondition Failed
                showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
                break;
              default:
                showMessage.error('Failed to reset password. Please try again.');
                showMessage.error(error.response.data.error.message);
                break;
            }
          } else {
            showMessage.error('Failed to reset password. Please try again.');
            showMessage.error(error.message);
          }

        });
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            showMessage.error(`Unauthorized: Please logout and clean your user token.`);
            clearSession();
            break;
          case 400:
            showMessage.error(`Bad Request: ${error.response.data.error.message}`);
            break;
          case 404:
            showMessage.error(`Not Found: The requested resource could not be found.`);
            break;
          case 500:
            showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
            break;
          case 412: // Precondition Failed
            showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
            break;
          default:
            showMessage.error('Failed to reset password. Please try again.');
            showMessage.error(error.response.data.error.message);
            break;
        }
      } else if (error.request) {
        showMessage.error('Failed to reset password. Please try again.');
        showMessage.error(error.message);
      } else {
        showMessage.error('Failed to reset password. Please try again.');
      }
    }
    fetchUserData();
    form.resetFields();
  }
  const handleBlock = async (row) => {

    try {
      await ApiClient.post('/user/' + row.id + '/status/ACTIVE')
        .then((response) => {
          console.log('Response:', JSON.stringify(response.data));
          if (response.data.status === true) {
            showMessage.success(`User ${row.email} active successfully!`);
            fetchUserData();
          }
          else {
            showMessage.error(response.data.error.message);
          }
        }).catch((error) => {
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
                showMessage.error(`Not Found: ${error.response.data.error.message}.`);
                break;
              case 412:
                showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
                break;
              default:
                showMessage.error(`Failed to activate user ${row.email}. Please try again.`);
                showMessage.error(error.response.data.error.message);
                break;
            }
          } else {
            showMessage.error(`Failed to activate user ${row.email}. Please try again.`);
            showMessage.error(error.message);
          }

        });

    } catch (error) {
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
            showMessage.error(`Not Found: ${error.response.data.error.message}.`);
            break;
          case 412:
            showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
            break;
          default:
            showMessage.error(`Failed to activate user ${row.email}. Please try again.`);
            showMessage.error(error.response.data.error.message);
            break;
        }
      } else if (error.request) {
        showMessage.error(`Failed to activate user ${row.email}. Please try again.`);
        showMessage.error(error.message);
      } else {

        showMessage.error(`Failed to active user  ${row.email}. Please try again.`);
      }
    }
    console.log('active')
  }
  const handleActivate = async (row) => {

    try {
      await ApiClient.post('/user/' + row.id + '/status/BLOCKED')
        .then((response) => {
          console.log('Response:', JSON.stringify(response.data));
          if (response.data.status === true) {
            showMessage.success(`User ${row.email} blocked successfully!`);
            fetchUserData();
          }
          else {
            showMessage.error(response.data.error.message);
          }
        }).catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 401:
                showMessage.error(`Unauthorized: Please logout and clean your user token.`);
                clearSession();
                break;
              case 400:
                showMessage.error(`Bad Request: ${error.response.data.error.message}`);
                break;
              case 404:
                showMessage.error(`Not Found: The user could not be found.`);
                break;
              case 500:
                showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
                break;
              case 412: // Precondition Failed
                showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
                break;
              default:
                showMessage.error(`Failed to block user ${row.email}. Please try again.`);
                showMessage.error(error.response.data.error.message);
                break;
            }
          } else {
            showMessage.error(`Failed to block user ${row.email}. Please try again.`);
            showMessage.error(error.message);
          }

        });

    } catch (error) {
      if (error?.response) {
        switch (error.response.status) {
          case 401:
            showMessage.error(`Unauthorized: Please logout and clean your user token.`);
            clearSession();
            break;
          case 400:
            showMessage.error(`Bad Request: ${error.response.data.error.message}`);
            break;
          case 404:
            showMessage.error(`Not Found: The user could not be found.`);
            break;
          case 500:
            showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
            break;
          case 412: // Precondition Failed
            showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
            break;
          default:
            showMessage.error(`Failed to block user ${row.email}. Please try again.`);
            showMessage.error(error.response.data.error.message);
            break;
        }
      } else if(error.request){
        showMessage.error(`Failed to block user ${row.email}. Please try again.`);
        showMessage.error(error.message);
      }else{
      showMessage.error(`Failed to blocked user  ${row.email}. Please try again.`);}
    }
  }

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const inputData = await form.validateFields();
      console.log('Form Values:', inputData);
      const addUserDTO = {
        email: inputData.email,
        name: inputData.name,
        password: inputData.password,
        phoneNumber: inputData.phoneNumber,
        status: inputData.status,
        roles: parseRoles(inputData.roles),
      }
      // Here you can add your API call to submit the form data
      try {
        await ApiClient.post('/user', addUserDTO).then((response) => {
          if (response?.data?.status) {
            form.resetFields();
            setSelectedStatus(null);
            setIsModalVisible(false);
            showMessage.success('User added successfully!');

            // Refresh the user list after adding a new user
            fetchUserData();
          } else {
            showMessage.error('Failed to add user');
            showMessage.error(response.data.data.error);
          }
        }).catch((error) => {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                showMessage.error(`Unauthorized: Please logout and clean your user token.`);
                clearSession();
                break;
              case 400:
                showMessage.error(`Bad Request: ${error.response.data.error.message}`);
                break;
              case 404:
                showMessage.error(`Not Found: The specified resource could not be found.`);
                break;
              case 500:
                showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
                break;
              case 412: // Precondition Failed
                showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
                break;
              default:
                showMessage.error('Failed to add user. Please try again.');
                showMessage.error(error.response.data.error.message);
                break;
            }
          } else {
            console.error('Failed to add user:', error);
            showMessage.error('Failed to add user. Please try again.');
          }

        });
      } catch (error) {
        console.error('Failed to add user:', error);
        showMessage.error('Failed to add user');
        showMessage.error(error.message);
      }
    } catch (error) {
      console.log('Validation Failed:', error);
      showMessage.error('Form submission failed');
    }
  };


  const parseRoles = (input) => {
    const allowedRoles = ["VISITOR", "ADMIN", "USER"];
    if (!input) {
      showMessage.error('No data to save,Plese close the modal and try again');
      return;
    }
    const rolesArray = String(input).split(","); // Split by spaces or commas

    // Capitalize and trim the roles
    const validRoles = rolesArray
      .map((role) => role.toUpperCase().trim())
      .filter((role) => allowedRoles.includes(role));

    // Find any invalid roles
    const invalidRoles = rolesArray
      .map((role) => role.toUpperCase().trim())
      .filter((role) => !allowedRoles.includes(role));

    // If there are any invalid roles, show an error message
    if (invalidRoles.length > 0) {
      showMessage.error(
        `Only "VISITOR", "ADMIN", "USER" are valid user roles. Invalid roles found: ${invalidRoles.join(
          ", "
        )}`
      );
    }

    return validRoles;
  };
  const handleEditAPI = async (editData, editOldData) => {
    if (!editData) {
      showMessage.error('No data to save,Plese close the modal and try again');
      return;
    }
    if (editData.email !== editOldData.email && editOldData.email === currentEmail) { //check if email is changed and not same as the logged in user email
      showMessage.error('Email cannot be changed');
      return;
    }
    const reqData = {
      id: editData.id,
      email: editData.email,
      name: editData.name,
      password: editData.password,
      phoneNumber: editData.phoneNumber,
      roles: parseRoles(editData.roles),
    }
    try{

    await ApiClient.put('/user', reqData)
      .then((response) => {
        if (response.data.status) {
          showMessage.success('User updated successfully');
        } else {
          showMessage.error('Failed to update user');
          showMessage.error(response.data.data.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              showMessage.error(`Unauthorized: Please logout and clean your user token.`);
              clearSession();
              break;
            case 400:
              showMessage.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              showMessage.error(`Not Found: The specified user could not be found.`);
              break;
            case 500:
              showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            case 412: // Precondition Failed
              showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
              break;
            default:
              showMessage.error('Failed to update user. Please try again.');
              showMessage.error(error.response.data.error.message);
              break;
          }
        } else {
          console.error('Failed to update user:', error);
          showMessage.error('Failed to update user. Please try again.');
        }
      });}catch(error){
        if (error.response) {
          switch (error.response.status) {
            case 401:
              showMessage.error(`Unauthorized: Please logout and clean your user token.`);
              clearSession();
              break;
            case 400:
              showMessage.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              showMessage.error(`Not Found: The specified user could not be found.`);
              break;
            case 500:
              showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            case 412: // Precondition Failed
              showMessage.error(`Precondition Failed: ${error.response.data.error.message}`);
              break;
            default:
              showMessage.error('Failed to update user. Please try again.');
              showMessage.error(error.response.data.error.message);
              break;
          }
        } else {
          console.error('Failed to update user:', error);
          showMessage.error('Failed to update user. Please try again.');
        }
      }
    fetchUserData();

  }


  const handleDeleteAPI = async (row) => {
try{
    await ApiClient.delete('/user/' + row.id)
      .then((response) => {
        if (response.data.status) {
          showMessage.success('User delete successfully');
        } else {
          showMessage.error('Failed to delete user');
          showMessage.error(response.data.data.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              showMessage.error(`Unauthorized: Please logout and clean your user token.`);
              clearSession();
              break;
            case 400:
              showMessage.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              showMessage.error(`Not Found: The specified user could not be found.`);
              break;
            case 500:
              showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            default:
              showMessage.error('Failed to delete user. Please try again.');
              showMessage.error(error.response.data.error.message);
              break;
          }
        } else {
          console.error('Failed to delete user:', error);
          showMessage.error('Failed to delete user. Please try again.');
        }

      });}catch(error){
        if (error.response) {
          switch (error.response.status) {
            case 401:
              showMessage.error(`Unauthorized: Please logout and clean your user token.`);
              clearSession();
              break;
            case 400:
              showMessage.error(`Bad Request: ${error.response.data.error.message}`);
              break;
            case 404:
              showMessage.error(`Not Found: The specified user could not be found.`);
              break;
            case 500:
              showMessage.error(`Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.`);
              break;
            default:
              showMessage.error('Failed to delete user. Please try again.');
              showMessage.error(error.response.data.error.message);
              break;
          }
        } else {
          console.error('Failed to delete user:', error);
          showMessage.error('Failed to delete user. Please try again.');
        }
      }
    fetchUserData();

  }


  const [searchTerm, setSearchTerm] = useState();
  const searchColumns = ['email', 'name', 'phoneNumber', 'status', 'roles'];
  const handleSearch = (e) => {
    const value = e.target.value;
    console.log('Search:', value);
    setSearchTerm(value);

    const filteredData = dataWithoutSearch.filter(item =>
      searchColumns.some(key =>
        item[key]?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );

    setData(filteredData);
  };



  return (
    <>
      <main className="main-content">
        <h2>Dashboard</h2>

        {/* Add New User Button */}
        {<Button type="primary" id="primary-btn" onClick={showModal}>
          Add New User
        </Button>}

        {/* search Button  className="search-container"*/}
        <Input
          id="primary-btn"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginLeft: '700px', width: '12%', marginBottom: '10px' }}
          allowClear
        />

        {/* Display loading message when fetching data */}
        {isVisitorRole() ? (
          <div>
            <p className="position-relative custom-page">
              You do not have permission to access this functionality. Please contact the Administrator.
            </p>
          </div>
        ) : (
          <DataTable heading="List of all users" data={data} onEdit={handleEditAPI}
            onDelete={handleDeleteAPI} restrictedItem={['status', 'lastModifiedBy']}
            onBlock={handleBlock} onActive={handleActivate}
            onResetPasswordUser={handleResetPassword} />
        )}
        { /* add User   */}
        <Modal
          title="Add New User"
          visible={isModalVisible}
          onCancel={handleCancel}
          okText="Submit"
          cancelText="Cancel"
          onOk={handleFormSubmit}  // Form submission handler
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


            <Form.Item
              label="Roles"
              name="roles"
              rules={[{ required: true, message: 'Please select at least one role' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select roles"
              >
                <Option value="ADMIN">Admin</Option>
                <Option value="USER">User</Option>
                <Option value="VISITOR">Visitor</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Please select a status',
                },
              ]}
            >
              <div>
                <Checkbox
                  value="ACTIVE"
                  checked={selectedStatus === 'ACTIVE'}
                  onChange={onStatusChange}
                >
                  ACTIVE
                </Checkbox>
                <Checkbox
                  value="BLOCKED"
                  checked={selectedStatus === 'BLOCKED'}
                  onChange={onStatusChange}
                >
                  BLOCKED
                </Checkbox>
              </div>
            </Form.Item>

          </Form>
        </Modal>
      </main >
    </>
  );
};

export default UserDashboard;
