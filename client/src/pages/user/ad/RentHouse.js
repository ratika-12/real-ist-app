import Sidebar from "../../../component/nav/sidebar";
import AdForm from "../../../component/forms/AdForm";
export default function RentHouse() {
  return (
    <div className="contaienr-fluid">
            <h1 className="display-3 bg-primary text-light">Rent House</h1>
      <Sidebar />
      <div className="container mt-2">
        <AdForm action="Rent" type="House"/>

      </div>
      
    </div>
  );
}