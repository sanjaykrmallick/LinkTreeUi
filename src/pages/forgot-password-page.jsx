import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { ToastsContainer, ToastsStore } from "react-toasts";
import {
  Col,
  Container,
  Row,
  Carousel,
  CarouselIndicators,
  CarouselItem,
  CarouselCaption,
  Button,
  Form,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { forgot_pass } from "../http/http-calls";
const items = [
  {
    header: "Title",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.",
  },
];

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      userData: {
        email: "",
      },
      isDirty: {
        email: "",
      },
      errors: {},
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this._handleOnChange = this._handleOnChange.bind(this);
    this._handleOnSubmit = this._handleOnSubmit.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }
  _goLogin = () => {
    this.props.history.push("/login");
  };

  login = (e) => {
    const { userData } = this.state;
    e.preventDefault();
    let isDirty = {
      email: true,
      password: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const forgot_passData = {
          handle: userData.email,
        };
        forgot_pass(forgot_passData).then((res) => console.log(res));
        ToastsStore.success(
          `Please Check Your Email: ${userData.email} for changing Password`
        );
        this.props.history.push("/login");
      } else {
        ToastsStore.error("Error in changing Password");
        this.props.history.push("/login");
      }
    });
    // this.props.history.push("/login");
  };

  _handleOnChange = (field, value) => {
    // debugger
    const { userData, isDirty } = this.state;
    if (!value && typeof value === "number") {
      userData[field] = "";
      isDirty[field] = true;
      this.setState({ userData, isDirty }, () => {
        this._validateForm();
        console.log(this.state);
      });
      return;
    } else {
      userData[field] = value;
    }
    isDirty[field] = true;
    this.setState({ userData, isDirty }, () => {
      this._validateForm();
      console.log(this.state);
    });
  };
  _validateForm() {
    // debugger;
    const { userData, isDirty, errors } = this.state;
    Object.keys(userData).forEach((each) => {
      switch (each) {
        case "email": {
          if (isDirty.email) {
            if (!userData.email.trim().length) {
              errors.email = "*Required";
            } else if (
              userData.email.trim().length &&
              !new RegExp(
                "^[a-zA-Z0-9]{1}[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$"
              ).test(userData.email)
            ) {
              errors.email = "*Enter a valid email ID";
            } else {
              delete errors[each];
              isDirty.email = false;
            }
          }
          break;
        }
        default: {
          console.log("Error in validation_switch_case ");
          break;
        }
      }
    });
    this.setState({ errors });
    return Object.keys(errors).length ? errors : null;
  }

  _handleOnSubmit = (e) => {
    e.preventDefault();
    let isDirty = {
      email: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const { userData } = this.state;
        this.login();
        console.log("Final API call: ", userData);
      }
    });
  };

  render() {
    const { activeIndex, userData, errors } = this.state;

    const slides2 = items.map((item, i) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}>
          <CarouselCaption
            captionText={item.caption}
            captionHeader={item.header}
          />
        </CarouselItem>
      );
    });

    return (
      <div className='app flex-row animated fadeIn'>
        <Container fluid>
          <Row>
            <Col md='6' lg='6' className='loginPgLeftSide lightBlueBg'>
              {/* don't remove the below div */}
              <div style={{ visibility: "hidden" }}>
                <h3 className='pl-4'>Link Tree</h3>
              </div>

              <img
                src={"assets/img/forgot-password-img.svg"}
                alt='Forgot Password Img'
                className='img-fluid loginImg'></img>

              <div className='loginContentLeftSide'>
                <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}>
                  {/* <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} /> */}
                  {slides2}
                </Carousel>
              </div>
            </Col>

            <Col md='6' lg='6' className='loginPgRightSide'>
              <div className='d-flex justify-content-between align-items-center pr-2 pl-3'>
                <img
                  src={"assets/img/company-logo.png"}
                  alt='Login Img'
                  className='projectLogo'
                />

                <a
                  href='javascript:void(0)'
                  className='backToLogin'
                  onClick={this._goLogin}>
                  Back to Login
                </a>
              </div>

              <div className='w-100 justify-content-center d-flex flex-column align-items-center'>
                <Form
                  className='loginFormWrapper'
                  onSubmit={this._handleOnSubmit}>
                  <h4>Forgot Password?</h4>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type='email'
                      placeholder='Your Email'
                      value={userData.email}
                      onChange={(e) =>
                        this._handleOnChange("email", e.target.value.trim())
                      }
                    />
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex' style={{ color: "red" }}>
                          {errors.email}
                        </small>
                      </Fragment>
                    )}
                  </FormGroup>

                  <Button
                    className='recruitechThemeBtn loginBtn'
                    onClick={this._handleOnSubmit}>
                    Reset Password
                  </Button>
                </Form>
              </div>

              {/* Footer */}
              <div>
                <div className='loginFooterLinks pl-3'>
                  <a href='javascript:void(0)'>Terms</a>
                  <a href='javascript:void(0)'>Privacy</a>
                  <a href='javascript:void(0)'>Support</a>
                </div>
                <div className='copyrightWrap pl-3'>
                  Link Tree &#169; 2020.
                  <div>
                    Powered By:{" "}
                    <a
                      href='https://www.logic-square.com/'
                      target='_blank'
                      className='lsWebsite'>
                      Logic Square
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgotPassword;
