import React, { Component, Fragment } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Card,
  CardBody,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import {
  uploadCloudinary,
  updateUserData,
  getUserData,
} from "../http/http-calls";
import { addTemplate, addUserAvatar } from "../redux/actions/user_data";
import { connect } from "react-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class Appearance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: [false, false, false, false],
      selectedTheme: "",
      src: null,
      crop: {
        unit: "%",
        width: 30,
        aspect: 1,
      },
      imgUpload:false,
    };
    this._uploadImage = this._uploadImage.bind(this._uploadImage);
  }

  componentDidMount() {
    getUserData().then((res) => {
      console.log(res);
      this.setState({ selectedTheme: res.user.template });
    });
  }

  _toggleModal = (index) => {
    const { modals } = this.state;
    modals[index] = !modals[index];
    this.setState({
      modals,
      imgRes:false,
    });
  };

  _uploadImage = () => {
    const { croppedImageUrl } = this.state;
    const file = croppedImageUrl;
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
                this._toggleModal(4)
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

  _handleOnClickTheme = (theme) => {
    const obj = {
      template: theme,
    };

    updateUserData(obj)
      .then((res) => {
        console.log("cloudinary res upload", res);
        if (!res.error) {
          console.log(res);
          this.props.addTemplate(res.user.template);
          this.setState({ selectedTheme: res.user.template });
        }
      })
      .catch((err) => console.log(err));
  };

  _socialShare = () => {
    let userUrl = window.location.href;
    userUrl = userUrl.substring(0, userUrl.lastIndexOf("/"));
    console.log(userUrl);

    return (
      <Fragment>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <FacebookShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Facebook : '
              className='Demo__some-network__share-button'>
              <FacebookIcon size={40} round />
              <p style={{ margin: "0" }}>Facebook</p>
            </FacebookShareButton>
          </div>
          <div>
            <FacebookMessengerShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Messenger : '
              className='Demo__some-network__share-button'>
              <FacebookMessengerIcon size={40} round />
              <p style={{ margin: "0" }}>Messenger</p>
            </FacebookMessengerShareButton>
          </div>
          <div>
            <LinkedinShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Linkedin : '
              className='Demo__some-network__share-button'>
              <LinkedinIcon size={40} round />
              <p style={{ margin: "0" }}>Linkedin</p>
            </LinkedinShareButton>
          </div>
          <div>
            <TelegramShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Telegram : '
              className='Demo__some-network__share-button'>
              <TelegramIcon size={40} round />
              <p style={{ margin: "0" }}>Telegram</p>
            </TelegramShareButton>
          </div>
          <div>
            <TwitterShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Twitter : '
              className='Demo__some-network__share-button'>
              <TwitterIcon size={40} round />
              <p style={{ margin: "0" }}>Twitter</p>
            </TwitterShareButton>
          </div>
          <div>
            <WhatsappShareButton
              url={
                `${userUrl}` +
                "/profile" +
                "/" +
                `${this.props.userData.userName}`
              }
              title='Whatsapp : '
              className='Demo__some-network__share-button'>
              <WhatsappIcon size={40} round />
              <p style={{ margin: "0" }}>Whatsapp</p>
            </WhatsappShareButton>
          </div>
        </div>
      </Fragment>
    );
  };
  showButton = () => {
    const { selectedTheme } = this.state;
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
                className={
                  selectedTheme === "Dark" || selectedTheme === "Scooter"
                    ? "btnOrange btnLight"
                    : selectedTheme === "Leaf"
                    ? "btnOrange btnLeaf"
                    : selectedTheme === "Moon"
                    ? "btnOrange btnMoon"
                    : "btnOrange"
                }
                onClick={() => window.open(`${data.content.url}`, "_blank")}>
                {data.content.title}
              </Button>
            </Fragment>
          );
        }
      });
    }
  };

  //// image crop
  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          // window.URL.revokeObjectURL(this.fileUrl);
          // this.fileUrl = window.URL.createObjectURL(blob);
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }
  onClickImage=()=>{
    this.setState({croppedImageUrl:"",src:"",imgUpload:false})
    this._toggleModal(4)
  }
  onClickUpload=()=>{
    if(this.state.src===null || this.state.src===""){
      this.setState({imgUpload:true})
      
    }else{
      this._uploadImage()
    }
    
  }

  render() {
    const { selectedTheme, crop, croppedImageUrl, src } = this.state;

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
                          // onChange={(e) => this._uploadImage(e)}
                          onChange={this.onSelectFile}
                          onClick={this.onClickImage}
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
                          className={
                            selectedTheme === "Light"
                              ? "selectTheme themeSeleted"
                              : "selectTheme"
                          }
                          onClick={() => this._handleOnClickTheme("Light")}>
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
                          className={
                            selectedTheme === "Dark"
                              ? "selectTheme themeSeleted"
                              : "selectTheme"
                          }
                          onClick={() => this._handleOnClickTheme("Dark")}>
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
                          className={
                            selectedTheme === "Scooter"
                              ? "selectTheme themeSeleted"
                              : "selectTheme"
                          }
                          onClick={() => this._handleOnClickTheme("Scooter")}>
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
                          className={
                            selectedTheme === "Leaf"
                              ? "selectTheme themeSeleted"
                              : "selectTheme"
                          }
                          onClick={() => this._handleOnClickTheme("Leaf")}>
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
                          className={
                            selectedTheme === "Moon"
                              ? "selectTheme themeSeleted"
                              : "selectTheme"
                          }
                          onClick={() => this._handleOnClickTheme("Moon")}>
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
                <Button
                  className='shareProfileBtn btnMoon'
                  onClick={() => this._toggleModal(3)}>
                  Share
                </Button>
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

                  <div className='mt-4'>{this.showButton()}</div>
                </div>{" "}
                {/* profilePreview */}
              </div>
            </Col>
          </Row>

          {/* Modal for Share Link */}
          <Modal
            isOpen={this.state.modals[3]}
            toggle={() => this._toggleModal(3)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => this._toggleModal(3)}>
              Share Link
            </ModalHeader>
            <ModalBody className='modalContent text-center'>
              <Card className='userDetails mb-4'>
                <CardBody>{this._socialShare()}</CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                className='modalBtnCancel'
                toggle={() => this._toggleModal(3)}
                onClick={() => this._toggleModal(3)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal for image Crop and Upload */}
          <Modal
            isOpen={this.state.modals[4]}
            toggle={() => this._toggleModal(4)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => this._toggleModal(4)}>
              Image Upload
            </ModalHeader>
            <ModalBody className='modalContent text-center'>
              <Card className='userDetails mb-4'>
                <CardBody>
                  <h5>Crop Your Image</h5>
                  {src && (
                    <ReactCrop
                      src={src}
                      crop={crop}
                      ruleOfThirds
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                  )}
                </CardBody>
                  {this.state.imgUpload?<h6 style={{color:"red"}}>No File Selected</h6>:<Fragment></Fragment>}
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                className='modalBtnCancel'
                toggle={() => this._toggleModal(4)}
                onClick={() => this._toggleModal(4)}
                >
                Close
              </Button>
              <Button
                className='modalBtnSave'
                toggle={() => this._toggleModal(4)}
                //onclick
                onClick={this.onClickUpload}>
                Upload
              </Button>
            </ModalFooter>
          </Modal>
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
    addTemplate: (theme) => dispatch(addTemplate(theme)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Appearance);
// export default Appearance;
