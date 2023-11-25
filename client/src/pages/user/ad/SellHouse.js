import Sidebar from "../../../component/nav/sidebar";
import AdForm from "../../../component/forms/AdForm";
export default function SellHouse() {
  return (
    <div className="contaienr-fluid">
            <h1 className="display-3 bg-primary text-light">Sell House</h1>
      <Sidebar />
      <div className="container mt-2">
        <AdForm action="Sell" type="House"/>

      </div>
      
    </div>
  );
}