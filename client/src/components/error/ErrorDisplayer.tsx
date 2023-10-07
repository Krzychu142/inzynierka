import { Alert } from "antd";

interface ErrorDisplayerProps {
  message: string | null;
}

const ErrorDisplayer: React.FC<ErrorDisplayerProps> = ({ message }) => {
  return (
    message && (
      <Alert
        style={{ color: "black" }}
        message={message}
        type="error"
        showIcon
      />
    )
  );
};

export default ErrorDisplayer;
