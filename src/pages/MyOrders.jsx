import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../lib/api";
import { useDispatch, useSelector } from "../hooks/AppContext";
import { motion } from "motion/react";
import Loader from "../components/Common/Loader";
import { MdDelete } from "react-icons/md";
import moment from "moment/moment";
import Swal from "sweetalert2";
import ErrorPage from "./ErrorPage";
import { UPDATE_FOOD } from "../reducers/reducer";


function MyOrders() {
  const user = useSelector((state) => state.user);
  const allFoods = useSelector((state) => state.foods.data);
  const dispatch=useDispatch()
  const [myOrders, setMyOrders] = useState({
    loading: true,
    error: null,
    data: [],
  });
  const userEmail = user?.data?.email;
  useEffect(() => {
    setMyOrders((prev) => ({ ...prev, loading: true }));
    api
      .get(`/myorders?email=${userEmail}`)
      .then((res) => {
        setMyOrders((prev) => ({
          ...prev,
          loading: false,
          data: res.data,
        }));
      })
      .catch((err) => {
        setMyOrders((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      });
  }, [userEmail]);
  if (myOrders.error) {
    return <ErrorPage message={myOrders.error} />;
  }
  if (myOrders.loading) {
    return <Loader />;
  }
  if (!myOrders.data.length) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h2 className="text-3xl text-center">
          You don't purchased any food yet...
        </h2>
      </div>
    );
  }
  const handleDelete = (deleteItem) => {
    const {_id:id,foodId,quantity}=deleteItem
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this Order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/myorders/${id}?foodId=${foodId}&quantity=${quantity}`)
          .then((res) => {
            if (res.data.deletedCount) {
              const removeItem = myOrders?.data.filter(
                (item) => item._id !== id
              );
              setMyOrders({ ...myOrders, data: removeItem });
            }
            const updateQuantity=allFoods.map((item)=>{
              if (item._id!==foodId) {
                return item
              }
              return {
                ...item, quantity:item.quantity+quantity,purchaseCount:item.purchaseCount-quantity
              }
            })
            dispatch({type:UPDATE_FOOD,payload:updateQuantity})
            Swal.fire({
              title: "Canceled!",
              text: "Your Order has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err?.message || "Something went wrong!",
            });
          });
      }
    });
  };

  return (
    <section className="pt-10">
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl text-center font-bold mb-6"
      >
        Your Purchased Foods
      </motion.h3>
      <div className="divider"></div>
      <div className="overflow-x-auto max-w-5xl mx-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Food Image</th>
              <th>Food Name</th>
              <th>Price</th>
              <th>Food Owner</th>
              <th>Purchase Time</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...myOrders.data]?.reverse().map((item) => {
              return (
                <tr key={item._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={item.foodImage}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.foodName}</td>
                  <td>{item.price}$</td>
                  <td>
                    {item.buyerName}
                    <br />({item.buyerEmail})
                  </td>
                  <td>
                    {moment(item.buyingDate).format("Do MMMM YYYY, h:mm a")}
                  </td>
                  <td className="text-center">{item.quantity}p</td>
                  <th>
                    <button
                      onClick={() => handleDelete(item)}
                      className="btn btn-ghost btn-xs"
                    >
                      <MdDelete size={20} />
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MyOrders;
