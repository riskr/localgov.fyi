import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { navigateTo } from 'gatsby-link';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    FacebookShareButton,
    TwitterShareButton,
} from 'react-share';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Divider from '@material-ui/core/Divider';
import MoreVert from '@material-ui/icons/MoreVert';
import withRoot from '../withRoot';

import { trackClick} from "./Search/tracking";

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'baseline',
    height: theme.spacing.unit * 18,
    margin: theme.spacing.unit,
    border : `1px solid ${theme.palette.primary['100']}`,
    boxShadow : `0 1px 1px ${theme.palette.primary['50']}`,
    '&:hover' : {
        boxShadow: `0 1px 1px ${theme.palette.primary['100']}`
    },
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: -theme.spacing.unit,
  },
  caption: {
    overflowY: 'hidden',
    cursor: 'pointer',
    height : theme.spacing.unit * 6,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding:0,
  },
  iconButton: {
    marginTop: theme.spacing.unit * -2,
    marginRight: theme.spacing.unit * -2,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'center',
  },
  shareButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
cardContent:{
    paddingBottom: 0,
    height : theme.spacing.unit * 13,
},
  dividerWrapper: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
  },
  "raw":{

     '& $p':{
padding : 0,
margin: 0,
    }
  }
});

const RawHTML = ({ children, className = "" }) => (
    <div
        className={className}
        style={{padding:0, margin: 0}}
        dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, " ") }}
    />
);

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            copied: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleDeliveryClick = this.handleDeliveryClick.bind(this);
        this.handleMoreVertClick = this.handleMoreVertClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
    }

    handleClick() {
        const { trackClick, resultType, id, toLink, title,  listIndex} = this.props;
        trackClick('card_item', resultType, id, title, listIndex);
        navigateTo(toLink);
    }

    handleDeliveryClick() {
        const { trackClick, deliveryLink } = this.props;
        const windowGlobal = typeof window !== 'undefined' && window;
        trackClick('external', 'service_delivery_link', deliveryLink.url, deliveryLink.link_name, 0);
        windowGlobal.open(deliveryLink.url);
    }

    handleMoreVertClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null, copied: false });
    }

    handleCopy() {
        this.setState({ copied: true });
    }

    render() {
        const { classes, title, description, deliveryLink, toLink } = this.props;
        const { anchorEl, copied } = this.state;
        const windowGlobal = typeof window !== 'undefined' && window;
        const windowLocation = windowGlobal.location ? windowGlobal.location : {};
        const shareLink = windowLocation.origin + toLink + '/';
        let key = title
        if (this.props.key) {
            key = this.props.key
        }

        let subtitle = '';
        if (description){
            subtitle = (description.length > 80) ? description.substr(0, 79) + '&hellip;' : description;
        }
        
        return (
            <Card className={classes.card}>

                    <CardContent className={classes.cardContent}>
                        <div className={classes.cardTop}>
                            <Typography variant="body2" component="h1"  className={classes.cardTitle} onClick={this.handleClick}>
                                {title}
                            </Typography>
                            <IconButton onClick={this.handleMoreVertClick} className={classes.iconButton}>
                                <MoreVert/>
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.handleClose}
                            >
                                <CopyToClipboard text={shareLink} onCopy={this.handleCopy}>
                                    <MenuItem className={classes.menuItem}>
                                        <Typography>{copied ? 'Copied!' : 'Copy link'}</Typography>
                                    </MenuItem>
                                </CopyToClipboard>
                                <MenuItem onClick={this.handleClose} className={classes.menuItem}>
                                    <FacebookShareButton url={shareLink} className={classes.shareButton}>
                                        <Typography>Facebook</Typography>
                                    </FacebookShareButton>
                                </MenuItem>
                                <MenuItem onClick={this.handleClose} className={classes.menuItem}>
                                    <TwitterShareButton url={shareLink} className={classes.shareButton}>
                                        <Typography>Twitter</Typography>
                                    </TwitterShareButton>
                                </MenuItem>
                            </Menu>
                        </div>
                        <Typography variant="caption" className={classes.caption} onClick={this.handleClick}>
                            <RawHTML className={classes.raw}>{subtitle}</RawHTML>
                            
                        </Typography>
                    </CardContent>

                    <CardActions className={classes.cardActions}>
                        {(deliveryLink && deliveryLink.link_name) && <Button size="small" color="primary" onClick={this.handleDeliveryClick}>
                            {deliveryLink.link_name}
                        </Button>}
                    </CardActions>
            </Card>
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
        ...ownProps
    };
};

const ConnSearchResult = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRoot(withStyles(styles)(SearchResult)));

export default ConnSearchResult;