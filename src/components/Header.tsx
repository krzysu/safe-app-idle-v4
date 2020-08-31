import React from "react";
import styled from "styled-components";

import logoSrc from "../assets/logo.svg";

const LogoImg = styled.img`
  max-width: 100px;
`;

const Header: React.FC = () => (
  <div>
    <a href="https://idle.finance/" target="_blank" rel="noopener noreferrer">
      <LogoImg src={logoSrc} alt="Idle" />
    </a>
  </div>
);

export default Header;
