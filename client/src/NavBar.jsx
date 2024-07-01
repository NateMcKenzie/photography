import './NavBar.css'
import { Link } from "react-router-dom"


async function logout() {
  const res = await fetch("/registration/logout/", {
    credentials: "same-origin",
  });

  if (res.ok) {
    window.location = "/registration/sign_in/";
  }
}

function NavBar() {
  return (<>
    <nav className="bottomNav">
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/reservations">Reservations</Link>
        <Link className="link" to="/samples">Samples</Link>
        <span class="link material-symbols-outlined" onClick={logout}> logout </span>
    </nav>
  </>)
}

export default NavBar;
