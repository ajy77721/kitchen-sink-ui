import React, { useEffect, useState } from 'react';
import './User.css';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import DataTable from '../../components/Table/Table';
import ApiClient from '../../service/apiclient/AxiosClient';

const { Option } = Select;

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Function to fetch user data from API
  const fetchUserData = async () => {
    setIsLoading(true);  // Show loading state
    try {
      const response = await ApiClient.get('/user/');
      console.log('API Response:', response);
      if (response.status === 200 && response.data) {
        setData(response.data.data || []);  // Ensure data is an array
      } else {
        console.error('Unexpected API response:', response);
        message.error('Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Error fetching user data');
    } finally {
      setIsLoading(false);  // Hide loading state
    }
  };
  // Show the modal for adding new user
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal close action
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form Values:', values);
      
      // Here you can add your API call to submit the form data
      // await ApiClient.post('/user/add', values);

      form.resetFields();
      setIsModalVisible(false);
      message.success('User added successfully!');
      
      // Refresh the user list after adding a new user
      fetchUserData();
    } catch (error) {
      console.log('Validation Failed:', error);
      message.error('Form submission failed');
    }
  };


  const parseRoles = (input) => {
    const allowedRoles = ["VISITOR", "ADMIN", "USER"];
    if (!input) {
      message.error('No data to save,Plese close the modal and try again');
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
      message.error(
        `Only "VISITOR", "ADMIN", "USER" are valid user roles. Invalid roles found: ${invalidRoles.join(
          ", "
        )}`
      );
    }

    return validRoles;
  };
const handleEditAPI  =async (editData) => {
    if (!editData) {
      message.error('No data to save,Plese close the modal and try again');
      return;
    }
    const reqData = {
      id: editData.id,
      email: editData.email,
      name: editData.name,
      password: editData.password,
      roles: parseRoles(editData.roles),
      status: editData.status,
    }
  
      await ApiClient.put('/user/', reqData)
        .then((response) => {
          if (response.data.status) {
            message.success('User updated successfully');
          } else {
            message.error('Failed to update user');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error.response) {
            message.error('Failed to update user');
            message.error(error.response.data.error.message);
          } else {
            message.error('Failed to update user');
            message.error(error.message);
          }
        });
        fetchUserData();

  }

  
  const handleDeleteAPI  =async (id) => {
    
      await ApiClient.delete('/user/'+id)
        .then((response) => {
          if (response.data.status) {
            message.success('User delete successfully');
          } else {
            message.error('Failed to delete user');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error.response) {
            message.error('Failed to delete user');
            message.error(error.response.data.error.message);
          } else {
            message.error('Failed to delete user');
            message.error(error.message);
          }
        });
        fetchUserData();

  }

  return (
    <>
      <main className="main-content">
        <h2>Dashboard</h2>

        <Button type="primary" id="primary-btn" onClick={showModal}>
          Add New User
        </Button>

        {/* Display loading message when fetching data */}
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <DataTable heading="List of all users" data={data} onEdit={handleEditAPI}  onDelete={handleDeleteAPI} restrictedItem={['status']} />
        )}

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
            <Input type="text" maxLength={10} />
          </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter the password' },
                { min: 6, message: 'Password must be at least 6 characters long' }
              ]}
            >
              <Input type="password" />
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
              <Input type="password" />
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
    
          </Form>
        </Modal>
      </main>
    </>
  );
};

export default UserDashboard;
