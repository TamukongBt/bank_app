import React from 'react';
import axios from 'axios';
import propTypes from "prop-types";
import { useState } from 'react';


export function Header({title}) {
  const [user, setUser] = useState('');
  React.useEffect(() => {
    const userToken = localStorage.getItem("AuthUser")
    axios.get(`http://localhost:3000/user/`+ userToken).then(function (response) {
      setUser(response.data);
    });
  }, []);

  return (  
    <header>
      <nav className="navbar navbar-dark bg-dark">
        <div>
          <a className="navbar-brand">My Bank</a>
        </div>
        <div className="d-flex text-light">{user.name}</div>
      </nav>
    </header>
  );
};

Header.defaultProps = {
  title: "Money Transfer",
};

Header.propTypes = {
  title: propTypes.string,
};

export default Header;
