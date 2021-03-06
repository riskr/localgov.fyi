import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { navigate } from "@reach/router";
import PropTypes from "prop-types";
import styles from "../spectre.min.module.css";
import iconStyles from "../typicons.min.module.css";
import PlaidLink from "react-plaid-link";
import Pricing from '../Landing/Pricing';

import CardPaymentMethod from './CardPaymentMethod';
import ServiceActionBar from "../Services/ServiceActionBar";
import { toggleStripeModal } from "../Services/actions";

import { updateServerOnboardingStep, finishOnboarding } from "../User/actions";

import { StripeProvider } from "react-stripe-elements";
const windowGlobal = typeof window !== "undefined" && window;


const PaymentPlan = props => (
  <div className={`${styles.column} ${styles.colSm3} ${styles.colXs12}`}>
    <div
      className={styles.card}
      style={{
        border: `${props.focus ? "1px solid rgba(86, 39, 255, .6)" : "0"}`,
        background: `${props.focus ? "#fff" : "#fbfcfe"}`,
        borderRadius: "0.2rem",
        boxShadow: "0 .25rem 1rem rgba(48,55,66,.15)"
      }}
    >
      <div className={styles.cardHeader}>
        {props.tag ? (
          <span
            className={`${styles.label} ${styles.labelRounded} ${styles.labelSecondary} ${styles.floatRight}`}
          >
            {props.tag}
          </span>
        ) : null}
        <div className={styles.h3}>
          {" "}
          <small>$</small>
          {props.price}
        </div>
        <div className={`${styles.cardSubitle} ${styles.textGray}`}>
          <span
            className={`${iconStyles.typcn} ${iconStyles.typcnCalendar}`}
          ></span>
          {props.duration}
        </div>
      </div>
      <div className={styles.cardBody} />
      <div className={styles.cardFooter}>
        <button
          onClick={() => props.selectPaymentPlan(props.id)}
          className={`${styles.btn} ${
            props.focus ? `${styles.btnPrimary}` : `${styles.btnSecondary}`
          }`}
        >
          Select this plan
        </button>
      </div>
    </div>
  </div>
);

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlan: null,
      packDuration: 'monthly',
      stripe: null,
      stripeCardModalOpen: false
    };
    this.selectPaymentPlan = this.selectPaymentPlan.bind(this);
    this.handleOnSuccess = this.handleOnSuccess.bind(this);
    this.handleOnExit = this.handleOnExit.bind(this);
    this.toggleCardDetails = this.toggleCardDetails.bind(this);
    this.onCardPaymentSubmit = this.onCardPaymentSubmit.bind(this);
  
  }

  updateStep(step) {
    const { dispatch, oneUser } = this.props;
    const { uid } = oneUser.details;
    dispatch(updateServerOnboardingStep(uid, step));
  }

  toggleCardDetails(toggle) {
    this.setState({
      stripeCardModalOpen: toggle
    });
  }

  onCardPaymentSubmit(stripe_token) {
      const {
        fetching: allSersFetching,
        failed: allSersFailed,
        sers: allOneSers,
        plans
      } = this.props.oneSers;
      const { packDuration, selectedPlan } = this.state;
    
      let selected_stripe_plan = null;

      const chosenPlan = plans.filter(function(newPlan) {
        return newPlan.pg_plan_id === selectedPlan;
      });

 console.log("here", plans, stripe_token, selectedPlan, chosenPlan, packDuration);

      if (!chosenPlan.length > 0){
        return
      }

 
      if (packDuration === "monthly") {
        selected_stripe_plan = chosenPlan[0].monthly_plan_id;
      } else {
        selected_stripe_plan = chosenPlan[0].yearly_plan_id;
      }

     console.log('here', stripe_token, selectedPlan, chosenPlan, packDuration);

      this.props.setupCardPayment(
        stripe_token,
        this.state.selectedPlan,
        selected_stripe_plan
      );
  }

  componentDidMount() {
    if (windowGlobal) {
      if (window.Stripe) {
        this.setState({ stripe: window.Stripe(process.env.GATSBY_STRIPE_KEY) });
      } else {
        document.querySelector("#stripe-js").addEventListener("load", () => {
          // Create Stripe instance once Stripe.js loads
          this.setState({
            stripe: window.Stripe(process.env.GATSBY_STRIPE_KEY)
          });
        });
      }
    }
  }

  selectPaymentPlan(plan, packType, packDuration) {
    console.log(plan, packType, packDuration)
    this.setState({
      selectedPlan: plan,
      packDuration: packDuration,
    });
  }

  handleOnSuccess(public_token, metadata) {
    const {
      fetching: allSersFetching,
      failed: allSersFailed,
      sers: allOneSers,
      plans
    } = this.props.oneSers;
    const {packDuration, selectedPlan} = this.state;
    
    let selected_stripe_plan = null;

    const chosenPlan = plans.filter(function(newPlan) {
      return newPlan.pg_plan_id === selectedPlan;
    });

    if (!chosenPlan.length > 0) {
      return;
    }


    if (packDuration === "monthly") {
      selected_stripe_plan = chosenPlan[0].monthly_plan_id;
    } else {
      selected_stripe_plan = chosenPlan[0].yearly_plan_id;
    }
      
    this.props.submitBankPayment(
      public_token,
      metadata.account_id,
      selectedPlan,
      selected_stripe_plan
    );
  }


  handleOnExit(err, metadata) {
    // handle the case when your user exits Link
    console.log(err, metadata);
  }

  render() {
    const { oneSers, oneUserSers, oneUser, oneUserPayment } = this.props;

    const { authInProgress, authFailure, details } = oneUser;

    const {
      paymentSetupDone,
      paymentSetupInProgress,
      paymentSetupFailed
    } = oneUserPayment;

    if (paymentSetupInProgress) {
      return <div className={styles.loading} />;
    }

      const {
        fetching: allSersFetching,
        failed: allSersFailed,
        sers: allOneSers,
        plans,
      } = oneSers;

    const { selectedPlan, stripeCardModalOpen } = this.state;

    return (
      <Fragment>
        <StripeProvider stripe={this.state.stripe}>
          <CardPaymentMethod
            email={this.props.email}
            stripeCardModalOpen={stripeCardModalOpen}
            onClose={this.toggleCardDetails}
            onStripeToken={this.onCardPaymentSubmit}
          />
        </StripeProvider>

        <Pricing
          userTypeSelected={true}
          packName={details.packType}
          selectedPlan={details.selected_plan_id}
          planDuration={details.planDuration}
          onSelectPlan={this.selectPaymentPlan}
          loading={allSersFetching}
          plans={plans}
          showHeading={false}
          failed={allSersFailed}
        />

        {selectedPlan ? (
          <ServiceActionBar
            action={
              <Fragment>
                <button
                  onClick={() => this.updateStep("update_services_details")}
                  className={`${styles.btn}`}
                >
                  {" "}
                  <span
                    className={`${iconStyles.typcn} ${iconStyles.typcnArrowLeft}`}
                  ></span>{" "}
                  Add Details
                </button>
                <div style={{ display: "flex" }}>
                  <div style={{ color: "#fff", width: "260px" }}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      style={{
                        background: "rgb(86, 39, 255)",
                        color: "#fff",
                        width: "100%"
                      }}
                      onClick={this.toggleCardDetails}
                    >
                      <span
                        className={`${iconStyles.typcn} ${iconStyles.typcnLockClosed}`}
                      ></span>{" "}
                      Pay with credit card
                    </button>
                  </div>
                  <div
                    className={`${styles.dividerVert} ${styles.textCenter}`}
                    data-content="OR"
                  ></div>
                  <PlaidLink
                    clientName="papergov One"
                    env={process.env.GATSBY_PLAID_ENV}
                    className={`${styles.btn}  ${styles.btnPrimary}`}
                    style={{
                      background: "rgb(86, 39, 255)",
                      color: "#fff",
                      width: "260px"
                    }}
                    selectAccount={true}
                    product={["auth"]}
                    publicKey={process.env.GATSBY_PLAID_PUBLIC_KEY}
                    onExit={this.handleOnExit}
                    onSuccess={this.handleOnSuccess}
                  >
                    <span
                      className={`${iconStyles.typcn} ${iconStyles.typcnLockClosed}`}
                    ></span>{" "}
                    Connect bank account
                  </PlaidLink>
                </div>
              </Fragment>
            }
          />
        ) : null}
      </Fragment>
    );
  }
}



const mapStateToProps = function(state, ownProps) {
  return {
    oneSers: state.oneServices,
    oneUserSers: state.oneUserServices,
    oneUser: state.oneUser, 
    oneUserPayment: state.oneUserPayment,
    ...ownProps,
  };
};
// paymentSetupDone
export default connect(mapStateToProps)(Payment);