import { useState } from "react";
import "./search.scss";
import { BiSearch } from "react-icons/bi";

export const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // search logic here
        console.log("Searching for:", searchTerm);
    };
    
    return (
        <div id="search-bar">
            <div className="search-icon">
              <BiSearch />
            </div>
        <form onSubmit={handleSearchSubmit} className="search-form">
            <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Anything"
            />
            
        </form>
        </div>
    );
}