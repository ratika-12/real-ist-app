import SearchForm from "../component/forms/SerachForm";
import { useSearch } from "../context/Search";
import AdCard from "../component/cards/AdCard";
export default function Search() {
  // context
  const [search, setSearch] = useSearch();

  return (
    <>
      <div className="pt-4">
        <SearchForm />
      </div>

      <div className="container">
        <div className="row gx-2">
          {search.results?.length > 0 ? (
            <div className="col-md-12 text-center p-5">
              Found {search.results?.length} results
            </div>
          ) : (
            <div className="col-md-12 text-center p-5">No properties found</div>
          )}
          {search.results?.map((item) => (
            <AdCard ad={item} />
          ))}
        </div>
      </div>
    </>
  );
}


