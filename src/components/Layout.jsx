import { Outlet } from "react-router-dom"

import HamburgerNavbar from "./hamburgernavbar"


function Layout() {
  return (
    <>
    <nav><HamburgerNavbar /></nav>
      <Outlet />
    </>
  );
}

export default Layout