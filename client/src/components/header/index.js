import Nav from '../Nav';
const Header = () => {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Nav />
    </div>
  );
};

export default Header;
