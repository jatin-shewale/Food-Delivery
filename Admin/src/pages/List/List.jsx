import React, { useEffect, useState } from 'react'
import "./List.css"
import axios from "axios";
import { toast } from 'react-toastify';

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);

    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error");
    }
  }

  const removeFood = async(foodId) => {
      const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
      await fetchList();
  
      if(response.status === 200) {
        toast.success("Food removed successfully");
      } else {
        toast.error("Food removal failed, retry again");
      }
  }
  
  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All food list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/`+ item.image} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'>Remove</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List;
