import React from "react";
import { useSearch } from "../../context/Search";
import Select from "react-select";
import { sellPrices, rentPrices } from "../../helpers/PriceList";
import queryString from "query-string"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchForm() {
    const [search, setSearch] = useSearch();
    const navigate = useNavigate();

    const options = [
        { value: "address", label: "Search..." },
    ];

    const handleSelectChange = (selectedOption) => {
        setSearch({ ...search, address: selectedOption.value });
    };
    const handleSearch = async (e) => {
        setSearch({ ...search, loading: true });
        try {
          const { results, page, price, ...rest } = search;
          const query = queryString.stringify(rest);
          const { data } = await axios.get(`/search?${query}`);
    
          if (search?.page !== "/search") {
            setSearch((prev) => ({
              ...prev,
              results: data,
              loading: false,
            }));
            navigate("/search");
          } else {
            setSearch((prev) => ({
              ...prev,
              results: data,
              page: window.location.pathname,
              loading: false,
            }));
          }
        } catch (err) {
          console.log(err);
          setSearch({ ...search, loading: false });
        }
      };

    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-lg-12">
                        <Select
                            options={options}
                            placeholder="Search."
                            onChange={handleSelectChange}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <button onClick={() => setSearch({ ...search, action: "Buy", price: "" })}
                        className="col-lg-2 btn btn-primary sqaure">
                        {search.action === "Buy" ? "✅ Buy" : "Buy"}</button>

                    <button onClick={() => setSearch({ ...search, action: "Rent", price: "" })}
                        className="col-lg-2 btn btn-primary square">
                        {search.action === "Rent" ? "✅ Rent" : "Rent"}</button>
                    <button onClick={() => setSearch({ ...search, type: "House", price: "" })}
                        className="col-lg-2 btn btn-primary square">{search.type === "House" ? "✅ House" : "House"}</button>
                    <button onClick={() => setSearch({ ...search, type: "Land", price: "" })}
                        className="col-lg-2 btn btn-primary square">{search.type === "Land" ? "✅ Land" : "Land"}</button>
                    <div className="dropdown">
                        <button
                            className="btn btn-primary square dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            &nbsp; Price range
                        </button>
                        <ul className="dropdown-menu">
                            {search.action === "Buy" ? (
                                <>
                                    {sellPrices?.map((p) => (
                                        <li key={p._id}>
                                            <a
                                                className="dropdown-item"
                                                onClick={() =>
                                                    setSearch({
                                                        ...search,
                                                        price: p.name,
                                                        priceRange: p.array,
                                                    })
                                                }
                                            >
                                                {p.name}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {rentPrices?.map((p) => (
                                        <li key={p._id}>
                                            <a
                                                className="dropdown-item"
                                                onClick={() =>
                                                    setSearch({
                                                        ...search,
                                                        price: p.name,
                                                        priceRange: p.array,
                                                    })
                                                }
                                            >
                                                {p.name}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>
                    <button onClick={handleSearch} className="col-lg-2 btn btn-danger">
                        Search
                    </button>        
                    </div>

      {/* {JSON.stringify(search, null, 4)} */}
            </div>
        </>
    );
}
