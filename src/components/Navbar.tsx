import { NavLink } from "react-router-dom"

function Navbar() {
  
  const logdinUser = localStorage.getItem("loginedUser")

  const onLogOut = () => {
    localStorage.removeItem("loginedUser")
    setTimeout(() => {
      location.reload()
    }, 1500)
  }
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md shadow bg-[#f5f5f5]" >
      <ul className="flex items-center justify-between">
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>
        {logdinUser ? (
          <div className="flex items-center text-indigo-600 space-x-4">
            <li className="duration-200 text-lg">
              <NavLink to="/todos">todos</NavLink>
            </li>
            <li className="duration-200 text-lg">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <button
              className="bg-indigo-500 text-white p-2 rounded-md cursor-pointer"
              onClick={onLogOut}
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  )
}

export default Navbar