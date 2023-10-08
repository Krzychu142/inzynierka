import React from "react";
import { Link } from "react-router-dom";

interface NavbarItemProps {
  title: string;
  icon: React.ReactNode;
  titleToDisplay: string;
  to: string;
}

const NabrItem: React.FC<NavbarItemProps> = ({
  title,
  icon,
  titleToDisplay,
  to,
}) => {
  return (
    <Link to={to} className="link" title={title}>
      {icon}
      <span>{titleToDisplay}</span>
    </Link>
  );
};

export default NabrItem;
