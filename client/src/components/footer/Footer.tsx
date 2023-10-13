import { RollbackOutlined } from "@ant-design/icons";
import "./footer.css";
import { Button } from "antd";

const Footer = () => {
  return (
    <footer className="footer">
      <Button
        type="link"
        className="link"
        onClick={() => {
          window.history.back();
        }}
      >
        <span className="darker">
          <RollbackOutlined />
        </span>
        Go back
      </Button>
    </footer>
  );
};

export default Footer;
