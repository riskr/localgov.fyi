import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import { Router, Link } from "@reach/router";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ServiceDetail from './UserServiceDetail';

const styles = theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  progress: {
    margin: theme.spacing(2)
  },
  table: {
    minWidth: 650
  },
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  }
});

class ServiceList extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { services } = this.props;
    const { classes } = this.props;
    const {selectedServices} = services;

    if (!selectedServices){
        return null
    }

    const userFinalizedSers = Object.values(selectedServices).map(selected => {
      if ("formData" in selected) {
        return <ServiceDetail service={selected}/>;
      }
    });
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
            {userFinalizedSers}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    ...state.admOneUserReducer,
    ...ownProps
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ServiceList));
