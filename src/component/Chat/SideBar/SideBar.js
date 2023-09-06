// Sidebar.js
import "./SideBar.css"; // Import the CSS file
const SideBar = ({ Users }) => {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {Users.map((user, index) => (
          <li key={index}>{user.user_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
