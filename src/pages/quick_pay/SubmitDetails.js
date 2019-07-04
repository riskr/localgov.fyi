import React, { Component, Fragment } from 'react';

import { connect } from "react-redux";
import currency from 'currency.js';

import ContentEditable from 'react-contenteditable'
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    PostalCodeElement, injectStripe } from 'react-stripe-elements';
import PaymentPreview from './PaymentPreview'

import styles from "./spectre.min.module.css"
import iconStyles from './typicons.min.module.css';

import {subscribeUploadAnalysis, stepChange, updatePrice, updateEmail} from './actions';

const createOptions = (fontSize, padding) => {
    return {
        style: {
            base: {
                fontSize,
                color: '#505c6e',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding,
            },
            invalid: {
                color: '#d73e48',
            },
        },
    };
};

class SubmitDetails extends Component {
    constructor(props) {
        super(props);
        this.onPreview = this.onPreview.bind(this);
        this.contentEditable = React.createRef();
        this.changeEmail = this.changeEmail.bind(this);
        this.changePrice = this.changePrice.bind(this);
      
    }

    componentDidMount(){
        const { dispatch, createdSubId } = this.props;
        dispatch(subscribeUploadAnalysis(createdSubId));
    }

    changeEmail(e){
        const {dispatch} = this.props;
        dispatch(updateEmail(e.target.value));
    }

    changePrice(evt){
        const { dispatch } = this.props;
        console.log(evt.target.value);
        dispatch(updatePrice(evt.target.value));
    };

    onPreview(ev) {
        const { createdSubId, dispatch } = this.props;
        console.log("onPreview");
        ev.preventDefault();
        dispatch(stepChange('show_submit_confirm'));
    }

    render() {
        const { analyseInProgress, guessPrice, userPrice, userEmail, step } = this.props;
        if (analyseInProgress) {
            return (<div className={styles.loading}></div>) 
        }

        // can't be zero to proceed
        let price = 'NA'
        if (guessPrice && guessPrice!=='NA'){
            price = guessPrice;
            price = String(currency(price).value)
        }
        if (userPrice){
            price = userPrice;
        }
        const isPreview = (step === 'show_submit_confirm')
        return (
            <Fragment>
                {isPreview && (<PaymentPreview stripe={this.props.stripe} />)}
            <div  style={{display: `${isPreview ? 'none' : 'visible'}`}} >
                
                <div className={`${styles.panel} ${styles.menu}`} style={{ padding: '16px 8px' }} >
                    <div className={`${styles.panelHeader} ${styles.textCenter} `}>
                        <div className={styles.panelSubtitle}>
                            <div className={`${styles.label} ${styles.labelWarning}`} style={{ fontSize: '14px', background: 'rgba(255, 183, 0, .65)', borderRadius: '5px', padding: '6px 8px', color: '#3b4351'  }}>
                                <span className={`${iconStyles.typcn} ${iconStyles.typcnLightbulb}`}></span>This is a guess, feel free to edit!
                            </div>
                        </div>
                        <div className={`${styles.h1}`} style={{display: 'flex', justifyContent: 'center',  padding: '16px 0 8px 0'}}> <span style={{fontSize: '1rem', alignSelf: 'center'}}>{'$'}</span><ContentEditable
                            style={{ borderBottom: '1px dotted #3b4351'}}
                            innerRef={this.contentEditable}
                            html={price} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={this.changePrice} // handle innerHTML change
                             // Use a custom HTML tag (uses a div by default)
                        /></div>
              
                    </div>
                   
                <div className={styles.panelBody}>
                        <div className={styles.columns}>
                            <div className={`${styles.column} ${styles.col12}`}>
                                <li className={styles.divider}></li>
                                <div style={{ paddingBottom: '8px', margin: '16px 0 0 0', textAlign: 'center'}}>
                                    <span className={`${iconStyles.typcn} ${iconStyles.typcnLockClosedOutline}`}></span><span style={{fontSize: '14px'}}>Your transactions are always <a href="#" >safe & secure</a></span>
                                </div>
                                <label className={`${styles.formLabel} ${styles.textUppercase} ${styles.textBold}`} style={{fontSize: '12px'}}>
                    Card number
          <CardNumberElement
                      className={styles.formInput}
                        {...createOptions('19px')}
                    />
                </label>
                </div>
                            <div className={`${styles.column} ${styles.col5}`}>
                                <label className={`${styles.formLabel} ${styles.textUppercase} ${styles.textBold}`} style={{ fontSize: '12px' }}>
                    Exp. date
          <CardExpiryElement
                        className={styles.formInput}
                        {...createOptions('19px')}
                    />
                </label>
                </div>
                            <div className={`${styles.column} ${styles.col3}`}>
                    <label className={`${styles.formLabel} ${styles.textUppercase} ${styles.textBold}`} style={{ fontSize: '12px' }}>
                    CVC
          <CardCVCElement
                        className={styles.formInput}
                        {...createOptions('19px')}
                    />
                </label>
                </div>
                            <div className={`${styles.column} ${styles.col4}`}>
                    <label className={`${styles.formLabel} ${styles.textUppercase} ${styles.textBold}`} style={{ fontSize: '12px' }}>
                    Postal code
          <PostalCodeElement
                        className={styles.formInput}
                        {...createOptions('19px')}
                    />
                </label>
                </div>
                           
                            <div className={`${styles.column} ${styles.col12}`}>
                                <li className={styles.divider}></li>
                              
                                <label className={`${styles.formLabel}`} style={{ fontSize: '14px', margin: '16px 0 8px 0', textAlign: 'center'}}>
                                    <span className={`${iconStyles.typcn} ${iconStyles.typcnMail}`}></span>Provide us your email to keep you updated
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@youremail.com"
                                    className={styles.formInput}
                                    name="email"
                                    onChange={this.changeEmail}
                                    onBlur={()=> {}}
                                    value={userEmail ? userEmail : ""}
                                />
                            
                            </div>
                </div>
                </div>
                <div className={styles.panelFooter}>
                        <button style={{ marginTop: '16px', width: '100%', fontSize: '14px' }} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg} ${styles.textUppercase} ${styles.textBold}`} onClick={this.onPreview}>Preview</button>

                      </div>
                </div>
            </div>
            </Fragment>
        );
    }
}

const InjectedForm = injectStripe(SubmitDetails);

const mapStateToProps = function (state, ownProps) {
    return {
        ...state.quickPay,
        ...ownProps
    };
};

export default connect(mapStateToProps)(InjectedForm);