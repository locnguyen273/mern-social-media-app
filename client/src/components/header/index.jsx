import "./style.css";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleRedirectLogin = () => {
    navigate("/login");
  }
  return (
    <div className="header">
      <div className="header__container">
        <Link className="header__left" to="/">Generic Social Media App</Link>
        <dir></dir>
        <div className="header__right">
          <form className="d-flex header__right--form">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <button className="header__right--login" onClick={handleRedirectLogin}>
            Login
          </button>
          <button className="header__right--users">List User</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
