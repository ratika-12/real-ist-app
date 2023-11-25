import Sidebar from "../../component/nav/sidebar";
import UpdatePassword from "../../component/forms/UpdatePassword";

export default function Settings() {
  return (
    <div className="contaienr-fluid">
      <Sidebar />
      <div className="container mt-2">
        <UpdatePassword/>
      </div>
    </div>
  );
}


