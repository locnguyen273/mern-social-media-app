import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, login } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";

const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const [userType, setUserType] = useState(false);
  const { email, password } = userData;
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userType) {
      dispatch(login(userData));
    } else {
      dispatch(adminLogin(userData));
    }
  };

  return (
    <section className="login">
      <div className="container-fluid">
        <div className="login__container">
          <div className="login__left">
            <form onSubmit={handleSubmit} style={{ width: "23rem" }}>
              <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: 1 }}>
                Log in
              </h3>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form2Example18">
                  Email address
                </label>
                <input
                  type="email"
                  onChange={handleChangeInput}
                  value={email}
                  name="email"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form2Example28">
                  Password
                </label>
                <input
                  type="password"
                  onChange={handleChangeInput}
                  value={password}
                  name="password"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="d-flex mx-0 mb-4 gx-5">
                <label htmlFor="User">
                  User:
                  <input
                    type="radio"
                    id="User"
                    name="gender"
                    value={userType}
                    defaultChecked
                    onClick={() => setUserType(false)}
                  />
                </label>

                <label htmlFor="Admin">
                  Admin:
                  <input
                    type="radio"
                    id="Admin"
                    name="gender"
                    value={userType}
                    onClick={() => setUserType(true)}
                  />
                </label>
              </div>
              <div className="pt-1 mb-4">
                <button
                  className="btn btn-info btn-lg btn-block"
                  type="button"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
              <p className="small mb-5 pb-lg-2">
                <a className="text-muted" href="#!">
                  Forgot password?
                </a>
              </p>
              <p>
                Do not have an account?{" "}
                <Link to="/register" className="link-info">
                  Register here
                </Link>
              </p>
            </form>
          </div>
          <div className="login__right">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
              alt="Login image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
