import React, { useState, useEffect } from "react";
import "./navbar.css";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  DatabaseOutlined,
  HomeOutlined,
  LogoutOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Button } from "antd";

const Navbar = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    if (windowWidth >= 700) {
      setIsShown(true);
    } else {
      setIsShown(false);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  return (
    <header className="navbar">
      <nav className={`navbar__nav ${!isShown ? "hidden" : ""}`}>
        <ul className="navbar__nav__ul">
          {/* TODO: extract to separated component single li on this list as navbar iteam  */}
          <li className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}>
            <Link to="/" className="link" title="Go to employees module.">
              <TeamOutlined />
              <span>Employees</span>
            </Link>
          </li>
          <li className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}>
            <Link to="/" className="link" title="Go to orders module.">
              <AuditOutlined />
              <span>Orders</span>
            </Link>
          </li>
          <li className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}>
            <Link className="link" to="/" title="Go to clietns module.">
              <SolutionOutlined />
              <span>Clients</span>
            </Link>
          </li>
          <li className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}>
            <Link to="/" className="link" title="Go to warhouse module.">
              <DatabaseOutlined />
              <span>Warhouse</span>
            </Link>
          </li>
          <li className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}>
            <Link className="link" to="/" title="Back to home page.">
              <HomeOutlined />
              <span>Home</span>
            </Link>
          </li>
          <li>
            {/* TODO: add function to logout */}
            <Button
              style={{ padding: "0px" }}
              type="link"
              className={`link navbar__nav__ul__li--logout ${
                !isShown ? "none" : ""
              }`}
              title="Click to logout."
            >
              <LogoutOutlined />
            </Button>
          </li>
        </ul>
        <Button
          ghost
          className="navbar__nav__ul__li--show"
          onClick={() =>
            setIsShown((previous) => {
              return !previous;
            })
          }
        >
          {isShown ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
