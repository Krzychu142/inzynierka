import { Alert } from "antd";
import React from "react";

interface MessageDisplayerProps {
  message: string | null;
  type: "success" | "info" | "warning" | "error";
  className?: string;
}

const MessageDisplayer: React.FC<MessageDisplayerProps> = ({
  message,
  type,
  className,
}) => {
  return (
    message && (
      <Alert className={className} message={message} type={type} showIcon />
    )
  );
};

export default MessageDisplayer;
