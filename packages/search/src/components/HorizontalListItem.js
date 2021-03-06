import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import withRoot from '../withRoot';

const styles = theme => ({
    ho_gridListTile: {
        width: 225,
        height: 250,
        cursor: 'pointer',
        marginRight: theme.spacing.unit
    }
});

const HorizontalListItem = ({item, classes}) => {
    return (
        <GridListTile className={classes.ho_gridListTile}>
            {item}
        </GridListTile>
    );
};

export default withStyles(styles)(HorizontalListItem);