import React, { Component, Fragment } from "react";
import { connect } from "react-redux";


import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Fuse from 'fuse.js';
import OtherStateLocations from './OtherStateLocations';

import LocationSerCard from './LocationSerCard';
import StateSuggest from '../StateSuggest';

const styles = theme => ({
  ser_gloss_gridItemLocation_mob_focus: {
    boxShadow: `0 0 3px 0px ${theme.palette.primary["600"]}`
  },
  show_more_mob:{
    margin: theme.spacing.unit,
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  ser_gloss_suggested_row: {
    marginTop: theme.spacing.unit * 4,

  },
  ser_gloss_suggested_row_heading: {
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    fontSize: "18px"
  },
  ser_gloss_suggested_row_locs: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    margin: theme.spacing.unit
  },
  ser_gloss_suggested_row_locs_mob: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: theme.spacing.unit
  },
  suggest_loc_card: {
    display: "flex",
  },
  ser_gloss_suggested_row_heading_mob: {
    fontSize: "16px",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2
  },
  ser_gloss_others_row_header_container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    position: "relative"
  },
  v_list_body:{
    '&::-webkit-scrollbar': {
      width: 0, // remove scrollbar space
      background: 'transparent', // make scrollbar invisible
    },
  },
  ser_gloss_others_row_header_container_mob: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    position: "relative"
  },
  suggest_loc_logo: {
    width: 56,
    height: 56,
    boxShadow: `0 0 0px 1px ${theme.palette.primary["200"]}`,
    border: "1px solid #fff",
    marginRight: theme.spacing.unit * 2
  }
});



class OtherLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateName: null,
            showMore: false,
        }
        this.toggleShowMore = this.toggleShowMore.bind(this)
        this.setStateFilter = this
            .setStateFilter
            .bind(this);
        this.clearStateName = this
            .clearStateName
            .bind(this);
    }

    toggleShowMore(toggle){
      this.setState({
        showMore: !toggle,
      })
    }

    clearStateName() {
        const { location } = this.props;
        this.setState({
            stateName: ''
        })
    }


    setStateFilter(stateSuggestion) {
        const { label } = stateSuggestion;
        this.setState({
            stateName: label
        })
    }



    render() {
      const { classes, allOrgs, isMobile } = this.props;
        const { stateName} = this.state;

   
        let filteredOrgs = allOrgs;

        const allStatesSet = new Set();

        const stateOptions = {
            shouldSort: true,
            tokenize: false,
            threshold: 0,
            location: 0,
            distance: 5,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['area.hierarchy.area_name']
        }


 
        if (stateName) {
            const stateFuse = new Fuse(allOrgs, stateOptions)
            filteredOrgs = stateFuse.search(stateName);
        }

        
        allOrgs.map((org, idx) => {
                allStatesSet.add(org.area.hierarchy[org.area.hierarchy.length - 1].area_name)
            })

        allOrgs.sort((a, b) => a.organization.org_name.localeCompare(b.organization.org_name));

        let allStates = [];
        const sortedAllStates = Array
            .from(allStatesSet)
            .sort()
        sortedAllStates.forEach((org) => {
            allStates.push({ 'label': org })
        })

        const locs = filteredOrgs.map((org, idx) => {
            const organization = org.organization;
            return (
                <LocationSerCard key={idx} idx={idx} organization={organization} ser_url_slug={org.url_slug} area={org.area}  />
            )
        })


      let moreLocs = null;
      if (!this.state.showMore){
        moreLocs = (<a
          onClick={() => this.toggleShowMore(this.state.showMore)}
          className={classes.show_more_mob}
        >
          <Typography
            variant="title"
            component="body1">
            Show More Locations
      </Typography>
        </a>)
      } 
        if (!this.props.isMobile || this.state.showMore){
          moreLocs = (<Fragment> 
            <div
            className={
              isMobile
                ? classes.ser_gloss_others_row_header_container_mob
                : classes.ser_gloss_others_row_header_container
            }
          >
            <Typography
              variant="title"
              component="h2"
              className={
                this.props.isMobile
                  ? classes.ser_gloss_suggested_row_heading_mob
                  : classes.ser_gloss_suggested_row_heading
              }
            >
              More locations offering this service
                </Typography>
            <StateSuggest
              isMobile={isMobile}
              clearStateName={this.clearStateName}
              selected={this.state.stateName}
              allStates={allStates}
              onSelectSuggestion={this.setStateFilter}
            />
           
          </div>
            <div className={classes.ser_gloss_suggested_row_locs}>
              {locs}
            </div>
          </Fragment>
            )
        }
        
        return (
          <Grid container>
            <OtherStateLocations isMobile={isMobile} allOrgs={allOrgs} />
            <Grid item sm={1} />
            <Grid
              item
              sm={10}
              className={classes.ser_gloss_suggested_row}
            >
            {moreLocs}
            </Grid>
            <Grid item sm={1} />
          </Grid>
        );
    }
}

const mapStateToProps = function (state, ownProps) {
    return {
        ...state.serTemplate,
        ...ownProps
    };
};

export default connect(mapStateToProps)(withStyles(styles)(OtherLocations));
