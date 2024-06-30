import React, { useState, useContext } from 'react';
import myContext from '../../context/data/myContext';
import { Dialog, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { BsSearch } from "react-icons/bs";

function SearchDialog() {
    const context = useContext(myContext);
    const { searchkey, setSearchkey, getAllPost } = context;
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        if (searchkey) {
            const results = getAllPost.filter((post) => {
                const lowerCaseKey = searchkey.toLowerCase();
                const description = post.description ? post.description.toLowerCase() : '';
                return description.includes(lowerCaseKey);
            });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                <BsSearch size={20} />
                Search
            </Button>
            <Dialog open={open} handler={() => setOpen(!open)}>
                <DialogBody>
                    <input
                        type="text"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none"
                        placeholder="Search..."
                        value={searchkey}
                        onChange={(e) => setSearchkey(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                    {searchResults.length > 0 && (
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.id}>
                                    <p>{result.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setOpen(!open)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default SearchDialog;
