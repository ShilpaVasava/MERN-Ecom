"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/slice/productsSlice";
import Image from "next/image";

const categories = ["Electronics", "Clothing", "Books", "Toys"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  console.log(items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products?.filter(
    (p) =>
      
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "" || p.category?.name === filter)
  );
    console.log(filteredProducts);
  useEffect(() => {

    if(items?.products?.length > 0){
      setProducts(items?.products);
    }
  }, [items]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Product List</h2>

      <div className="flex justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredProducts?.map((product, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{product?.name}</h3>
            <Image src={product?.imageURL || "/images/defaultmg.jpg"} alt={product?.name} width={400} height={200} />
            <p className="text-lg font-bold mb-2">${product?.price}</p>
            <button
              className={`w-full py-2 px-4 rounded ${
                product?.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
