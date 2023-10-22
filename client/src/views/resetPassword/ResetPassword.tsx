import React from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();

  return <div>ResetPassword</div>;
};

export default ResetPassword;
