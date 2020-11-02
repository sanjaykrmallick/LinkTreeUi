import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
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
import { signUp, checkUsername } from "../http/http-calls";
import { ToastsContainer, ToastsStore } from "react-toasts";
const items = [
  {
    header: "Title",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.",
  },
];

class RequestDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      userData: {
        email: "",
        username: "",
        password: "",
        re_password: "",
      },
      isDirty: {
        email: "",
        username: "",
        password: "",
        re_password: "",
      },
      errors: {},
      isAvail: false,
      type: "password",
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

  _signUp = (e) => {
    e.preventDefault();
    let isDirty = {
      email: true,
      password: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const signupData = {
          email: this.state.userData.email,
          userName: this.state.userData.username,
          password: this.state.userData.password,
        };
        signUp(signupData).then((res) => console.log(res));
        ToastsStore.success("Successfully Signed-Up ");
      } else {
        ToastsStore.error("Problem in Sign-Up");
      }
    });
    // this.props.history.push("/login");
  };
  login = () => {
    this.props.history.push("/login");
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
    const { userData, isDirty, errors, isAvail } = this.state;
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
        case "username": {
          const obj = {
            userName: userData.username,
          };
          if (isDirty.username) {
            if (!userData.username.trim().length) {
              errors[each] = "* Please fill the above field";
            } else if (!(this.checkUser(obj) && isAvail)) {
              errors[each] = "Enter Unique Username";
            } else {
              delete errors[each];
              isDirty.username = false;
            }
          }
          break;
        }
        case "password": {
          if (isDirty.password) {
            if (!userData.password.trim().length) {
              errors.password = "*Required";
            } else if (
              userData.password.trim().length &&
              !new RegExp(
                // `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$`
                `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`
              ).test(userData.password)
            ) {
              errors.password = "*Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special Character.";
            } else {
              delete errors[each];
              isDirty.password = false;
            }
          }
          break;
        }
        case "re_password": {
          if (isDirty.re_password) {
            if (!userData.re_password.trim().length) {
              errors.re_password = "*Required";
            } else if (
              userData.re_password.trim().length &&
              userData.re_password !== userData.password
            ) {
              errors.re_password = "Password not matched";
            } else {
              delete errors[each];
              isDirty.re_password = false;
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
      username: true,
      password: true,
      re_password: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const { userData } = this.state;
        console.log("Final API call: ", userData);
      }
    });
  };

  checkUser = (userName) => {
    checkUsername(userName).then((res) => {
      if (res.isAvailable) {
        this.setState({
          isAvail: true,
        });
      } else {
        this.setState({
          isAvail: false,
        });
      }
    });
    return true;
  };
  handleClick = () =>
    this.setState(({ type }) => ({
      type: type === "password" ? "text" : "password",
    }));

  render() {
    const { activeIndex, userData, errors, isAvail, type } = this.state;

    const slides2 = items.map((item) => {
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
                src={"assets/img/signup-img.svg"}
                alt='Sign Up Img'
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

            <Col md='6' lg='6' className='loginPgRightSide signupPgRightSide'>
              <img
                src={"assets/img/company-logo.png"}
                alt='Login Img'
                className='projectLogo pl-3 mb-3'
              />

              <div className='w-100 justify-content-center d-flex flex-column align-items-center'>
                <Form
                  className='loginFormWrapper requestDemoForm'
                  onSubmit={this._handleOnSubmit}>
                  <h4>Sign Up</h4>

                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type='email'
                      placeholder='Enter Email'
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

                  <FormGroup className='position-relative'>
                    <Label>Username</Label>
                    <Input
                      type='text'
                      placeholder='Enter Username'
                      value={userData.username}
                      onChange={(e) =>
                        this._handleOnChange("username", e.target.value)
                      }
                    />
                    {/* eye icon for viewing the entered password */}

                    {/* toggle the above icon with the below icon */}

                    {isAvail ? (
                      <span
                        className='fa fa-check-circle'
                        style={{
                          position: "absolute",
                          marginLeft: "95%",
                          marginTop:"-5%",
                          color:"green",
                        }}></span>
                    ) : (
                      <span
                        className='fa fa-times-circle'
                        style={{
                          position: "absolute",
                          marginLeft: "95%",
                          marginTop:"-5%",
                          color:"red",
                        }}></span>
                    )}
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex' style={{ color: "red" }}>
                          {errors.username}
                        </small>
                      </Fragment>
                    )}
                  </FormGroup>

                  <FormGroup className='position-relative'>
                    <Label>Password</Label>
                    <Input
                      type={type}
                      placeholder='Enter Password'
                      style={{ paddingRight: 35 }}
                      title='Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special Character.'
                      value={userData.password}
                      onChange={(e) =>
                        this._handleOnChange("password", e.target.value)
                      }
                      required
                    />

                    <span onClick={this.handleClick} style={{
                          position: "absolute",
                          marginLeft:"100%" 
                        }}>
                      {type === "password" ? (
                        <span className='fa fa-eye-slash eyeIcon'></span>
                      ) : (
                        <span className='fa fa-eye eyeIcon '></span>
                      )}
                    </span>
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex' style={{ color: "red" }}>
                          {errors.password}
                        </small>
                      </Fragment>
                    )}
                  </FormGroup>
                  <FormGroup className='position-relative'>
                    <Label>Repeat Password</Label>
                    <Input
                      type={type}
                      placeholder='Repeat Password'
                      style={{ paddingRight: 35 }}
                      title='Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special Character.'
                      value={userData.re_password}
                      onChange={(e) =>
                        this._handleOnChange("re_password", e.target.value)
                      }
                      required
                    />
                    <span onClick={this.handleClick} style={{
                          position: "absolute",
                          marginLeft:"100%" 
                        }}>
                      {type === "password" ? (
                        <span className='fa fa-eye-slash eyeIcon'></span>
                      ) : (
                        <span className='fa fa-eye eyeIcon '></span>
                      )}
                    </span>
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex' style={{ color: "red" }}>
                          {errors.re_password}
                        </small>
                      </Fragment>
                    )}
                    
                  </FormGroup>

                  <Button
                    className='recruitechThemeBtn loginBtn'
                    style={{ marginTop: 30 }}
                    onClick={this._signUp}>
                    Get Started
                  </Button>
                </Form>

                <div className='register mt-0 mb-3'>
                  Already have an account?{" "}
                  <a href='javascript:void(0)' onClick={this.login}>
                    Login
                  </a>
                </div>
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

export default RequestDemo;
