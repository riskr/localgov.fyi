import * as PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Helmet from "react-helmet";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Info from '@material-ui/icons/Info';
import AttachMoney from '@material-ui/icons/AttachMoney';
import AccessTime from '@material-ui/icons/AccessTime';
import Assignment from '@material-ui/icons/Assignment';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import PinDrop from '@material-ui/icons/PinDrop';

import ContactDetails from '../components/ContactDetails';
import AddressGoogleMap from '../components/AddressGoogleMap';
import HorizontalList from '../components/HorizontalList';
// import MemberListItem from '../components/MemberListItem';
import SearchResult from '../components/SearchResult';
import ServiceDeliveryLink from '../components/ServiceDeliveryLink';
import withRoot from '../withRoot';

import { trackView } from "../components/Search/tracking";

const windowGlobal = typeof window !== 'undefined' && window;

const styles = theme => ({
    ser_detail_search_container: {
        marginTop: theme.spacing.unit * 2
    },
ser_detail_search_details : {
        width: '100%',
    },
ser_detail_search_cards : {
        marginBottom: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unit,
        borderRadius: 3,
        boxShadow: `0 0 2px 1px ${theme.palette.primary["50"]}`
    },
ser_detail_search_serviceItemIcon : {
        padding: 8
    },
ser_detail_search_cardContent : {
        padding: 4
    },
ser_detail_search_iconWrapper : {
        paddingTop: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
    },
ser_detail_search_icon : {
        fontSize: 24,
        color: theme.palette.primary["200"]
    },
ser_detail_search_formLink : {
        textDecoration: 'underline',
        textDecorationColor: '#0000EE',
    },
});

const JsonLd = ({ data }) =>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />;


const RawHTML = ({
    children,
    className = ""
}) => (
        <div
            className={className}
            dangerouslySetInnerHTML={{
                __html: children.replace(/\n/g, " ")
            }} />
    );

class ServiceDetailInSearch extends React.Component {

    render() {
        const {
            id,
            name,
            allForms,
            allSteps,
            description,
            contact_details,
            price,
            alllocations,
            alltimings,
            allfaq,
            allOrgs,
            allMems,
            org_id,
            org_name,
            service_del_links
        } = this.props;
        const { classes } = this.props;

        const containerSize = 12;
        const space = 8;

        let timingList = null;
        if (alltimings.length > 0) {
            timingList = alltimings.map((timing, index) => {
                const { day, open } = timing;
                const breakTime = timing["break"];
                let openTime = "";

                if (open && breakTime) {
                    openTime = `OPEN: ${open} CLOSED: ${breakTime}`;
                }

                return (
                    <ListItem disableGutters>
                        <ListItemText
                            primary={openTime}
                            secondary={day}
                            secondaryTypographyProps={{ variant: "subheading" }}
                        />
                    </ListItem>
                );
            });
        }

        let steplist = null;
        if (allSteps.length > 0) {
            steplist = allSteps.map((step, index) => {
                const { description } = step;
                const text = (
                    <RawHTML>
                        {description}
                    </RawHTML>
                );
                return <ListItem disableGutters>
                    <Typography type="caption" gutterBottom>
                        {index + 1}
                    </Typography>
                    <ListItemText primary={text} />
                </ListItem>;
            });
        }

        let formList = null;
        if (allForms.length > 0) {
            formList = allForms.map((form, index) => {
                const { name, url, price } = form;
                return <ListItem button disableGutters>
                    <ListItemText
                        primary={name}
                        onClick={() => {
                            if (url) {
                                windowGlobal.open(url, "_blank");
                            }
                        }}
                        secondary={price}
                        className={classes.ser_detail_search_formLink}
                    />
                </ListItem>;
            });
        }

        let qaList = null;
        if (allfaq.length > 0) {
            qaList = allfaq.map((qa, index) => {
                const { answer, question } = qa;
                const text = (
                    <RawHTML>
                        {answer}
                    </RawHTML>
                );

                return <ListItem disableGutters>
                    <ListItemText primary={question} secondary={text} />
                </ListItem>;
            });
        }

        let locList = null;
        if (alllocations.length > 0) {
            locList = alllocations.map((loc, index) => {
                const { id, description, address } = loc;
                return <div>
                    <Typography variant="body" gutterBottom>
                        {id}
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        {description}
                    </Typography>
                    <br />
                    <AddressGoogleMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyC1d6ej2p77--6Wf8m6dzdrbvKhfBnb3Ks&libraries=places"
                        loadingElement={<div style={{ height: "205px", width: "280px" }} />}
                        containerElement={< div style={{ height: "200px", width: "280px" }} />}
                        mapElement={< div style={{ height: "200px", width: "280px" }} />}
                        address={address.toLowerCase()} />
                    <br />
                </div>;
            });
        }

        const offeredInDetails = <Grid container spacing={8} style={{
            // marginTop: 16
        }}>
            <Grid item xs={12} sm={12}>
                <Typography variant="subheading" gutterBottom>
                    Offered in
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                <SearchResult key={org_id} id={org_id} listindex={0} resultType={'organization'} toLink={`/organization/${org_id}/`} title={org_name} />
            </Grid>
        </Grid>;


        const serDel = service_del_links.map((link, idx) => {
            return ({
                "potentialAction": {
                    "@type": "ReserveAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${link.url}`,
                        "inLanguage": "en-US",
                        "actionPlatform": [
                            "http://schema.org/DesktopWebPlatform",
                            "http://schema.org/IOSPlatform",
                            "http://schema.org/AndroidPlatform"
                        ]
                    },
                    "result": {
                        "@type": "Reservation",
                        "name": `${link.link_name}`
                    }
                }
            }
            );
        });

        const jsonLd = {
            "@context": "http://schema.org",
            "@type": "GovernmentService",
            "name": `${name}`,
            "provider": {
                "@context": "http://schema.org",
                "@type": "GovernmentOrganization",
                "schema:name": `${org_name}`
            },
        }
        if (serDel.length > 0) {
            jsonLd['potentialAction'] = serDel[0]['potentialAction']
        }


        return (
            <Grid container spacing={16} className={classes.ser_detail_search_container}>
                <Helmet>
                    <title>{`${name} service offered in ${org_name} | papergov`} </title>
                
                    <meta property="og:title" content={`${name} service offered in ${org_name} | papergov`} />
                
                    <meta name="description" content={`Forms, Price, Timings and Local Government Service Contact Details for ${name} offered in ${org_name} | papergov`} />

                    <meta property="og:description" content={`Forms, Price, Timings and Local Government Service Contact Details for ${name} offered in ${org_name} | papergov`} />
                    <JsonLd data={jsonLd} />
                </Helmet>
                <Grid item md={12} sm={12} className={classes.ser_detail_search_details}>
                    <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <Info className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent}>
                                        <Typography variant="subheading" gutterBottom>
                                            {name}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            <RawHTML>{description}</RawHTML>
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {service_del_links && <ServiceDeliveryLink service_name={name} org_name={org_name}serDelLinks={service_del_links} />}
                    {contact_details && <ContactDetails info={contact_details} />}
                    {price && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <AttachMoney className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent}>
                                        <Typography variant="body2" gutterBottom>
                                            {price}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                    {timingList && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <AccessTime className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent} style={{ marginTop: -12 }}>{timingList}</div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                    {formList && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <Assignment className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.cardContent} style={{ marginTop: -12 }}>{formList}</div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                    {steplist && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <PlaylistAddCheck className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent} style={{ marginTop: -12 }}>{steplist}</div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                    {qaList && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <QuestionAnswer className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent}>{qaList}</div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                    {locList && <Grid item xs={12}>
                        <Paper className={classes.ser_detail_search_cards}>
                            <Grid container spacing={8}>
                                <Grid item xs={2} sm={1}>
                                    <div className={classes.ser_detail_search_iconWrapper}>
                                        <PinDrop className={classes.ser_detail_search_icon} />
                                    </div>
                                </Grid>
                                <Grid item xs={10} sm={11}>
                                    <div className={classes.ser_detail_search_cardContent}>{locList}</div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = function (state, ownProps) {
    return {
        ...state,
        ...ownProps
    };
};

export default connect(mapStateToProps)(withStyles(styles)(ServiceDetailInSearch));

