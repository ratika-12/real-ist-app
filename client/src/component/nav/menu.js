import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const loggedIn = auth?.user !== null && auth?.token !== "";
  const handlePostAdClick = () => {
    if (loggedIn) {
      navigate("/ad/create");
    } else {
      navigate("/login");
    }
  };

  const logout = () => {
    setAuth({ user: null, token: "", refreshToken: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <ul className="nav d-flex justify-content-between lead">
      <li>
        <NavLink className="nav-link" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/search">
          Search
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/buy">
          Buy
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/rent">
          Rent
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/agents">
          Agent
        </NavLink>
      </li>
      <li>
        <a className="nav-link pointer" onClick={handlePostAdClick}>
          Post Ad
        </a>
      </li>

      {!loggedIn ? (
        <>
          <li>
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="/register">
              Register
            </NavLink>
          </li>
        </>
      ) : (
        ""
      )}

      {loggedIn ? (
        <div className="dropdown">
          <li>
            <a
              className="nav-link pointer dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {!auth?.user?.name ? auth.user.name : auth.user.username}
            </a>
            <ul className="dropdown-menu">
              <li>
                <NavLink className="nav-link" to={`/dashboard`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <a onClick={logout} className="nav-link pointer">
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </div>
      ) : (
        ""
      )}
    </ul>
  );
}
