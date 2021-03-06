import React, { Component } from "react";
import styles from "../spectre.min.module.css";
import iconStyles from "../typicons.min.module.css";

class FooterDiscover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, isMobile } = this.props;

    return (
      <div className={`${styles.columns}`}>
        <div
          className={`${styles.column} ${styles.col12} ${styles.hideXs} ${styles.textLeft}`}
        >
          <div style={{ paddingBottom: "0.5rem" }}>
            <h6>Discover</h6>
          </div>

          <div style={{ marginBottom: "0.2rem" }}>
            <a
              href={`https://pay.papergov.com/?utm_source=one_footer`}
              target="_blank"
            >
              <span
                className={`${styles.badge} ${styles.textSemibold} ${styles.textGray}`}
                data-badge="NEW"
              >
                Quick Pay For All Services
              </span>
            </a>
          </div>
          <div style={{ marginBottom: "0.2rem" }}>
            <a
              className={`${styles.textGray} ${styles.textSemibold}`}
              href={`https://papergov.com/locations`}
              target="_blank"
            >
              All Locations
            </a>
          </div>
          <div style={{ marginBottom: "0.2rem" }}>
            <a
              className={`${styles.textGray} ${styles.textSemibold}`}
              href={`https://papergov.com/services`}
              target="_blank"
            >
              Service Directory
            </a>
          </div>
        </div>
        <div
          className={`${styles.column} ${styles.col12} ${styles.showXs} ${styles.textCenter}`}
        >
          <div style={{ paddingBottom: "0.5rem" }}>
            <h6>Discover</h6>
          </div>

          <div style={{ marginBottom: "0.2rem" }}>
            <a href={`https://one.papergov.com`} target="_blank">
              <span
                className={`${styles.badge} ${styles.textGray}`}
                data-badge="NEW"
              >
                Quick Pay For All Services
              </span>
            </a>
          </div>

          <div style={{ marginBottom: "0.2rem" }}>
            <a
              className={`${styles.badge} ${styles.textGray}`}
              href={`https://papergov.com/locations`}
              target="_blank"
            >
              All Locations
            </a>
          </div>

          <div style={{ marginBottom: "0.2rem" }}>
            <a
              className={`${styles.badge} ${styles.textGray}`}
              href={`https://papergov.com/services`}
              target="_blank"
            >
              Service Directory
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default FooterDiscover;
