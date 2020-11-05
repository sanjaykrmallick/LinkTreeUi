import React, { Component, Fragment } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Card,
  CardBody,
  CustomInput,
  Label,
} from "reactstrap";
import { uploadCloudinary, updateUserData,getUserData } from "../http/http-calls";
import { addTemplate, addUserAvatar } from "../redux/actions/user_data";
import { connect } from "react-redux";

class Appearance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: [false, false],
      selectedTheme: "",
    };
    this._uploadImage = this._uploadImage.bind(this._uploadImage);
  }

  componentDidMount(){
    getUserData().then((res) => {
      console.log(res);
      this.setState({selectedTheme:res.user.template})
    });
  }

  _uploadImage = (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    uploadCloudinary(fd)
      .then((res) => {
        console.log("cloudinary res", res);
        if (!res.error) {
          const obj = {
            avatarLink: res.url,
          };
          updateUserData(obj)
            .then((res) => {
              console.log("cloudinary res upload", res);
              if (!res.error) {
                this.props.addUserAvatar(res.user.avatarLink);
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  _toggleModal = (index) => {
    const { modals } = this.state;
    modals[index] = !modals[index];
    this.setState({
      modals,
    });
  };

  _handleOnClickTheme=(theme)=>{
    const obj = {
      template: theme,
    };
    
    updateUserData(obj)
            .then((res) => {
              console.log("cloudinary res upload", res);
              if (!res.error) {
               console.log(res)
               this.props.addTemplate(res.user.template)
                this.setState({selectedTheme:res.user.template})
              }
            })
            .catch((err) => console.log(err));
  }

  render() {
    const { selectedTheme } = this.state;
    const showButton = () => {
      if (
        this.props.contentData.contents === undefined ||
        this.props.contentData.contents === null
      ) {
        console.log("page is empty while displaying");
      } else {
        // this.props.userContents(pageContents)
        return this.props.contentData.contents.map((data) => {
          if (data.status) {
            return (
              <Fragment>
                <Button
                  key={data.content._id}
                  className={(selectedTheme==="Dark"||selectedTheme==="Scooter")?"btnOrange btnLight":(selectedTheme==="Leaf"?"btnOrange btnLeaf":(selectedTheme==="Moon"?"btnOrange btnMoon":"btnOrange"))}
                  onClick={() => window.open(`${data.content.url}`, "_blank")}>
                  {data.content.title}
                </Button>
              </Fragment>
            );
          }
        });
      }
    };
    // 'btnOrange btn btnLeaf'
    return (
      <div className='app flex-row animated fadeIn innerPagesBg'>
        <Container>
          <Row>
            <Col md='12'>
              <div className='addedLinksWrapper'>
                <div className='d-flex justify-content-start align-items-center my-3'>
                  <h4 className='pg-title'>Appearance</h4>
                </div>

                <Card className='userDetails mb-4'>
                  <CardBody>
                    <h4 style={{ fontWeight: 600, marginBottom: 0 }}>
                      Profile
                    </h4>
                    <div className='text-center'>
                      <Label className='btn uploadBtnProfile'>
                        <input
                          type='file'
                          style={{ display: "none" }}
                          onChange={(e) => this._uploadImage(e)}
                        />
                        {this.props.userData.avatarLink ? (
                          <img
                            src={this.props.userData.avatarLink}
                            alt='chosen'
                            style={{ height: "100px", width: "100px" }}
                          />
                        ) : (
                          <img
                            alt=''
                            className=''
                            src={"assets/img/user-img-default.png"}
                          />
                        )}
                        <i className='fa fa-pencil uploadIcon'></i>
                      </Label>
                    </div>
                  </CardBody>
                </Card>

                <Card className='userDetails mb-4'>
                  <CardBody>
                    <h4 style={{ fontWeight: 600, marginBottom: 0 }}>Themes</h4>
                    <Row>
                      <Col md={6} lg={4}>
                        <Button
                          className='selectTheme themeSeleted'
                          onClick={() =>
                            this._handleOnClickTheme("Light")
                          }>
                          <div className='themeLight'>
                            <div className='themeLightBtn'></div>
                            <div className='themeLightBtn'></div>
                            <div className='themeLightBtn'></div>
                          </div>
                        </Button>
                        <p className='themeName'>Light</p>
                      </Col>
                      <Col md={6} lg={4}>
                        <Button
                          className='selectTheme'
                          onClick={() =>
                            
                            this._handleOnClickTheme("Dark")
                          }>
                          <div className='themeDark'>
                            <div className='themeDarkBtn'></div>
                            <div className='themeDarkBtn'></div>
                            <div className='themeDarkBtn'></div>
                          </div>
                        </Button>
                        <p className='themeName'>Dark</p>
                      </Col>
                      <Col md={6} lg={4}>
                        <Button
                          className='selectTheme'
                          onClick={() =>
                            this._handleOnClickTheme("Scooter")
                          }>
                          <div className='themeScooter'>
                            <div className='themeScooterBtn'></div>
                            <div className='themeScooterBtn'></div>
                            <div className='themeScooterBtn'></div>
                          </div>
                        </Button>
                        <p className='themeName'>Scooter</p>
                      </Col>
                      <Col md={6} lg={4}>
                        <Button
                          className='selectTheme'
                          onClick={() =>
                            this._handleOnClickTheme("Leaf")
                          }>
                          <div className='themeLeaf'>
                            <div className='themeLeafBtn'></div>
                            <div className='themeLeafBtn'></div>
                            <div className='themeLeafBtn'></div>
                          </div>
                        </Button>
                        <p className='themeName'>Leaf</p>
                      </Col>
                      <Col md={6} lg={4}>
                        <Button
                          className='selectTheme'
                          onClick={() =>
                            this._handleOnClickTheme("Moon")
                          }>
                          <div className='themeMoon'>
                            <div className='themeMoonBtn'></div>
                            <div className='themeMoonBtn'></div>
                            <div className='themeMoonBtn'></div>
                          </div>
                        </Button>
                        <p className='themeName'>Moon</p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className='profilePreviewWrap'>
                <Button className='shareProfileBtn'>Share</Button>
                {/* change the theme class name accordingly, default is previewLight */}
                <div
                  className={
                    `profilePreview` + ` ` + `preview${selectedTheme}`
                  }>
                  <div className='text-center'>
                    <Label className='btn uploadBtnProfile'>
                      <input type='file' style={{ display: "none" }} />
                      {this.props.userData.avatarLink ? (
                        <img
                          src={this.props.userData.avatarLink}
                          alt='chosen'
                          style={{ height: "100px", width: "100px" }}
                        />
                      ) : (
                        <img
                          alt=''
                          className=''
                          src={"assets/img/user-img-default.png"}
                        />
                      )}
                    </Label>
                    {/* use class text-white in Dark and Scooter theme*/}
                    {/* <h5 className='text-black'>{`@${this.props.userData.userName}`}</h5> */}
                    <h5
                      className={
                        selectedTheme === "Dark" || selectedTheme === "Scooter"
                          ? "text-white"
                          : "text-black"
                      }>{`@${this.props.userData.userName}`}</h5>
                  </div>

                  <div className='mt-4'>{showButton()}</div>
                </div>{" "}
                {/* profilePreview */}
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
    contentData: state.contentData,
    userData: state.userData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addUserAvatar: (avatarLink) => dispatch(addUserAvatar(avatarLink)),
    addTemplate:(theme) => dispatch(addTemplate(theme)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Appearance);
// export default Appearance;
