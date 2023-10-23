import { useState, useEffect } from "react";
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
import { Button } from "antd";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../features/authSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useAppDispatch();
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

  const navbarItems = [
    {
      title: "Go to employees module.",
      icon: <TeamOutlined />,
      titleToDisplay: "Employees",
      to: "/employees",
      key: "employees",
    },
    {
      title: "Go to orders module.",
      icon: <AuditOutlined />,
      titleToDisplay: "Orders",
      to: "/",
      key: "orders",
    },
    {
      title: "Go to clietns module.",
      icon: <SolutionOutlined />,
      titleToDisplay: "Clients",
      to: "/",
      key: "clients",
    },
    {
      title: "Go to warhouse module.",
      icon: <DatabaseOutlined />,
      titleToDisplay: "Warhouse",
      to: "/warhouse",
      key: "warhouse",
    },
    {
      title: "Back to home page.",
      icon: <HomeOutlined />,
      titleToDisplay: "Home",
      to: "/dashboard",
      key: "home",
    },
  ];

  return (
    <header className="navbar">
      <nav className={`navbar__nav ${!isShown ? "hidden" : ""}`}>
        <ul className="navbar__nav__ul">
          {navbarItems.map((item) => {
            return (
              <li
                className={`navbar__nav__ul--li ${!isShown ? "none" : ""}`}
                key={item.key}
              >
                <Link
                  to={item.to}
                  className="link link--button"
                  title={item.title}
                >
                  {item.icon}
                  <span>{item.titleToDisplay}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Button
              style={{ padding: "0px" }}
              type="link"
              className={`link navbar__nav__ul__li--logout ${
                !isShown ? "none" : ""
              }`}
              title="Click to logout."
              onClick={() => dispatch(logout())}
            >
              <LogoutOutlined />
            </Button>
          </li>
        </ul>
        <Button
          ghost
          className="navbar__nav__ul__li--show"
          title="Click to show/hide navbar."
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
