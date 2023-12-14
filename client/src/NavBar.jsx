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
    <nav>
      <div className="linkHolder">
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/reservations">Reservations</Link>
        <Link className="link" to="/samples">Samples</Link>
      </div>
      <button onClick={logout}>Logout</button>
    </nav>
  </>)
}

export default NavBar;