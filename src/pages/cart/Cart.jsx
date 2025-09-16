// Cart.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CartItem from "../../components/products/cartItem/CartItem";
import styles from "./cart.module.css";
import { useNavigate } from "react-router-dom";
import { CartOperationsApi } from "../../redux/auth/authApis";
import { useProducts } from "../../redux/products/productsApis";
import {
  useAddBillToUserHistory,
  useUserBillsHistory,
} from "../../redux/bills/billsApi";
import { successMessage, errorMessage } from "../../redux/toasts";

function Cart({ setCheckoutPageKey }) {
  const cartData = useSelector((state) => state?.auth?.user?.cartInfo);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showPerfumeSelection, setShowPerfumeSelection] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedPerfumes, setSelectedPerfumes] = useState({});
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Add bill mutation
  const { mutate: addBill, isLoading: isAddingBill } = useAddBillToUserHistory(
    user?.id
  );
  const {
    data: bills = [],
    isLoading,
    isError,
  } = useUserBillsHistory(user?.id);
  // console.log(bills.length);
  // Fetch products dynamically
  const productsQuery = useProducts();
  const productsData = productsQuery.data;

  // Check if it's user's first order
  const isFirstOrder = bills.length === 0;

  // Calculate discounts
  const calculateDiscounts = () => {
    let discount = 0;
    let discountType = "";

    // First order discount (10%)
    if (isFirstOrder) {
      discount += cartData.totalPrice * 0.1;
      discountType = "First order discount (10%)";
    }
    console.log(isFirstOrder);
    console.log(user?.billsHistory);

    // Discount code (20%)
    if (appliedDiscount) {
      discount += cartData.totalPrice * 0.2;
      discountType =
        appliedDiscount === "PTCU59"
          ? "Discount code PTCU59 (20%)"
          : "Discount code PTCU60 (20%)";
    }

    return {
      amount: discount,
      type: discountType,
      finalPrice: cartData.totalPrice - discount,
    };
  };

  const discounts = calculateDiscounts();

  // Apply discount code
  const applyDiscountCode = () => {
    if (discountCode === "PTCU59" || discountCode === "PTCU60") {
      setAppliedDiscount(discountCode);
      alert(
        `Discount code ${discountCode} applied successfully! 20% discount added.`
      );
    } else {
      alert("Invalid discount code. Please try PTCU59 or PTCU60.");
    }
  };

  // Remove discount code
  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
  };

  // Get perfumes from API data, excluding Discovery set
  const allPerfumes =
    productsData
      ?.filter((product) => product.id !== "Discovery set")
      .map((product) => ({
        id: product.id,
        name: product.name,
        type: product.type,
      })) || [];

  const clearHandler = () =>
    dispatch(CartOperationsApi({ operation: "clear", data: null }));

  // Check if cart contains Discovery set
  const hasDiscoverySet = () => {
    return cartData?.cart?.some(
      (item) => item.product.name === "Discovery set"
    );
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

    // Check if adding this quantity would exceed 6 bottles
    if (totalOthers + newQuantity <= 6) {
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

  // Create bill object for WhatsApp order
  const createWhatsAppBill = () => {
    const billId = `bill_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return {
      id: billId,
      products: cartData.cart.map((item) => ({
        id: item.product.id,
        img: item.product.url,
        title: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      totalPrice: discounts.finalPrice,
      orderDate: new Date().toISOString(),
      location: customerAddress,
      paymentMethod: "WhatsApp",
      status: "pending",
      discount: discounts.amount > 0 ? discounts : null,
    };
  };

  const generateWhatsAppMessage = () => {
    const customerName = user?.username || user?.name || "Valued Customer";
    let message = `🌸 *Darb Perfume Store - New Order* 🌸\n\n`;
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📍 *Address:* ${customerAddress}\n\n`;
    message += `🛍️ *Fragrance Orders:*\n`;

    cartData.cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;

      // Special handling for Discovery set
      if (
        item.product.name === "Discovery set" &&
        Object.keys(selectedPerfumes).length > 0
      ) {
        message += `   🎁 Selected Perfumes:\n`;
        Object.entries(selectedPerfumes).forEach(([perfumeId, quantity]) => {
          const perfume = allPerfumes.find((p) => p.id === perfumeId);
          if (perfume && quantity > 0) {
            message += `      - ${perfume.name} (${perfume.type}) x${quantity}\n`;
          }
        });
        message += `   📦 Total bottles: ${getTotalSelectedBottles()}\n`;
      }

      message += `   💰 Price: ${item.product.price}EGP\n`;
      message += `   🔢 Quantity: ${item.quantity}\n`;
      message += `   💎 Subtotal: $${(
        item.product.price * item.quantity
      ).toFixed(2)}\n\n`;
    });

    // Add discount information
    if (discounts.amount > 0) {
      message += `🎫 *Discount Applied:* ${discounts.type}\n`;
      message += `💰 *Discount Amount:* -$${discounts.amount.toFixed(2)}\n\n`;
    }

    message += `💳 *Total Order Value:* $${discounts.finalPrice.toFixed(
      2
    )}\n\n`;
    message += `✨ Thank you for choosing Darb perfumes! ✨`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = (phoneNumber) => {
    if (!customerAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    // Check if Discovery set is in cart but no perfumes selected
    if (hasDiscoverySet() && getTotalSelectedBottles() === 0) {
      alert("Please select at least one perfume for your Discovery set");
      return;
    }

    // Create and save the bill to user history
    const newBill = createWhatsAppBill();

    addBill(newBill, {
      onSuccess: () => {
        successMessage("Your order has been placed via WhatsApp", {
          position: "bottom-right",
          autoClose: 3000,
        });

        // Send WhatsApp message
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");

        setShowWhatsAppModal(false);
        setShowPerfumeSelection(false);
      },
      onError: (error) => {
        console.error("Error saving WhatsApp order:", error);
        errorMessage("Failed to save order. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      },
    });
  };

  const buyHandler = () => {
    // If cart contains Discovery set, show perfume selection first
    if (hasDiscoverySet()) {
      setShowPerfumeSelection(true);
    } else {
      setShowWhatsAppModal(true);
    }
  };

  return (
    <div className={styles.cartWrapper}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
      </div>

      <section className={styles.page}>
        <div className={`container ${styles.container}`}>
          {/* Header Section */}
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleIcon}>🛍️</span>
                Your Darb Collection
                {cartData?.isEmpty && (
                  <span className={styles.emptyBadge}>Empty</span>
                )}
              </h1>
              {!cartData?.isEmpty && (
                <p className={styles.itemCount}>
                  {cartData.cart.length} exquisite fragrance
                  {cartData.cart.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          {cartData?.isEmpty ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌸</div>
              <h3>Your fragrance collection awaits</h3>
              <p>
                Discover our luxurious perfumes and build your scent journey!
              </p>
              <button
                className={styles.continueShoppingBtn}
                onClick={() => navigate("/market")}
              >
                Explore Darb Fragrances
              </button>
            </div>
          ) : (
            <>
              {/* cartItems */}
              <div className={styles.cartContent}>
                <div className={styles.itemsList}>
                  {cartData.cart.map((p, index) => (
                    <div
                      key={p.product.id}
                      className={styles.itemWrapper}
                      style={{ "--delay": `${index * 0.1}s` }}
                    >
                      <CartItem
                        data={p.product}
                        quantity={p.quantity}
                        setCheckoutPageKey={setCheckoutPageKey}
                      />
                    </div>
                  ))}
                </div>

                {/* Cart Summary Sidebar */}
                <div className={styles.cartSummary}>
                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Fragrance Summary</h3>

                    <div className={styles.summaryDetails}>
                      <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${cartData.totalPrice}</span>
                      </div>

                      {/* Discount Code Section */}
                      <div className={styles.discountSection}>
                        <div className={styles.discountInput}>
                          <input
                            type="text"
                            placeholder="Enter discount code"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            disabled={appliedDiscount !== null}
                          />
                          {appliedDiscount ? (
                            <button
                              className={styles.removeDiscountBtn}
                              onClick={removeDiscountCode}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className={styles.applyDiscountBtn}
                              onClick={applyDiscountCode}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                        {appliedDiscount && (
                          <div className={styles.discountApplied}>
                            Discount code {appliedDiscount} applied (20% off)
                          </div>
                        )}
                      </div>

                      {/* Discounts Display */}
                      {discounts.amount > 0 && (
                        <>
                          <div className={styles.summaryRow}>
                            <span>Discounts</span>
                            <span className={styles.discount}>
                              -${discounts.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className={styles.discountNote}>
                            {discounts.type}
                          </div>
                        </>
                      )}

                      {/* <div className={styles.summaryRow}>
                        <span>Delivery</span>
                        <span className={styles.free}>Free in Cairo</span>
                      </div> */}
                      <div className={styles.summaryDivider}></div>
                      <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>Total</span>
                        <span>${discounts.finalPrice.toFixed(2)}</span>
                      </div>

                      {/* First order discount notification */}
                      {isFirstOrder && !appliedDiscount && (
                        <div className={styles.firstOrderNote}>
                          🎉 You qualify for a 10% first order discount!
                        </div>
                      )}
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        className={styles.buyAllBtn}
                        onClick={buyHandler}
                        disabled={isAddingBill}
                      >
                        <span className={styles.btnIcon}>💬</span>
                        {isAddingBill ? "Processing..." : "Order via WhatsApp"}
                      </button>
                      <button
                        className={styles.clearBtn}
                        onClick={clearHandler}
                      >
                        <span className={styles.btnIcon}>🗑️</span>
                        Clear Collection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* WhatsApp Order Modal */}
      {showWhatsAppModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>🌸 Complete Your Darb Order</h3>
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
                <h4>📦 Your Fragrance Order:</h4>
                {cartData.cart.map((item, index) => (
                  <div key={item.product.id} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.product.name}</span>
                    <span className={styles.itemDetails}>
                      ${item.product.price} × {item.quantity} = $
                      {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Discount information in modal */}
                {discounts.amount > 0 && (
                  <>
                    <div className={styles.orderItem}>
                      <span className={styles.itemName}>Discount</span>
                      <span className={styles.itemDetails}>
                        -${discounts.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.discountNoteModal}>
                      {discounts.type}
                    </div>
                  </>
                )}

                <div className={styles.orderTotal}>
                  <strong>Total: ${discounts.finalPrice.toFixed(2)}</strong>
                </div>
              </div>

              <div className={styles.whatsappSection}>
                <p>📱 Choose a WhatsApp number to send your order:</p>
                <div className={styles.whatsappButtons}>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201015310668")}
                    disabled={isAddingBill}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    {isAddingBill ? "Processing..." : "+20 101 531 0668"}
                  </button>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201149260444")}
                    disabled={isAddingBill}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    {isAddingBill ? "Processing..." : "+20 114 926 0444"}
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

      {/* Enhanced Perfume Selection Modal for Discovery Set */}
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
                  Your Discovery Set can contain up to 6 perfume bottles. Choose
                  your favorites and quantities:
                </p>
                <div className={styles.selectionCounter}>
                  Selected: {getTotalSelectedBottles()} / 6 bottles
                </div>
              </div>

              <div className={styles.perfumeGrid}>
                {allPerfumes.map((perfume) => {
                  const quantity = selectedPerfumes[perfume.id] || 0;
                  const isMaxReached = getTotalSelectedBottles() >= 6;

                  return (
                    <div
                      key={perfume.id}
                      className={`${styles.perfumeOption} ${
                        quantity > 0 ? styles.selected : ""
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
                          disabled={quantity === 0}
                        >
                          -
                        </button>
                        <span className={styles.quantityDisplay}>
                          {quantity}
                        </span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handlePerfumeQuantityChange(perfume.id, 1)
                          }
                          disabled={isMaxReached && quantity === 0}
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
                  Confirm Selection ({getTotalSelectedBottles()}/6)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
