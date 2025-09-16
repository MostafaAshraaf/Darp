import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./cartItem.module.css";
import { useDispatch } from "react-redux";
import { CartOperationsApi } from "../../../redux/auth/authApis";
import { useProducts } from "../../../redux/products/productsApis";

function CartItem({ data, quantity, setCheckoutPageKey }) {
  const { id, name, price, url } = data;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showPerfumeSelection, setShowPerfumeSelection] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedPerfumes, setSelectedPerfumes] = useState({});

  // Fetch products dynamically
  const productsQuery = useProducts();
  const productsData = productsQuery.data;

  // Get perfumes from API data, excluding Discovery set
  const allPerfumes =
    productsData
      ?.filter((product) => product.id !== "Discovery set")
      .map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
      })) || [];

  const productInfoHandler = () => {
    navigate(`/market/${id}`, { state: { selectedProduct: data } });
  };

  // Check if this is a Discovery set
  const isDiscoverySet = () => {
    return name === "Discovery set";
  };

  // Get total selected perfume bottles
  const getTotalSelectedBottles = () => {
    return Object.values(selectedPerfumes).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  // Handle perfume quantity selection for Discovery set
  const handlePerfumeQuantityChange = (perfumeId, change) => {
    const currentQuantity = selectedPerfumes[perfumeId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    const totalOthers = getTotalSelectedBottles() - currentQuantity;

    // Check if adding this quantity would exceed 6 bottles per Discovery set
    const maxBottlesPerSet = 6 * quantity; // Total allowed bottles for all Discovery sets
    if (totalOthers + newQuantity <= maxBottlesPerSet) {
      setSelectedPerfumes((prev) => ({
        ...prev,
        [perfumeId]: newQuantity,
      }));

      // Remove perfume if quantity is 0
      if (newQuantity === 0) {
        const updatedPerfumes = { ...selectedPerfumes };
        delete updatedPerfumes[perfumeId];
        setSelectedPerfumes(updatedPerfumes);
      }
    }
  };

  const generateWhatsAppMessage = () => {
    const customerName = user?.username || user?.name || "Valued Customer";
    let message = `🌸 *Darb Perfume Store - Individual Order* 🌸\n\n`;
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📍 *Address:* ${customerAddress}\n\n`;
    message += `🛍️ *Fragrance Order:*\n`;
    message += `*${name}*\n`;

    // Special handling for Discovery set
    if (isDiscoverySet() && Object.keys(selectedPerfumes).length > 0) {
      message += `   🎁 Selected Perfumes:\n`;
      Object.entries(selectedPerfumes).forEach(([perfumeId, perfumeQuantity]) => {
        const perfume = allPerfumes.find((p) => p.id === perfumeId);
        if (perfume && perfumeQuantity > 0) {
          message += `      - ${perfume.name} (${perfume.type}) x${perfumeQuantity}\n`;
        }
      });
      message += `   📦 Total bottles: ${getTotalSelectedBottles()}\n`;
    }

    message += `💰 Price: $${price}\n`;
    message += `🔢 Quantity: ${quantity}\n`;
    message += `💎 Total: $${(price * quantity).toFixed(2)}\n\n`;
    message += `✨ Thank you for choosing Darb perfumes! ✨`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = (phoneNumber) => {
    if (!customerAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    // Check if Discovery set but no perfumes selected
    if (isDiscoverySet() && getTotalSelectedBottles() === 0) {
      alert("Please select at least one perfume for your Discovery set");
      return;
    }

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setShowWhatsAppModal(false);
    setShowPerfumeSelection(false);
  };

  const buyHandler = () => {
    // If this is a Discovery set, show perfume selection first
    if (isDiscoverySet()) {
      setShowPerfumeSelection(true);
    } else {
      setShowWhatsAppModal(true);
    }
  };

  const removeHandler = () => {
    dispatch(CartOperationsApi({ operation: "remove", data: id }));
  };

  const increaseHandler = () => {
    dispatch(CartOperationsApi({ operation: "increase", data: id }));
  };

  const decreaseHandler = () => {
    dispatch(CartOperationsApi({ operation: "decrease", data: id }));
  };

  return (
    <>
      <div className={styles.cartItem} id={id}>
        {/* Product Image */}
        <div className={styles.imageContainer} onClick={productInfoHandler}>
          <div className={styles.imageWrapper}>
            <img src={url} alt={name} className={styles.productImage} />
          </div>
          <div className={styles.viewOverlay}>
            <span className={styles.viewIcon}>🌸</span>
            <span>View Fragrance</span>
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h3 className={styles.productName} onClick={productInfoHandler}>
              {name}
            </h3>
            <button className={styles.removeBtn} onClick={removeHandler}>
              <span className={styles.removeIcon}>✕</span>
            </button>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.priceLabel}>Fragrance Price</span>
            <span className={styles.unitPrice}>${price}</span>
          </div>

          {/* Quantity Controls */}
          <div className={styles.quantitySection}>
            <span className={styles.quantityLabel}>Order</span>
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityBtn}
                onClick={decreaseHandler}
                disabled={quantity <= 1}
              >
                <span>−</span>
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button className={styles.quantityBtn} onClick={increaseHandler}>
                <span>+</span>
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalPrice}>
              ${(price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.buyNowBtn} onClick={buyHandler}>
              <span className={styles.btnIcon}>💬</span>
              Order via WhatsApp
            </button>
          </div>
        </div>

        {/* Hover Effects */}
        <div className={styles.hoverGlow}></div>
      </div>

      {/* Perfume Selection Modal for Discovery Set */}
      {showPerfumeSelection && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: "800px" }}>
            <div className={styles.modalHeader}>
              <h3>🌸 Select Perfumes for Your Discovery Set</h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowPerfumeSelection(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.selectionInfo}>
                <p>
                  Each Discovery Set can contain up to 6 perfume bottles. You have {quantity} set(s), 
                  so you can select up to {6 * quantity} bottles total. Choose your favorites and quantities:
                </p>
                <div className={styles.selectionCounter}>
                  Selected: {getTotalSelectedBottles()} / {6 * quantity} bottles
                </div>
              </div>

              <div className={styles.perfumeGrid}>
                {allPerfumes.map((perfume) => {
                  const perfumeQuantity = selectedPerfumes[perfume.id] || 0;
                  const isMaxReached = getTotalSelectedBottles() >= 6 * quantity;

                  return (
                    <div
                      key={perfume.id}
                      className={`${styles.perfumeOption} ${
                        perfumeQuantity > 0 ? styles.selected : ""
                      }`}
                    >
                      <div className={styles.perfumeInfo}>
                        <span className={styles.perfumeName}>
                          {perfume.name}
                        </span>
                        <span className={styles.perfumeType}>
                          {perfume.type}
                        </span>
                      </div>

                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handlePerfumeQuantityChange(perfume.id, -1)
                          }
                          disabled={perfumeQuantity === 0}
                        >
                          -
                        </button>
                        <span className={styles.quantityDisplay}>
                          {perfumeQuantity}
                        </span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handlePerfumeQuantityChange(perfume.id, 1)
                          }
                          disabled={isMaxReached && perfumeQuantity === 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.selectionActions}>
                <button
                  className={styles.confirmSelectionBtn}
                  onClick={() => {
                    if (getTotalSelectedBottles() > 0) {
                      setShowPerfumeSelection(false);
                      setShowWhatsAppModal(true);
                    } else {
                      alert(
                        "Please select at least one perfume for your Discovery set"
                      );
                    }
                  }}
                  disabled={getTotalSelectedBottles() === 0}
                >
                  Confirm Selection ({getTotalSelectedBottles()}/{6 * quantity})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Order Modal */}
      {showWhatsAppModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>🌸 Order {name}</h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowWhatsAppModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.addressSection}>
                <label htmlFor="address">📍 Delivery Address:</label>
                <textarea
                  id="address"
                  placeholder="Please enter your complete delivery address in Cairo..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={styles.addressInput}
                  rows={3}
                />
              </div>

              <div className={styles.orderSummary}>
                <h4>📦 Your Fragrance:</h4>
                <div className={styles.orderItem}>
                  <span className={styles.itemName}>{name}</span>
                  <span className={styles.itemDetails}>
                    ${price} × {quantity} = ${(price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Show selected perfumes for Discovery set */}
                {isDiscoverySet() && Object.keys(selectedPerfumes).length > 0 && (
                  <div className={styles.selectedPerfumesDisplay}>
                    <h5>Selected Perfumes:</h5>
                    {Object.entries(selectedPerfumes).map(([perfumeId, perfumeQuantity]) => {
                      const perfume = allPerfumes.find((p) => p.id === perfumeId);
                      if (perfume && perfumeQuantity > 0) {
                        return (
                          <div key={perfumeId} className={styles.selectedPerfumeItem}>
                            <span>{perfume.name} ({perfume.type})</span>
                            <span>x{perfumeQuantity}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                    <div className={styles.totalBottles}>
                      Total bottles: {getTotalSelectedBottles()}
                    </div>
                  </div>
                )}

                <div className={styles.orderTotal}>
                  <strong>Total: ${(price * quantity).toFixed(2)}</strong>
                </div>
              </div>

              <div className={styles.whatsappSection}>
                <p>📱 Choose a WhatsApp number to send your order:</p>
                <div className={styles.whatsappButtons}>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201015310668")}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    +20 101 531 0668
                  </button>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201149260444")}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    +20 114 926 0444
                  </button>
                </div>
                <p className={styles.whatsappNote}>
                  💡 You can message either number or both. We'll respond
                  quickly to confirm your order!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartItem;