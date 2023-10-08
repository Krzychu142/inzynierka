import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../features/authSlice";

interface HomeProps {
  isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
  const dispatch = useAppDispatch();

  return (
    <main className="home">
      <div className="home__container">
        <section className="home__title">
          <h1>
            Welcome in
            <span className="home__title--color">Your Warehouse Page</span>
            <img
              className="home__title__icon"
              src="/warehouse.png"
              alt="Icon of your warhouse."
            />
          </h1>
          <section className="home__navigation">
            {isAuthenticated ? (
              <>
                <p>
                  Welcome! Go to dashboard
                  <Link
                    className="link home__navigation--spacing"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </p>
                <p>
                  You can also
                  <Button
                    className="link"
                    size="small"
                    type="link"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </Button>
                </p>
              </>
            ) : (
              <p>
                If You are one of our team please
                <Link className="link home__navigation--spacing" to="/login">
                  LogIn
                </Link>
              </p>
            )}
          </section>
        </section>
      </div>
      <div className="home__background"></div>
    </main>
  );
};

export default Home;
