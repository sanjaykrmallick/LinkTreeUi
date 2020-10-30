import React, { Component, Fragment } from "react";
import { withRouter,Link } from "react-router-dom";
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
import { login } from "../http/http-calls";
import { connect } from "react-redux";
import { addUser } from "../redux/actions/user_data";
const items = [
  {
    header: "Title",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.",
  },
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      userData: {
        token: "",
        username: "",
        password: "",
      },
      isDirty: {
        username: false,
        password: false,
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

  forgotPassword = () => {
    this.props.history.push("/forgot-password");
  };

  requestDemo = () => {
    this.props.history.push("/signup");
  };

  users = () => {
    const { username, password } = this.state.userData;
    const userLoginData = {
      handle: username,
      password: password,
    };
    login(userLoginData)
      .then((res) => {
        let userLoginData = {
          userName: res.handle,
          token: res.token,
        };
        console.log("userLoginData: ", userLoginData);
        ToastsStore.success("Successfully Logged-In ");
        this.props.addUser({ userLoginData });
        this.props.history.push("/links");
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login")
        ToastsStore.error("Please check Username & Password");
      });
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
        case "username": {
          if (isDirty.username) {
            if (!userData.username.trim().length) {
              errors[each] = "* Please fill the above field";
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
                `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`
              ).test(userData.password)
            ) {
              errors.password = "*Invalid Password";
            } else {
              delete errors[each];
              isDirty.password = false;
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
      username: true,
      password: true,
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

  render() {
    const { activeIndex, userData, errors } = this.state;

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
                src={"assets/img/login-img.svg"}
                alt='Login Img'
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
              <img
                src={"assets/img/company-logo.png"}
                alt='Login Img'
                className='projectLogo pl-3'
              />

              <div className='w-100 justify-content-center d-flex flex-column align-items-center'>
                <Form className='loginFormWrapper'>
                  <h4>Login to your account</h4>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      type='text'
                      placeholder='Your Username'
                      value={userData.username}
                      onChange={(e) =>
                        this._handleOnChange("username", e.target.value)
                      }
                    />
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex'>
                          {/* Enter a valid username */}
                          {errors.username}
                        </small>
                      </Fragment>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <Input
                      type='password'
                      placeholder='Your Password'
                      title='Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special Character.'
                      value={userData.email}
                      onChange={(e) =>
                        this._handleOnChange("password", e.target.value.trim())
                      }
                    />
                    {/* error msg, currently hidden */}
                    {errors && (
                      <Fragment>
                        <small className='d-flex'>
                          {/* Password entered is incorrect */}
                          {errors.password}
                        </small>
                      </Fragment>
                    )}
                  </FormGroup>

                  <Button
                    className='recruitechThemeBtn loginBtn'
                    onClick={this.users}>
                    Login
                  </Button>
                </Form>

                <div className='registerWrap'>
                  <div className='ml-3'>
                    {/* <Input type="checkbox" id="rememberMe" />
                    <Label for="rememberMe" className="mb-0">Remember Me</Label> */}
                  </div>

                  <a
                    href='javascript:void(0)'
                    className='forgotPassword'
                    onClick={this.forgotPassword}>
                    Forgot Password?
                  </a>
                </div>

                <div className='register'>
                  Don't have an account?{" "}
                  <a href='javascript:void(0)' onClick={this.requestDemo}>
                    Sign Up!
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

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (userLoginData) => dispatch(addUser(userLoginData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
// export default Login;
