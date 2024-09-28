import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Members.css';
import DataTable from '../../components/Table/Table';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import ApiClient from '../../service/apiclient/AxiosClient';
import { clearSession } from '../../service/jwt/JwtService';

const { Option } = Select;

const MemberDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);



  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiClient.get(`/member`);
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message.error('Unauthorized: Please logout and clean your user token.');
            clearSession();
            break;
          case 400:
            message.error('Bad Request: ' + error.response.data.error.message);
            break;
          case 404:
            message.error('Not Found: The mining data could not be found.');
            break;
          case 500:
            message.error('Internal Server Error: If the issue persists, please refresh the page and try logging in again or contact admin.');
            break;
          default:
            message.error('Failed to fetch data: ' + error.response.data.error.message);
            break;
        }
      } else {
        message.error('Failed to fetch data. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleResetPassword = async (resetDto) => {
    try {
      await ApiClient.post('/member/reset-password', resetDto)
        .then((response) => {
          if (response.data.status) {
            message.success('Password reset successfully');
            fetchUserData();
            //   setIsResetModalVisible(false);
          } else if (response.status === 409) {

            message.error('Failed to reset password');
            message.error(response.data.data.error);
            fetchUserData();
          } else {
            message.error('Failed to reset password');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession();
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              case 409:
                message.error('Conflict: Failed to reset password');
                message.error(error.response.data.error.message, 3);
                fetchUserData();
                break;
              default:
                message.error('Failed to reset password: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to reset password');
            message.error(error.message);
          }
        });
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Failed to reset password');
    }
    form.resetFields();
  }

  const addNewMemberApi = async (values) => {
    try {
      await ApiClient.post('/member', {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password
      })
        .then((response) => {
          if (response.data.status) {
            message.success('Member added successfully');
          } else {
            message.error('Failed to add member');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 204:
                message.error('No Content: ' + error.response.data.error.message);
                fetchUserData();
                break;
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession();
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              default:
                message.error('Failed to add member: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to add member');
            message.error(error.message);
          }
        });
      fetchUserData();
    } catch (error) {
      console.error('Error adding new member:', error);
      message.error('Failed to add new member');
    }
  }

  const onAddNewMemberSubmit = async () => {
    try {
      form
        .validateFields() // Validate fields on submit
        .then(values => {
          addNewMemberApi(values);
          form.resetFields(); // Reset form fields after successful submission
          setIsModalVisible(false); // Close modal after form submission
        }).catch(info => {
          console.log('Validation Failed:', info);
          message.error('Please enter all the required fields');
        })
    } catch (error) {
      console.log('Error:', error);
      message.error('Failed to add new member');
    }

  }

  const onEdit = async (values) => {
    try {
      await ApiClient.put('/member', {
        id: values.id,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber
      })
        .then((response) => {
          if (response.data.status) {
            message.success('Member update successfully');
            fetchUserData();
          } else {
            message.error('Failed to update member');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession();
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              default:
                message.error('Failed to update member: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to update member');
            message.error(error.message);
          }
        });

    } catch (error) {
      console.error('Error update  member:', error);
      message.error('Failed to update  member');
    }
  }

  const onDelete = async (row) => {
    console.log('Delete id:', row.id);
    try {
      await ApiClient.delete('/member/' + row.id)
        .then((response) => {
          if (response.data.status) {
            message.success('Member deleted successfully');
            fetchUserData();
          } else {
            message.error('Failed to delete member');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession();
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              default:
                message.error('Failed to delete member: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to delete member');
            message.error(error.message);
          }
        });

    } catch (error) {
      console.error('Error deleting member:', error);
      message.error('Failed to delete member')
    }
  }

  const handleApprove = async (row) => {
    const userRoles = ['VISITOR'];
    console.log('Approve id:', row.id);
    try {
      await ApiClient.post(`/member/change-status?memberId=${row.id}&status=APPROVED&userRoles=${userRoles}`)
        .then((response) => {
          if (response.data.status) {
            message.success('Member approved successfully');
            fetchUserData();
          } else {
            message.error('Failed to approve member');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 204:
                message.error('No Content: ' + error.response.data.error.message);
                fetchUserData();
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession()
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              default:
                message.error('Failed to approve member: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to approve member');
            message.error(error.message);
          }
        });

    } catch (error) {
      console.error('Error approving member:', error);
      message.error('Failed to approve member')
    }
  }
  const handleDecline = async (row) => {
    console.log('Decline id:', row.id);
    try {
      await ApiClient.post(`/member/change-status?memberId=${row.id}&status=DECLINED`)
        .then((response) => {
          if (response.data.status) {
            message.success('Member declined successfully');
            fetchUserData();
          } else {
            message.error('Failed to decline member');
            message.error(response.data.data.error);
          }
        })
        .catch((error) => {
          if (error?.response) {
            switch (error.response.status) {
              case 204:
                message.error('No Content: ' + error.response.data.error.message);
                fetchUserData();
              case 401:
                message.error('Unauthorized: Please logout and clean your user token.');
                clearSession()
                break;
              case 400:
                message.error('Bad Request: ' + error.response.data.error.message);
                break;
              case 404:
                message.error('Not Found: Could not find the resource.');
                break;
              case 412:
                message.error('Precondition Failed: ' + error.response.data.error.message);
                break;
              case 500:
                message.error('Internal Server Error: Please refresh the page, log out, and log back in. If the issue persists, contact admin.');
                break;
              default:
                message.error('Failed to decline member: ' + error.response.data.error.message);
                break;
            }
          } else {
            message.error('Failed to decline member');
            message.error(error.message);
          }
        });

    } catch (error) {
      console.error('Error declining member:', error);
      message.error('Failed to decline member')
    }
  }

  const onStatusAction = async (row, status) => {
    if (status === 'APPROVE') {
      handleApprove(row);
    } else {
      handleDecline(row);
    }
  }



  return (
    <>
      <main className="main-content">
        <h2>22</h2>

        <Button type="primary" id="primary-btn" onClick={showModal}>
          Add New Member
        </Button>
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <DataTable heading="List of all Members" data={data}
            restrictedItem={['lastModifiedBy', 'approvedTime', 'status', 'approvedBy']}
            memberBtn={true} onResetPasswordMemeber={handleResetPassword} onEdit={onEdit}
            onDelete={onDelete} onStatusAction={onStatusAction}
          />)}

        <Modal
          title="Add New Member"
          visible={isModalVisible}
          onCancel={handleCancel}
          okText="Submit"
          cancelText="Cancel"
          onOk={onAddNewMemberSubmit}
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

          </Form>
        </Modal>
      </main>
    </>
  );
};

export default MemberDashboard;
