import styles from "./ProductInfo.module.css";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../../../redux/products/productsApis";
import { useSelector } from "react-redux";
import Review from "../review/Review";
import PostReviewCon from "../postsAndReviewsContainer/PostReviewCon";

const ProductInfo = () => {
  const { id: productid } = useParams();
  const navigate = useNavigate();
  const { data, isPending, error } = useProductById(productid);
  const cartData = useCart(data);

  const userRole = useSelector((state) => state?.auth?.user?.role);

  // Loading state
  if (isPending)
    return <div className={styles.loading}>Loading your fragrance...</div>;

  // Error state
  if (error)
    return <div className={styles.error}>Error loading fragrance details.</div>;

  // No data
  if (!data) return <div className={styles.error}>Fragrance not found.</div>;

  const {
    id,
    name,
    brand,
    desc,
    inspiredBy,
    price,
    maxQuantity,
    sales,
    url,
    reviews,
    rating,
  } = data;

  const { inCart, addToCartHandler, removeFromCartHandler } = cartData || {};

  const stockStatus =
    maxQuantity > 5
      ? "In Stock"
      : maxQuantity === 0
      ? "Out of Stock"
      : `Only ${maxQuantity} left`;

  const stockClass =
    maxQuantity > 5
      ? styles.available
      : maxQuantity === 0
      ? styles.notAvailable
      : styles.lowStock;

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={styles.star} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={styles.star} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.emptyStar} />);
    }

    return stars;
  };

  const fieldsToDisplay = [
    { label: "Fragrance", value: name },
    { label: "Brand", value: brand },
    { label: "Description", value: desc },
    { label: "Inspired by: ", value: inspiredBy },
    // { label: "Price", value: `$${price}` },
    { label: "Bottles Sold", value: sales },
  ].filter(({ value }) => value && value.toString().toLowerCase() !== "none");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={`${styles.imageContainer}`}>
            <div className={styles.imageWrapper}>
              <img src={url} alt={name} className={styles.productImage} />
            </div>
          </div>

          <div className={`${styles.infoContainer}`}>
            <div className={styles.header}>
              <h1 className={styles.title}>{name}</h1>
              <div className={styles.brandTag}>{brand}</div>
            </div>

            <div className={styles.stockStatus}>
              <span className={styles.stockLabel}>Availability:</span>
              <span className={`${styles.stockValue} ${stockClass}`}>
                {stockStatus}
              </span>
            </div>

            <div className={styles.fieldsGrid}>
              {fieldsToDisplay.map(({ label, value }) => (
                <div key={label} className={styles.field}>
                  <span className={styles.label}>{label}:</span>
                  <span className={styles.value}>{value}</span>
                </div>
              ))}
            </div>

            {/* Rating section in info */}
            {rating && (
              <div className={styles.ratingSection}>
                <span className={styles.label}>Customer Rating:</span>
                <div className={styles.ratingInfo}>
                  <div className={styles.starsContainer}>
                    {renderStars(rating)}
                  </div>
                  <span className={styles.ratingText}>
                    {rating} out of 5 stars
                  </span>
                  {reviews && reviews.length > 0 && (
                    <span className={styles.reviewCount}>
                      ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className={styles.priceContainer}>
              <div className={styles.price}>${price}</div>
              <button
                className={`${styles.button} ${
                  inCart ? styles.remove : styles.add
                }`}
                onClick={
                  ["admin"].includes(userRole)
                    ? () =>
                        navigate(
                          `/${
                            userRole === "admin"
                              ? "market_management"
                              : "market"
                          }`
                        )
                    : inCart
                    ? removeFromCartHandler
                    : addToCartHandler
                }
              >
                <FaShoppingCart className="mr-2" />
                {["admin"].includes(userRole)
                  ? "Return To Store"
                  : inCart
                  ? "Remove from cart"
                  : "Add to cart"}
              </button>
            </div>
            {!["admin"].includes(userRole) && (
              <button
                onClick={() => navigate(-1)}
                className={styles.backButton}
                aria-label="Back to Store"
              >
                <FaArrowLeft className="mr-2" />
                Back to Store
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`${styles.productReviewsContainer}`}>
        <PostReviewCon
          title="Fragrance Reviews"
          data={reviews || []}
          Component={Review}
          type="review"
        />
      </div>
    </div>
  );
};

export default ProductInfo;
