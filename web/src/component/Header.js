import propTypes from "prop-types";

export function Header({title}) {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark">
        <div>
          <a className="navbar-brand">My Bank</a>
        </div>
        <div className="d-flex text-light">Address</div>
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
