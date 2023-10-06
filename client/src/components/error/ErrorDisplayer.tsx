interface ErrorDisplayerProps {
  message: string;
}

const ErrorDisplayer: React.FC<ErrorDisplayerProps> = ({ message }) => {
  return <span style={{ display: message ? "block" : "none" }}>{message}</span>;
};

export default ErrorDisplayer;
