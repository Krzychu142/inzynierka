import React from "react";
import { Spin } from "antd";

const LoadingSpinner: React.FC = () => (
  <div className="loading-spin">
    <Spin size="large">
      <div />
    </Spin>
  </div>
);

export default LoadingSpinner;
