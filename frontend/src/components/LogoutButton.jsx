import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return 
}
