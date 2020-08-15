import React from "react";

interface Props {
  route: string;
}
const Breadcrumb: React.FC<Props> = ({ route }) => {
  return <div>{route}</div>;
};

export default Breadcrumb;
