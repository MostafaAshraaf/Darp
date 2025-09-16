import { useNavigate } from "react-router-dom";
import styles from "./productCard.module.css";
import useCart from "../../../hooks/useCart";
import React from "react"; 
import { useSelector } from "react-redux";

function ProductCard({ data, children }) {
  const { id, name, desc, sales, price, url, type } = data;
  const { inCart, addToCartHandler, removeFromCartHandler } = useCart(data);

  const userRole = useSelector((state) => state?.auth?.user?.role);

  const navigate = useNavigate();

  const productInfoHandler = () => navigate(`/market/${id}`);

  // Determine badge styling based on perfume type
  const getTypeBadgeStyle = () => {
    return type === "Men's perfume" 
      ? `${styles.type_badge} ${styles.men_badge}`
      : `${styles.type_badge} ${styles.women_badge}`;
  };

  // Get appropriate icon for the type
  const getTypeIcon = () => {
    return type === "Men" ;
  };

  return (
    <div className={styles.box} id={id}>
      <div className={styles.image_con} onClick={productInfoHandler}>
        <div className={styles.top}>
          <div className={getTypeBadgeStyle()}>
            <span className={styles.type_icon}>{getTypeIcon()}</span>
            {type}
          </div>
        </div>
        <img src={url} className={styles.product_image} alt={name} />
      </div>
      <div className={styles.data}>
        <h2 className={styles.box_title} onClick={productInfoHandler}>
          {name}
        </h2>
        <p className={styles.desc}>{desc.slice(0, 50)}...</p>
        <p className={styles.sales}>Sold: {sales} bottles</p>
        <div className={styles.main}>
          <p className={styles.price}>{price} EGP</p>
          {userRole === "admin" ? (
            children
          ) : (
            <button
              className={`${styles.cart_btn} ${inCart ? styles.add_to_cart : styles.remove_from_cart}`}
              onClick={["admin"].includes(userRole) ? productInfoHandler : inCart ? removeFromCartHandler : addToCartHandler}
            >
              {["admin"].includes(userRole) ? "More Details" : inCart ? "Remove from cart" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);