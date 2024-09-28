import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { message, Select, Input } from 'antd';
import PhoneInput from 'react-phone-input-2'; // Phone input import
import 'react-phone-input-2/lib/style.css'; // Phone input styles
import { getEmail } from '../../service/jwt/JwtService'; // JWT service import
import './Table.css'; // CSS file import

const { Option } = Select;


const DataTable = ({
  heading, data, loading, onEdit, onDelete, mongoId,
  restrictedItem = [], memberBtn,
  onBlock, onActive, onResetPasswordUser, onResetPasswordMemeber,
  onStatusAction
}) => {
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState(null);
  const [editOldData, setOldEditData] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRowData, setDeleteRowData] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const [showResetPWDModel, setShowResetPWDModel] = useState(false);
  const [showResetPWDConfirm, setShowResetPWDConfirm] = useState(false);
  const [resetPasswordDataID, setResetPasswordDataID] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const currentEmail = getEmail();
  const rowsPerPage = 5;

  const rolesOptions = ['ADMIN', 'USER', 'VISITOR'];
  const fetchDataTable = () => {
    if (data && data.length > 0) {
      const idKey = mongoId;
      const fetchedHeaders = Object.keys(data[0]).filter(
        header =>
          header !== idKey &&
          header !== 'id' &&
          header !== 'createdTime' &&
          header !== 'lastModifiedTime' &&
          header !== 'createdBy' &&
          !restrictedItem.includes(header)
      );
      setHeaders(fetchedHeaders);
    }
  }

  useEffect(() => {
    fetchDataTable();
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleEdit = (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    setEditData(row);
    setOldEditData(row);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDelete = (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    setDeleteRowData(row);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(deleteRowData);
    setShowDeleteConfirm(false);
  };


  const handleSaveChanges = () => {
    setShowSaveConfirm(true);
  };

  const confirmSaveChanges = () => {
    onEdit(editData, editOldData);
    setShowSaveConfirm(false);
    setShowEditModal(false);
  };

  const confirmResetPassword = async () => {
    if (memberBtn) {
      await onResetPasswordMemeber({ id: resetPasswordDataID, password });
    } else {
       await onResetPasswordUser({ id: resetPasswordDataID, password });
    }
    setShowResetPWDConfirm(false);
    setShowResetPWDModel(false);
    setPassword('');
    setConfirmPassword('');
  }

  const handleResetCancel = () => {
    setShowResetPWDModel(false);
    setPassword('');
    setConfirmPassword('');
  }
  const handleResetFormSubmit = () => {
    try {
      if (password === confirmPassword) {
        setShowResetPWDConfirm(true)
      }
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  }

  const handleBlock =  (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    onBlock(row)
    console.log('block')
  }
  const handleActivate =  (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    onActive(row)
    console.log('active')
  }

  const handleApprove = (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    console.log('approve')
    onStatusAction(row, 'APPROVE')
  }
  const handleDecline = (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    console.log('decline')
    onStatusAction(row, 'DECLINE')
  }
  const handleReset = (row) => {
    if(row?.email === currentEmail) {
      message.error('You cannot edit your own account');
      return;
    }
    setResetPasswordDataID(row.id)
    setShowResetPWDModel(true)
    console.log('reset')
  }


  return (
    <div className="main-content">
      {/* table Model */}
      <div className="position-relative custom-page">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between pb-0 border-0">
              <div className="header-title">
                <h4 className="card-title">{heading}</h4>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {loading ? (
                  <Spinner animation="border" />
                ) : data.length === 0 ? (
                  <p>No data available</p>             
                ) : (
                  <>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          {headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                          <th>Modify Options</th>
                          {!memberBtn && <th>Reset PWD & Status</th>}
                          {memberBtn && <th>Reset PWD</th>}
                          {memberBtn &&
                            <th>Approval</th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {headers.map((header) => (
                              <td key={header}>
                                {Array.isArray(row[header])
                                  ? row[header].join(', ')
                                  : row[header]}
                              </td>
                            ))}
                            <td className='rowBtn'>
                              <Button className='green' onClick={() => handleEdit(row)}>
                                <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                <path opacity="0.4" d="M19.9927 18.9534H14.2984C13.7429 18.9534 13.291 19.4124 13.291 19.9767C13.291 20.5422 13.7429 21.0001 14.2984 21.0001H19.9927C20.5483 21.0001 21.0001 20.5422 21.0001 19.9767C21.0001 19.4124 20.5483 18.9534 19.9927 18.9534Z" fill="currentColor"></path>                                <path d="M10.309 6.90385L15.7049 11.2639C15.835 11.3682 15.8573 11.5596 15.7557 11.6929L9.35874 20.0282C8.95662 20.5431 8.36402 20.8344 7.72908 20.8452L4.23696 20.8882C4.05071 20.8903 3.88775 20.7613 3.84542 20.5764L3.05175 17.1258C2.91419 16.4915 3.05175 15.8358 3.45388 15.3306L9.88256 6.95545C9.98627 6.82108 10.1778 6.79743 10.309 6.90385Z" fill="currentColor"></path>                                <path opacity="0.4" d="M18.1208 8.66544L17.0806 9.96401C16.9758 10.0962 16.7874 10.1177 16.6573 10.0124C15.3927 8.98901 12.1545 6.36285 11.2561 5.63509C11.1249 5.52759 11.1069 5.33625 11.2127 5.20295L12.2159 3.95706C13.126 2.78534 14.7133 2.67784 15.9938 3.69906L17.4647 4.87078C18.0679 5.34377 18.47 5.96726 18.6076 6.62299C18.7663 7.3443 18.597 8.0527 18.1208 8.66544Z" fill="currentColor"></path>                                </svg>
                              </Button>
                              <Button
                                className='red'
                                onClick={() => handleDelete(row)}
                              >
                                <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                <path opacity="0.4" d="M19.643 9.48851C19.643 9.5565 19.11 16.2973 18.8056 19.1342C18.615 20.8751 17.4927 21.9311 15.8092 21.9611C14.5157 21.9901 13.2494 22.0001 12.0036 22.0001C10.6809 22.0001 9.38741 21.9901 8.13185 21.9611C6.50477 21.9221 5.38147 20.8451 5.20057 19.1342C4.88741 16.2873 4.36418 9.5565 4.35445 9.48851C4.34473 9.28351 4.41086 9.08852 4.54507 8.93053C4.67734 8.78453 4.86796 8.69653 5.06831 8.69653H18.9388C19.1382 8.69653 19.3191 8.78453 19.4621 8.93053C19.5953 9.08852 19.6624 9.28351 19.643 9.48851Z" fill="currentColor"></path>                                <path d="M21 5.97686C21 5.56588 20.6761 5.24389 20.2871 5.24389H17.3714C16.7781 5.24389 16.2627 4.8219 16.1304 4.22692L15.967 3.49795C15.7385 2.61698 14.9498 2 14.0647 2H9.93624C9.0415 2 8.26054 2.61698 8.02323 3.54595L7.87054 4.22792C7.7373 4.8219 7.22185 5.24389 6.62957 5.24389H3.71385C3.32386 5.24389 3 5.56588 3 5.97686V6.35685C3 6.75783 3.32386 7.08982 3.71385 7.08982H20.2871C20.6761 7.08982 21 6.75783 21 6.35685V5.97686Z" fill="currentColor"></path>                                </svg>
                              </Button>


                            </td>

                            <td className='newRow'>
                              <Button
                                className='green'
                                style={{ marginLeft: '5px' }}
                                onClick={() => handleReset(row)}
                              >
                                <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                <path opacity="0.4" d="M16.3345 1.99976H7.66549C4.27649 1.99976 2.00049 4.37776 2.00049 7.91676V16.0838C2.00049 19.6218 4.27649 21.9998 7.66549 21.9998H16.3335C19.7225 21.9998 22.0005 19.6218 22.0005 16.0838V7.91676C22.0005 4.37776 19.7235 1.99976 16.3345 1.99976Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3144 11.2484H17.0144C17.4244 11.2484 17.7644 11.5884 17.7644 11.9984V13.8484C17.7644 14.2684 17.4244 14.5984 17.0144 14.5984C16.5944 14.5984 16.2644 14.2684 16.2644 13.8484V12.7484H14.9344V13.8484C14.9344 14.2684 14.5944 14.5984 14.1844 14.5984C13.7644 14.5984 13.4344 14.2684 13.4344 13.8484V12.7484H11.3144C10.9944 13.8184 10.0144 14.5984 8.84437 14.5984C7.40437 14.5984 6.23438 13.4384 6.23438 11.9984C6.23438 10.5684 7.40437 9.39844 8.84437 9.39844C10.0144 9.39844 10.9944 10.1784 11.3144 11.2484ZM7.73438 11.9984C7.73438 12.6084 8.23438 13.0984 8.84438 13.0984C9.44438 13.0984 9.94438 12.6084 9.94438 11.9984C9.94438 11.3884 9.44438 10.8984 8.84438 10.8984C8.23438 10.8984 7.73438 11.3884 7.73438 11.9984Z" fill="currentColor"></path>                                </svg>
                              </Button>
                              {row.status === 'ACTIVE' && (
                                <Button
                                  className='green'
                                  style={{ marginLeft: '5px' }}
                                  onClick={() => handleActivate(row)}
                                >
                                  <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M8.23918 8.70907V7.36726C8.24934 5.37044 9.92597 3.73939 11.9989 3.73939C13.5841 3.73939 15.0067 4.72339 15.5249 6.19541C15.6976 6.65262 16.2057 6.89017 16.663 6.73213C16.8865 6.66156 17.0694 6.50253 17.171 6.29381C17.2727 6.08508 17.293 5.84654 17.2117 5.62787C16.4394 3.46208 14.3462 2 11.9786 2C8.95048 2 6.48126 4.41626 6.46094 7.38714V8.91084L8.23918 8.70907Z" fill="currentColor"></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.7688 8.71118H16.2312C18.5886 8.71118 20.5 10.5808 20.5 12.8867V17.8246C20.5 20.1305 18.5886 22.0001 16.2312 22.0001H7.7688C5.41136 22.0001 3.5 20.1305 3.5 17.8246V12.8867C3.5 10.5808 5.41136 8.71118 7.7688 8.71118ZM11.9949 17.3286C12.4928 17.3286 12.8891 16.941 12.8891 16.454V14.2474C12.8891 13.7703 12.4928 13.3827 11.9949 13.3827C11.5072 13.3827 11.1109 13.7703 11.1109 14.2474V16.454C11.1109 16.941 11.5072 17.3286 11.9949 17.3286Z" fill="currentColor"></path>
                                  </svg>
                                </Button>
                              )}
                              {row.status === 'BLOCKED' && (
                                <Button
                                  className='red'
                                  style={{ marginLeft: '5px' }}
                                  onClick={() => handleBlock(row)}
                                >
                                  <svg class="icon-32" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.7688 8.71387H16.2312C18.5886 8.71387 20.5 10.5831 20.5 12.8885V17.8254C20.5 20.1308 18.5886 22 16.2312 22H7.7688C5.41136 22 3.5 20.1308 3.5 17.8254V12.8885C3.5 10.5831 5.41136 8.71387 7.7688 8.71387ZM11.9949 17.3295C12.4928 17.3295 12.8891 16.9419 12.8891 16.455V14.2489C12.8891 13.772 12.4928 13.3844 11.9949 13.3844C11.5072 13.3844 11.1109 13.772 11.1109 14.2489V16.455C11.1109 16.9419 11.5072 17.3295 11.9949 17.3295Z" fill="currentColor"></path>
                                    <path opacity="0.4" d="M17.523 7.39595V8.86667C17.1673 8.7673 16.7913 8.71761 16.4052 8.71761H15.7447V7.39595C15.7447 5.37868 14.0681 3.73903 12.0053 3.73903C9.94257 3.73903 8.26594 5.36874 8.25578 7.37608V8.71761H7.60545C7.20916 8.71761 6.83319 8.7673 6.47754 8.87661V7.39595C6.4877 4.41476 8.95692 2 11.985 2C15.0537 2 17.523 4.41476 17.523 7.39595Z" fill="currentColor"></path>
                                  </svg>
                                </Button>
                              )}
                            </td>

                            {memberBtn &&
                              <td className='rowBtnn'>
                                {row.status === 'PENDING' &&
                                  <>
                                    <Button id="primary-btn" 
                                    
                                    onClick={() => handleApprove(row)}>Approve</Button>
                                    <Button variant="danger" style={{ marginTop: '2px' }} id="primary-btn" className='redBtn' onClick={() => handleDecline(row)}>Decline</Button>
                             
                                  </>
                                }
                                {row.status === 'APPROVED' &&
                                  <>
                                    <p>Approved</p>
                                  </>
                                }
                                {row.status === 'DECLINED' &&
                                  <>
                                    <p>Declined</p>
                                  </>
                                }
                              </td>
                            }

                          </tr>
                        ))}
                      </tbody>
                    </Table>

                  </>
                )}
              </div>
              <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
      </div>



      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Row</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {headers
            .filter(header => header !== 'lastModifiedBy')
            .map((header) => (
              <Form.Group key={header} controlId={header}>
                <Form.Label>{header}</Form.Label>

                {header === 'roles' ? (
                  <Select
                    mode="multiple"
                    defaultValue={editData ? editData[header] : ['']}
                    onChange={(value) => {
                      // Check if "VISITOR" is selected
                      if (value.length === 0) {
                        message.error('At least "VISITOR" should be selected');
                        value.push('VISITOR'); // Ensure "VISITOR" remains selected
                      } else if (!value.includes('VISITOR')) {
                        // If "VISITOR" is not included, add it
                        message.error('"VISITOR" should be selected');
                      }

                      // Update state
                      setEditData({ ...editData, [header]: value });
                    }}
                    options={rolesOptions.map(role => ({ value: role, label: role }))}
                    style={{ width: '100%' }}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  />
                ) : header === 'phoneNumber' ? (
                  <PhoneInput
                    country={'in'}
                    value={editData ? editData[header] : ''}
                    onChange={(phone) => setEditData({ ...editData, [header]: phone })} // Update form value
                    style={{ width: '100%' }}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    defaultValue={editData ? editData[header] : ''}
                    onChange={(e) => setEditData({ ...editData, [header]: e.target.value })} // Allow editing
                  />
                )}
              </Form.Group>
            ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

      {/* Save Changes Confirmation Modal */}
      <Modal show={showSaveConfirm} onHide={() => setShowSaveConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save the changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSaveChanges}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Reset Password Modal */}
      <Modal show={showResetPWDModel} onHide={handleResetCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Input.Password
                type="password"
                placeholder="Enter password"
                required
                minLength="6"
                onChange={(e) => setPassword(e.target.value)} // Hook to update password
              />
              {password.length < 6 && < Form.Text className="text-danger">
                Password must be at least 6 characters long.
              </Form.Text>}
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Input.Password
                type="password"
                placeholder="Confirm password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)} // Hook to update confirm password
              />
              {password !== confirmPassword && (
                <Form.Text className="text-danger">
                  Passwords do not match!
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
                    <Modal.Footer>
              <Button variant="secondary" onClick={handleResetCancel}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={password !== confirmPassword} onClick={handleResetFormSubmit}>
                Submit
              </Button>
            </Modal.Footer>
      </Modal>


      {/* Reset password Confirmation Modal */}
      <Modal show={showResetPWDConfirm} onHide={() => setShowResetPWDConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Reset Password?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetPWDConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmResetPassword}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default DataTable;
