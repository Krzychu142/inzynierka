import React from "react";
import { Spin } from "antd";
import "./loadingSpinner.css";

interface LoadingSpinnerProps {
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullscreen = false,
}) => (
  <div className={fullscreen ? "fullscreen-loading" : "normal-loading"}>
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;
