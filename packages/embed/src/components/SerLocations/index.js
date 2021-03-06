import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import queryString from "query-string";

import SerLocationCard from "./SerLocationCard";
import SerTemplateCard from "../SerTemplateCard";

import styles from "../spectre.min.module.css";
import iconStyles from "../typicons.min.module.css";

import { fetchAutoLoc } from "./actions";

class SerLocationShell extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const searchValues = queryString.parse(location.search);

    // if (searchValues && searchValues.ser_temp_id) {
    //   dispatch(fetchAutoLoc(searchValues.ser_temp_id));
    // }
    if (searchValues && searchValues.id) {
      dispatch(fetchAutoLoc(searchValues.id));
    }
  }

  render() {
    const {
      autoLocLoading,
      autoLocResults,
      autoLocFailed,
      autoLocRegion,
      defaultTemplateName,
      defaultTemplateSlug,
      defaultTemplateDesc
    } = this.props;

    let allLocSers = (
      <SerTemplateCard
        name={defaultTemplateName}
        slug={defaultTemplateSlug}
        desc={defaultTemplateDesc}
      />
    );

    if (autoLocResults.length > 0) {

      allLocSers = autoLocResults.map((locResult, item) => {
        const locsHere = locResult.location_sers.map((res, idx) => {
          return (
            <SerLocationCard
              key={idx}
              idx={idx}
              organization={res.organization}
              ser_url_slug={res.url_slug}
              area={res.area}
            />
          );
        });
        return (
          <Fragment>
            <h5 style={{marginTop: "2rem", paddingBottom: "1rem" }}>{locResult.header}</h5>
            <div>{locsHere}</div>
          </Fragment>
        );
      });
    }

    return (
      <div className={`${styles.columns}`}>
        <div
          className={`${styles.column} ${styles.col12} ${styles.hideXs} ${styles.textLeft}`}
        >
          <div>{allLocSers}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    ...state.SerLocations
  };
};

export default connect(mapStateToProps)(SerLocationShell);
