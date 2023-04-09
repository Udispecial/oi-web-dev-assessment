import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [toggleMenu, setToggleMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <header className="app__navbar">
      <Link className="app_navbar-links_logo" to={user ? "/dashboard" : "/"}>
        CMSBlog
      </Link>
      {user ? (
        <>
          {/* <div className="app_navbar-links"> */}
          <ul className="app_navbar-links_container">
            <li>
              <Link className="links" to="/all_posts">
                All Posts
              </Link>
            </li>
            <li>
              <Link className="links" to="/category">
                Categories
              </Link>
            </li>
            <li>
              <Link className="links" to="/tags">
                Tags
              </Link>
            </li>
            <li>
              <Link className="links" to="/comments">
                All Comments
              </Link>
            </li>
          </ul>
          <div className="app__navbar-sign">
            {user?.result?.picture ? (
              <img src={user?.result?.picture} alt={user?.result?.name} />
            ) : (
              <span>{user.result.name.charAt(0)}</span>
            )}
            <p>{user?.result?.name}</p>
            <button onClick={logout}>Log Out</button>
          </div>
          {/* </div> */}
        </>
      ) : (
        <Link to="/auth">
          <button className="signup_button">Sign In</button>
        </Link>
      )}
      <div className="app__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="app__navbar-menu_container scale-up-center">
            {/* <div className="app__navbar-menu_container-links"> */}
            {user ? (
              <>
                {/* <div className="app_navbar-links"> */}
                <ul className="app__navbar-menu_container-links">
                  <li>
                    <Link
                      onClick={() => setToggleMenu(false)}
                      className="links"
                      to="/all_posts"
                    >
                      All Posts
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => setToggleMenu(false)}
                      className="links"
                      to="/category"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => setToggleMenu(false)}
                      className="links"
                      to="/tags"
                    >
                      Tags
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => setToggleMenu(false)}
                      className="links"
                      to="/comments"
                    >
                      All Comments
                    </Link>
                  </li>
                </ul>
                <div className="app__navbar-menu_container-links-sign">
                  <button onClick={logout}>Log Out</button>
                </div>
                {/* </div> */}
              </>
            ) : (
              <Link to="/auth">
                <button
                  className="signup_button-menu"
                  onClick={() => setToggleMenu(false)}
                >
                  Sign In
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
