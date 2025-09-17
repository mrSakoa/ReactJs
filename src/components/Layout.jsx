import { Link, Outlet } from "react-router-dom"

import HamburgerNavbar from "./HamburgerNavbar"


function Layout() {
  return (
    <>
    <nav><HamburgerNavbar /></nav>
      <Outlet />
    </>
  );
}

export default Layout