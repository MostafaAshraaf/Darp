import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaChevronRight,
  FaUser,
  FaSprayCan,
  FaShoppingCart,
  FaTruck,
  FaGift,
  FaHeart,
  FaLeaf,
  FaCrown,
  FaGem
} from "react-icons/fa";
import styles from './home.module.css';
import { useProducts } from "../../redux/products/productsApis";
// import logo from "logo.png";
const Home = () => {
  const [selectedReview, setSelectedReview] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const productsQuery = useProducts();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateToMarket = () => {
    navigate('/market');
  };

  // Get top 3 best-selling products
  const getTopSellingProducts = () => {
    if (!productsQuery.data) return [];
    
    // Sort products by sales in descending order and take top 3
    return [...productsQuery.data]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);
  };

  const reviews = [
    {
      name: "Sarah Ahmed",
      review: "Darb has the most exquisite collection of perfumes! The quality is outstanding and the scents last all day long.",
      stars: 5,
    },
    {
      name: "Omar Hassan",
      review: "Amazing customer service and authentic fragrances. The online shopping experience is seamless and delivery is super fast.",
      stars: 5,
    },
    {
      name: "Layla Mahmoud",
      review: "I've been shopping at Darb for months now. Their perfume selection is unmatched and prices are very competitive.",
      stars: 5,
    },
  ];

  const services = [
    {
      icon: <FaShoppingCart className={styles.serviceIcon} />,
      title: "Premium Shopping",
      description: "Browse our curated collection of luxury fragrances with secure checkout and white-glove delivery service.",
      color: styles.gradientAmber,
      iconBg: styles.iconBgAmber
    },
    {
      icon: <FaLeaf className={styles.serviceIcon} />,
      title: "Fragrance Consultation",
      description: "Personal scent profiling with our master perfumers to discover your signature fragrance journey.",
      color: styles.gradientEmerald,
      iconBg: styles.iconBgEmerald
    },
    {
      icon: <FaGift className={styles.serviceIcon} />,
      title: "Luxury Packaging",
      description: "Elegant gift presentation with handcrafted boxes and personalized messages for special occasions.",
      color: styles.gradientRose,
      iconBg: styles.iconBgRose
    },
    {
      icon: <FaTruck className={styles.serviceIcon} />,
      title: "Express Delivery",
      description: "Temperature-controlled delivery ensuring your fragrances arrive in pristine condition within 24 hours.",
      color: styles.gradientBlue,
      iconBg: styles.iconBgBlue
    }
  ];

  const values = [
    {
      title: "Authenticity",
      description: "Every fragrance is sourced directly from authorized distributors with certificates of authenticity.",
      icon: <FaGem className={styles.valueIcon} />,
      gradient: styles.gradientAmberYellow
    },
    {
      title: "Quality Excellence",
      description: "Rigorous quality control ensures each bottle meets our premium standards for longevity and projection.",
      icon: <FaCrown className={styles.valueIcon} />,
      gradient: styles.gradientEmeraldTeal
    },
    {
      title: "Customer Care",
      description: "Dedicated fragrance consultants provide personalized service and expert recommendations.",
      icon: <FaHeart className={styles.valueIcon} />,
      gradient: styles.gradientRosePink
    }
  ];

  const workSteps = [
    {
      step: 1,
      title: "Create Profile",
      description: "Join our fragrance community",
      icon: <FaUser className={styles.stepIcon} />,
      delay: "0s"
    },
    {
      step: 2,
      title: "Explore Collection",
      description: "Discover premium fragrances",
      icon: <FaSprayCan className={styles.stepIcon} />,
      delay: "0.2s"
    },
    {
      step: 3,
      title: "Select & Customize",
      description: "Choose your perfect scent",
      icon: <FaShoppingCart className={styles.stepIcon} />,
      delay: "0.4s"
    },
    {
      step: 4,
      title: "Premium Delivery",
      description: "Receive with luxury packaging",
      icon: <FaTruck className={styles.stepIcon} />,
      delay: "0.6s"
    },
  ];

  // Use real product data instead of static data
  const featuredPerfumes = getTopSellingProducts().map((product, index) => ({
    fullname: product.name,
    specialty: product.inspiredBy,
    bio: product.desc,
    isHighlighted: index === 0, // Highlight the first (best-selling) product
    price: `${product.price}EGP`,
    rating: parseFloat(product.rating) || 0 // Use actual rating or default
  }));

  return (
    <div className={styles.container}>
      {/* Floating Background Elements */}
      <div className={styles.floatingBackground}>
        <div className={`${styles.floatingCircle} ${styles.circleAmber}`}></div>
        <div className={`${styles.floatingCircle} ${styles.circleEmerald}`}></div>
        <div className={`${styles.floatingCircle} ${styles.circleRose}`}></div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <FaGem className={styles.badgeIcon} />
                Premium Fragrance Collection
              </div>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroTitleGradient}>Discover</span><br />
                <span>Your</span>{' '}
                <span className={styles.heroTitleGradientEmerald}>Signature</span><br />
                <span>at</span>{' '}
                <span className={styles.heroTitleGradientDarb}>Darb</span>
              </h1>
              <p className={styles.heroDescription}>
                Immerse yourself in the world's finest fragrances. From rare oud to delicate florals, 
                find your perfect scent and create lasting memories.
              </p>
              <div className={styles.heroButtons}>
                <button className={styles.exploreButton} onClick={handleNavigateToMarket}>
                  <span className={styles.buttonContent}>
                    Explore Collection <FaChevronRight className={styles.buttonIcon} />
                  </span>
                </button>
              </div>
            </div>
            
            <div className={styles.heroImage}>
              <div className={styles.cardContainer}>
                <div 
                  className={styles.mainCard}
                  style={{ transform: `translateY(${scrollY * 0.02}px)` }}
                >
                  <div className={styles.cardGlow}></div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardIconContainer}>
                      <img src="/logo.png" alt="DARB"  className={styles.cardIcon}/>
                      {/* <FaSprayCan className={styles.cardIcon} /> */}
                    </div>
                    <div className={styles.cardTitle}>
                      Welcome to Darb
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardInfoLabel}>Premium Since</div>
                      <div className={styles.cardInfoYear}>2024</div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.accentCircle} ${styles.accentRose}`}></div>
                <div className={`${styles.accentCircle} ${styles.accentBlue}`}></div>
                <div className={`${styles.accentCircle} ${styles.accentPurple}`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.worksSection}>
        <div className={styles.worksContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              Simple Process
            </div>
            <h2 className={styles.sectionTitle}>
              How It <span className={styles.sectionTitleGradient}>Works</span>
            </h2>
            <p className={styles.sectionDescription}>
              Experience luxury fragrance shopping in four simple steps
            </p>
          </div>
          
          <div className={styles.worksGrid}>
            {workSteps.map((step, index) => (
              <div
                key={index}
                className={styles.workStep}
                style={{ animationDelay: step.delay }}
              >
                {index < workSteps.length - 1 && (
                  <div className={styles.connectionLine}></div>
                )}
                <div className={styles.stepContent}>
                  <div className={styles.stepIconContainer}>
                    <div className={styles.stepIcon}>
                      {step.icon}
                    </div>
                  </div>
                  <div className={styles.stepNumber}>
                    {step.step}
                  </div>
                </div>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeAmber}>
              Premium Services
            </div>
            <h2 className={styles.sectionTitle}>
              Our <span className={styles.sectionTitleGradientEmerald}>Services</span>
            </h2>
            <p className={styles.sectionDescription}>
              Elevating your fragrance journey with personalized luxury experiences
            </p>
          </div>
          
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div
                key={index}
                className={`${styles.serviceCard} ${service.color}`}
              >
                <div className={styles.serviceCardOverlay}></div>
                <div className={styles.serviceContent}>
                  <div className={`${styles.serviceIconContainer} ${service.iconBg}`}>
                    {service.icon}
                  </div>
                  <h3 className={styles.serviceTitle}>
                    {service.title}
                  </h3>
                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                  <div className={styles.serviceLink}>
                    Learn More 
                    <FaChevronRight className={styles.serviceLinkIcon} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Perfumes Section */}
      <section className={styles.perfumesSection}>
        <div className={styles.perfumesContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeRose}>
              Featured Collection
            </div>
            <h2 className={styles.sectionTitle}>
              Signature <span className={styles.sectionTitleGradientRose}>Fragrances</span>
            </h2>
          </div>
          
          <div className={styles.perfumesGrid}>
            {productsQuery.isPending ? (
              // Show loading state while data is being fetched
              <div className={styles.loadingMessage}>Loading featured perfumes...</div>
            ) : productsQuery.error ? (
              // Show error message if there's an error
              <div className={styles.errorMessage}>Error loading perfumes. Please try again later.</div>
            ) : (
              // Show actual products when data is available
              featuredPerfumes.map((perfume, index) => (
                <div
                  key={index}
                  className={`${styles.perfumeCard} ${perfume.isHighlighted ? styles.perfumeCardHighlighted : ''}`}
                >
                  {perfume.isHighlighted && (
                    <div className={styles.bestsellerBadge}>
                      ⭐ BESTSELLER
                    </div>
                  )}
                  <div className={styles.perfumeContent}>
                    <div className={styles.perfumeIconContainer}>
                      <div className={styles.perfumeInnerIcon}>
                        <FaSprayCan className={styles.perfumeIcon} />
                      </div>
                      <div className={styles.perfumeAccentCircle}></div>
                    </div>
                    <h3 className={styles.perfumeTitle}>
                      {perfume.fullname}
                    </h3>
                    <p className={styles.perfumeSpecialty}>
                      {perfume.specialty}
                    </p>
                    <p className={styles.perfumeDescription}>
                      {perfume.bio}
                    </p>
                    <div className={styles.perfumeInfo}>
                      <div className={styles.perfumePrice}>
                        {perfume.price}
                      </div>
                      <div className={styles.perfumeRating}>
                        <FaStar className={styles.starIcon} />
                        <span>{perfume.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <div className={styles.reviewsContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeWhite}>
              Customer Stories
            </div>
            <h2 className={styles.sectionTitleWhite}>
              What Our <span className={styles.sectionTitleGradientAmber}>Clients Say</span>
            </h2>
          </div>
          
          <div className={styles.reviewsGrid}>
            <div className={styles.reviewsList}>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className={`${styles.reviewItem} ${selectedReview === index ? styles.reviewItemActive : ''}`}
                  onClick={() => setSelectedReview(index)}
                >
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>
                      <FaUser className={styles.reviewAvatarIcon} />
                    </div>
                    <div className={styles.reviewInfo}>
                      <h4 className={styles.reviewName}>
                        {review.name}
                      </h4>
                      <p className={styles.reviewProfession}>{review.profession}</p>
                    </div>
                    <div className={`${styles.reviewIndicator} ${selectedReview === index ? styles.reviewIndicatorActive : ''}`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.reviewContent}>
              <div className={styles.reviewCard}>
                <div className={styles.reviewQuote}>"</div>
                <p className={styles.reviewText}>
                  {reviews[selectedReview].review}
                </p>
                <div className={styles.reviewStars}>
                  {[...Array(reviews[selectedReview].stars)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={styles.starIcon}
                    />
                  ))}
                </div>
                <div className={styles.reviewAuthor}>
                  — {reviews[selectedReview].name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeEmerald}>
              Our Commitment
            </div>
            <h2 className={styles.sectionTitle}>
              Core <span className={styles.sectionTitleGradientEmerald}>Values</span>
            </h2>
          </div>
          
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div
                key={index}
                className={styles.valueCard}
              >
                <div className={styles.valueCardOverlay}></div>
                <div className={styles.valueContent}>
                  <div className={`${styles.valueIconContainer} ${value.gradient}`}>
                    {value.icon}
                  </div>
                  <h3 className={styles.valueTitle}>
                    {value.title}
                  </h3>
                  <p className={styles.valueDescription}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadgeStone}>
              Get in Touch
            </div>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.sectionDescription}>Connect with our fragrance experts</p>
          </div>
          
          <div className={styles.contactForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Your Name"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Your Email"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                placeholder="Your Message"
                rows="6"
                className={styles.formTextarea}
              ></textarea>
            </div>
            <button
              type="button"
              className={styles.formButton}
            >
              <span className={styles.buttonContent}>
                Send Message
                <FaChevronRight className={styles.buttonIcon} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className={styles.footerSection}>
        <div className={styles.footerContainer}>
          <h2 className={styles.footerTitle}>
            Ready to Find Your <span className={styles.footerTitleGradient}>Perfect Scent?</span>
          </h2>
          <p className={styles.footerDescription}>
            Join thousands of satisfied customers who have discovered their signature fragrance with Darb's premium collection.
          </p>
          <div className={styles.footerButtons}>
            <button className={styles.startShoppingButton} onClick={handleNavigateToMarket}>
              <span className={styles.buttonContent}>
                Start Shopping <FaShoppingCart className={styles.buttonIcon} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className={styles.floatingActionButton}>
        <button className={styles.fabButton}>
          <FaSprayCan className={styles.fabIcon} />
        </button>
      </div>
    </div>
  );
};

export default Home;