# Kitchen Sink

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and medium deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---

## KITCHEN-SINK

### 1. Login and Registration Page

#### Registration
Users can register by providing the following details:
- **Email**
- **Name**
- **Contact Number**
- **Password**

##### Buttons Available:
- **Cancel**: Closes the registration form without saving.
- **Submit**: Saves the information and submits it for approval.
- **Close (X)**: Located at the top right corner of the modal, this button also closes the form.

### Error Handling
- If there are issues during registration, an error message will be displayed.
- The error message will disappear once the user starts correcting the error.
  
### Success Message
Upon successful registration, a message will indicate: 
> "Registration successful. Pending for approval. Please check with administration."

### Login
Users can log in using:
- **Email**
- **Password**

Upon successful login, the user is redirected to the home page.

## User Roles
The application supports three user roles:
1. **Admin**
2. **User**
3. **Visitor**

## Admin Dashboard
When logged in as an Admin, the following options are available on the right sidebar:
- **Home**
- **Members**
- **Users**
- **Sign Out**

### Members Section:
- Displays a list of existing members.
- Search functionality is available based on:
  - Name
  - Contact Number
  - Email
  - Optional filters

#### Member Details Options:
- **Edit**
- **Delete**
- **Change Password**
- **Approve (Accept/Decline)**

> **Note:** Once approved, member details cannot be changed as they move to the user category.

### Add New Member
- A button at the bottom left allows for the addition of new members directly.

### Sign Out
- Redirects the user to the login page.

## User Dashboard
When logged in as a User, the sidebar contains the same options as the Admin:
- **Home**
- **Members**
- **Users**
- **Sign Out**

### Members Section:
- Displays existing members with search functionality (similar to Admin).

#### Member Details Options:
- **Edit**
- **Delete**
- **Change Password**
- **Approve (Accept/Decline)**

### Access Restriction
All actions that change member details will trigger a pop-up indicating: 
> "Access restricted. Only Admin can change."

### Add New Member
- A button at the bottom left allows for the addition of new members directly.

### Sign Out
- Redirects to the login page.

## Visitor Dashboard
When logged in as a Visitor, the sidebar has the same options:
- **Home**
- **Members**
- **Users**
- **Sign Out**

### Members and Users Section:
Access restrictions apply. All actions that change details will trigger a pop-up indicating:
> "Access restricted. Only Admin can change."

### Sign Out
- Redirects to the login page.

---

**Note:** Once the registration note is approved, the member will be classified as a user and assigned a role based on the approval. Admins can change user roles at any time.
