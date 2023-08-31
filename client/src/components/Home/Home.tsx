import React from "react";
import "./home.css";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <main className="home">
      <div className="home__container">
        <section className="home__title">
          <h1>
            Welcome in
            <span className="home__title--color">YourWarehousePage</span>
            <img
              className="home__title__icon"
              src="../../../public/warehouse.png"
              alt="Icon of your warhouse."
            />
          </h1>
          <section className="home__navigation">
            <p>
              If You are one of our team please
              <Link className="link home__navigation--spacing" to="/">
                LogIn
              </Link>
            </p>
          </section>
        </section>
      </div>
      <div className="home__background"></div>
    </main>
  );
};

export default Home;
