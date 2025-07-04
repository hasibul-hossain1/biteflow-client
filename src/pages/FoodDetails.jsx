import React from "react";
import { useSelector } from "../hooks/AppContext";
import { Link, useParams } from "react-router";

const FoodDetails = () => {
  const foods = useSelector((state) => state.foods);
  const {id}=useParams()
  const food=foods?.data.find((item)=>item._id===id)

  // const handlePurchase = () => {
  //   alert(`Purchased "${food.foodName}" for $${food.price}`);
  //   // In real usage, this would be a POST request to your backend
  // };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-base-100 shadow-xl rounded-xl p-6 space-y-6">
        <img
          src={food.foodImage}
          alt={food.foodName}
          className="w-full h-64 object-cover rounded-lg"
        />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{food.foodName}</h1>
          <p>{food.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <p><span className="font-semibold">Category:</span> {food.foodCategory}</p>
            <p><span className="font-semibold">Origin:</span> {food.foodOrigin}</p>
            <p><span className="font-semibold">Available Quantity:</span> {food.quantity}</p>
            <p><span className="font-semibold">Times Purchased:</span> {food.purchaseCount}</p>
            <p><span className="font-semibold">Price:</span> ${food.price.toFixed(2)}</p>
            <p><span className="font-semibold">Added by:</span> {food.addedBy.name} ({food.addedBy.email})</p>
          </div>
        </div>

        <Link to={`/purchase/${food._id}`} className="btn btn-primary w-full">
          Purchase
        </Link>
      </div>
    </section>
  );
};

export default FoodDetails;
