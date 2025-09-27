import axios from "axios";
import { useEffect, useState } from "react";

const Filters = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_DATABASEURL}/travel-db/category.json`);
            let arr = [];
            for (let key in response.data) {
                arr.push(response.data[key].categoryName)
            }
            setOptions(arr)
            console.log(arr);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    useEffect(() => {
        loadCategories();
    }, [])

    return (
        <select name="" id="" className="filter-select">
            {options.map((option, index) => <option key={`option-${index}`} value={option}>{option}</option>)}
        </select>
    )
}

export default Filters