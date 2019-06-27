import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";

import { navigate } from '@reach/router';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import ServiceTemplateCard from '../ServiceTemplateCard';

import { trackClick } from "../common/tracking";

const styles = theme => ({
    related_ser_list: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    relates_ser_list_compact: {
        display: 'flex',
        justifyContent: 'center',
        flex: '1',
        margin: theme.spacing.unit,
        marginRight: '4px',
        marginLeft: '4px',
        borderRadius: '2px',
        padding: theme.spacing.unit * 4,
    },
    related_ser_list_mob: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});



const xah_randomize_array = ((arr) => {
    /* [ Fisher-Yates shuffle. can be used on array-like object
  Modify array inplace.
  http://xahlee.info/js/javascript_random_array.html
  version 2017-09-18
  ] */
    let i = arr.length - 1;
    let j;
    while (i >= 1) {
        // random element up to i, include i
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i--;
    }
    return arr;
});

const SerTemplateCards = (props) => {
    let sers = [

        {
            name: 'Pay Property Taxes ',
            link: 'pay-property-taxes/'
        }, {
            name: 'Pay Parking Citation',
            link: 'pay-parking-citation/'
        },
        {
            name: 'Register for Recreational Classes',
            link: 'register-for-recreational-activity-or-class/'
        }, {
            name: 'Pay Utility Bill',
            link: 'pay-utility-bill/'
        }, {
            name: 'Renew Business License',
            link: 'renew-business-license/'
        },
    ]

    if (props.currentNameSlug)
        sers = sers.filter((ser) => ser.link.indexOf(props.currentNameSlug) === -1)

    // if (props.compact)
    //     sers = sers.slice(0, 4)

    return (
        <Fragment>
            {sers.map((item, idx) => {
                return (
                    <ServiceTemplateCard isMobile={props.isMobile} compact={props.compact} key={item.name} name={item.name} slug={item.link} />
                )
            })}
        </Fragment>
    )
}

// const serTemp = (     <StaticQuery         query={graphql ` query
// allSerGlossaryItems{ allFile(filter : { sourceInstanceName: { eq:
// "service_glossary" } }, limit: 6 ) { edges { node { childServiceGlossaryJson
// {service_name} name } } } }`}         render={data => {         return
// <SerTemplateCards data={data}/>;     }}/> )

class IndexServiceTemplates extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        const { classes, currentNameSlug, showAdd, compact, isMobile } = this.props;
        
        return (
            <Fragment>
                <Grid
                    container
                    className={!isMobile
                        ? !compact ? classes.related_ser_list : classes.relates_ser_list_compact
                        : classes.related_ser_list_mob}>

                    <SerTemplateCards isMobile={isMobile} compact={compact} currentNameSlug={currentNameSlug}  />
                </Grid>
            </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        trackClick: (click_type, resultType, id, title, listIndex) => {
            dispatch(trackClick(click_type, resultType, id, title, listIndex));
        }
    }
}

const mapStateToProps = function (state, ownProps) {
    return {
        ...state,
        ...ownProps
    };
};

const ConnIndexServiceTemplates = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(IndexServiceTemplates));

export default ConnIndexServiceTemplates;
