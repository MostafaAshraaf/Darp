import { useSelector } from "react-redux";
import PersonalInformation from "../AdminPersonalInformation/aboutAdmin";
import styles from "./adminProfile.module.css";

const AdmenProfile = () => {
  const authData = useSelector((state) => state.auth);
  const user = authData?.user || {};

  return (
    <div className={styles.adminContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>
              {authData?.isAuthenticated
                ? `${user.username}'s Profile`
                : "adminProfile"}
            </h2>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className={styles.contentArea}>
          <PersonalInformation />
        </div>
      </div>
    </div>
  );
};

export default AdmenProfile;
