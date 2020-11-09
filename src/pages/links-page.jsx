import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Col,
  Container,
  Row,
  Button,
  Card,
  CardBody,
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  findPage,
  createPage,
  createContent,
  getUserData,
} from "../http/http-calls";
import { addContent, addId } from "../redux/actions/content_data";
import { addUserAvatar, addTemplate } from "../redux/actions/user_data";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { connect } from "react-redux";
import  QRCode  from "qrcode.react";

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

class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: [false, false, false],
      contentData: {
        title: "",
        url: "",
      },
      isDirty: {
        title: "",
        url: "",
      },
      editContentData: {
        title: "",
        url: "",
      },
      findPageNull: false,
      pageContents: [],
      pageId: "",
      errors: {},
      dltModalId: "",
      edtModalId: "",
      contentDatanull: false,
      selectedTheme: "",
      addDelModal: "",
      userProfileUrl: "",
      copied: false,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    const { pageContents } = this.state;
    findPage().then((res) => {
      if (res.page === null) {
        this.setState({ findPageNull: true });
      } else {
        this.setState({
          pageContents: res.page.contents,
          pageId: res.page._id,
        });
        console.log("some contents are there :", res);
        this.props.addContent(res.page.contents);
        console.log("this.props", this.props);
      }
    });
    console.log(pageContents);

    getUserData().then((res) => {
      console.log(res);
      this.props.addUserAvatar(res.user.avatarLink);
      this.props.addTemplate(res.user.template);
      this.setState({ selectedTheme: res.user.template });
    });

    let userUrl = window.location.href;
    userUrl = userUrl.substring(0, userUrl.lastIndexOf("/"));
    console.log(userUrl);
    this.setState({
      userProfileUrl:
        `${userUrl}` + "/profile" + "/" + `${this.props.userData.userName}`,
    });
  }

  _toggleModal = (index) => {
    const { modals } = this.state;
    modals[index] = !modals[index];
    this.setState({
      modals,
    });
  };

  _handleOnChange = (field, value) => {
    const { contentData, isDirty } = this.state;
    if (!value && typeof value === "number") {
      contentData[field] = "";
      isDirty[field] = true;
      this.setState({ contentData, isDirty }, () => {
        this._validateForm();
        console.log(this.state);
      });
      return;
    } else {
      contentData[field] = value;
    }
    isDirty[field] = true;
    this.setState({ contentData, isDirty }, () => {
      this._validateForm();
      console.log(this.state);
    });
  };
  // onsubmit for modal
  _validateForm() {
    // debugger;
    const { contentData, isDirty, errors } = this.state;
    Object.keys(contentData).forEach((each) => {
      switch (each) {
        case "url": {
          if (isDirty.url) {
            if (!contentData.url.trim().length) {
              errors.url = "*Required";
            } else if (
              contentData.url.trim().length &&
              !new RegExp(
                "^http(s?):\\/\\/(www\\.)?(((\\w+(([\\.\\-]{1}([a-z]{2,})+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)|(\\w+((\\.([a-z]{2,})+)+)(\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*)((\\:[0-9]{1,5}(\\/[a-zA-Z0-9\\_\\=\\?\\&\\.\\#\\-\\W]*)*$)*))$"
              ).test(contentData.url)
            ) {
              errors.url = "*Enter a valid URL";
            } else {
              delete errors[each];
              isDirty.url = false;
            }
          }
          break;
        }
        case "title": {
          if (isDirty.title) {
            if (!contentData.title.trim().length) {
              errors[each] = "* Please fill the above field";
            } else {
              delete errors[each];
              isDirty.title = false;
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

  _handleOnSubmitAddContent = () => {
    let isDirty = {
      url: true,
      title: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const { contentData } = this.state;
        console.log("Final API call: ", contentData);
        this.setState({ addLinkFlag: false });
        this._addContentData();
      }
    });
  };
  _handleOnSubmitEditModal = (e) => {
    let isDirty = {
      url: true,
      title: true,
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      console.log(errors);
      if (!errors) {
        const { contentData } = this.state;
        console.log("Final API call: ", contentData);
        this._editModal();
      }
    });
    this.setState({ editLinkFlag: false });
  };

  _addContentData = () => {
    const { contentData, pageContents, pageId } = this.state;
    if (
      contentData.url === null ||
      contentData.title === null ||
      contentData.url === undefined ||
      contentData.title === undefined ||
      contentData.url === "" ||
      contentData.title === ""
    ) {
      this.setState({ contentDatanull: true });
    } else if (this.state.findPageNull) {
      const createData = {
        contents: [
          {
            content: {
              title: contentData.title,
              url: contentData.url,
            },
            contentType: "socialLink",
            subContentType: "facebook",
          },
        ],
      };
      createPage(createData).then((res) => {
        console.log("createPage :", res);
        if (!res.error) {
          this.setState({ pageContents: res.page.contents });
          this.setState({
            contentData: {
              title: "",
              url: "",
            },
          });
        }
      });
    } else {
      console.log("page is already created");
      const updateData = [
        ...pageContents,
        {
          content: {
            title: contentData.title,
            url: contentData.url,
          },
          contentType: "socialLink",
          subContentType: "facebook",
        },
      ];
      const obj = {
        contents: updateData,
      };
      createContent(obj, pageId).then((res) => {
        console.log("createContentLst: ", res);
        this.setState({ pageContents: res.page.contents });
        console.log("added data list: ", pageContents);
      });
      this.setState({
        contentData: {
          title: "",
          url: "",
        },
        addLinkFlag: false,
      });
    }
    this.props.addContent(pageContents);
    this.setState({ modals: [false, false] });
  };

  _handleToggle = (flag, _id) => {
    const { pageContents, pageId } = this.state;
    if (flag) {
      pageContents.map((e) => {
        if (_id === e._id) {
          e.status = flag;
        }
        //setstate and APi
        this.setState({ pageContents });
      });
    } else {
      pageContents.map((e) => {
        if (_id === e._id) {
          e.status = flag;
        }
        //setstate and APi
        this.setState({ pageContents });
      });
    }
    const obj = {
      contents: pageContents,
    };
    createContent(obj, pageId).then((res) => {
      console.log("createContentLst: ", res);
      this.setState({ pageContents: res.page.contents });
      console.log("added data list: ", pageContents);
    });
  };

  _editModal = () => {
    const { pageContents, pageId, edtModalId, contentData } = this.state;
    if (pageContents === null || pageContents === undefined) {
      return console.log("No Link item present");
    } else {
      var index = pageContents.findIndex((item) => item._id === edtModalId);
      console.log(index);
      const editedContent = {
        content: {
          title: contentData.title,
          url: contentData.url,
        },
        _id: edtModalId,
        status: true,
        contentType: "socialLink",
        subContentType: "facebook",
      };
      pageContents.splice(index, 1, editedContent);
      console.log(pageContents);
      const obj = {
        contents: pageContents,
      };
      createContent(obj, pageId).then((res) => {
        console.log("createContentLst: ", res);
        // const lastContent = res.page.contents[res.page.contents.length - 1];
        // console.log("newAddedContent:", lastContent);
        this.setState({ pageContents: res.page.contents });
        console.log("added data list: ", pageContents);
      });
      this.setState({
        contentData: {
          title: "",
          url: "",
        },
        editLinkFlag: false,
      });
    }
    this.setState({
      modals: [false, false],
      editContentData: { title: "", url: "" },
      contentData: { title: "", url: "" },
    });
  };

  //// code for list reordering
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#fff",
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "#fff",
  });

  onDragEnd(result) {
    const { pageId } = this.state;
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const pageContents = this.reorder(
      this.state.pageContents,
      result.source.index,
      result.destination.index
    );

    this.setState({
      pageContents,
    });

    this.props.addContent(pageContents);
    const obj = {
      contents: pageContents,
    };
    createContent(obj, pageId).then((res) => {
      console.log("createContentLst: ", res);
      // const lastContent = res.page.contents[res.page.contents.length - 1];
      // console.log("newAddedContent:", lastContent);
      this.setState({ pageContents: res.page.contents });
      // console.log("added data list: ", pageContents);
    });
  }
  _socialShare = () => {
    const { userProfileUrl } = this.state;

    return (
      <Fragment>
        <div>
          <h6>Social Link</h6>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <FacebookShareButton
                url={userProfileUrl}
                title='Facebook : '
                className='Demo__some-network__share-button'>
                <FacebookIcon size={40} round />
                <p style={{ margin: "0" }}>Facebook</p>
              </FacebookShareButton>
            </div>
            <div>
              <FacebookMessengerShareButton
                url={userProfileUrl}
                title='Messenger : '
                className='Demo__some-network__share-button'>
                <FacebookMessengerIcon size={40} round />
                <p style={{ margin: "0" }}>Messenger</p>
              </FacebookMessengerShareButton>
            </div>
            <div>
              <LinkedinShareButton
                url={userProfileUrl}
                title='Linkedin : '
                className='Demo__some-network__share-button'>
                <LinkedinIcon size={40} round />
                <p style={{ margin: "0" }}>Linkedin</p>
              </LinkedinShareButton>
            </div>
            <div>
              <TelegramShareButton
                url={userProfileUrl}
                title='Telegram : '
                className='Demo__some-network__share-button'>
                <TelegramIcon size={40} round />
                <p style={{ margin: "0" }}>Telegram</p>
              </TelegramShareButton>
            </div>
            <div>
              <TwitterShareButton
                url={userProfileUrl}
                title='Twitter : '
                className='Demo__some-network__share-button'>
                <TwitterIcon size={40} round />
                <p style={{ margin: "0" }}>Twitter</p>
              </TwitterShareButton>
            </div>
            <div>
              <WhatsappShareButton
                url={userProfileUrl}
                title='Whatsapp : '
                className='Demo__some-network__share-button'>
                <WhatsappIcon size={40} round />
                <p style={{ margin: "0" }}>Whatsapp</p>
              </WhatsappShareButton>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <div>
          <h6>Copy to Clipboard</h6>
          <div className='container'>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <textarea className='form-control' value={userProfileUrl} />
              <br />
              <CopyToClipboard
                text={userProfileUrl}
                onCopy={() => this.setState({ copied: true })}>
                <button className='btn btn-info' style={{ width: "60%" }}>
                  Copy to clipboard with button
                </button>
              </CopyToClipboard>
              {this.state.copied ? (
                <span style={{ color: "red" }}>Copied.</span>
              ) : null}
            </div>
          </div>
        </div>
        <br />
        <hr />
        <div>
          <h6>QR Code</h6>
          <div className='container'>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <QRCode value={userProfileUrl} fgColor="#333"
            bgColor="#fff" renderAs="svg"/>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    const {
      pageContents,
      errors,
      dltModalId,
      pageId,
      addLinkFlag,
      selectedTheme,
      addDelModal,
    } = this.state;
    const cardBodyData = () => {
      if (pageContents === undefined || pageContents === null) {
        console.log("page is empty while displaying");
      } else {
        return (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId='droppable'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={this.getListStyle(snapshot.isDraggingOver)}>
                  {pageContents.map((data, index) => (
                    <Draggable
                      key={data._id}
                      draggableId={data._id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={this.getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>
                          <Fragment>
                            <div className='addedLinksWrap'>
                              <div className='moveLink'>
                                <i className='fa fa-ellipsis-v'></i>
                              </div>
                              <div className='addedLinkDetails'>
                                <h5>{data.content.title}</h5>
                                <p>{data.content.url}</p>
                                <div className='actionBtnWrap'>
                                  <CustomInput
                                    type='switch'
                                    id={"exampleCustomSwitch" + data._id}
                                    name='customSwitch'
                                    label=''
                                    checked={data.status}
                                    className='disableLink'
                                    key={data._id}
                                    onClick={(e) =>
                                      this._handleToggle(
                                        e.target.checked,
                                        data._id
                                      )
                                    }
                                  />
                                  <Button
                                    className='editLinkBtn'
                                    onClick={() => {
                                      this.setState({
                                        edtModalId: data._id,
                                        contentData: {
                                          title: data.content.title,
                                          url: data.content.url,
                                        },
                                        addDelModal: "edit",
                                        errors: {},
                                      });
                                      this._toggleModal(1);
                                    }}>
                                    <i className='fa fa-pencil'></i>
                                  </Button>
                                  <Button
                                    className='delLinkBtn'
                                    onClick={() => {
                                      this.setState({ dltModalId: data._id });
                                      this._toggleModal(2);
                                    }}>
                                    <i className='fa fa-trash-o text-danger'></i>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Fragment>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );
      }
    };
    const showButton = () => {
      if (pageContents === undefined || pageContents === null) {
        console.log("page is empty while displaying");
      } else {
        return pageContents.map((data) => {
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
    const deleteModal = () => {
      if (pageContents === null || pageContents === undefined) {
        return console.log("No Link item present");
      } else {
        var index = pageContents.findIndex((item) => item._id === dltModalId);
        pageContents.splice(index, 1);
        console.log("new list after delete: ", pageContents);
        const obj = {
          contents: pageContents,
        };
        createContent(obj, pageId).then((res) => {
          // debugger;
          console.log("deletedContent: ", res);
          this.setState({ pageContents: res.page.contents });
          console.log("New data list: ", pageContents);
        });
      }
      this.setState({ modals: [false, false] });
    };

    return (
      <div className='app flex-row animated fadeIn innerPagesBg'>
        <Container>
          <Row>
            <Col md='12'>
              <div className='addedLinksWrapper'>
                <div className='d-flex justify-content-between align-items-center my-3'>
                  <h4 className='pg-title'>Links</h4>

                  <Button
                    className='addBtn'
                    onClick={() => {
                      this.setState({
                        addDelModal: "add",
                        contentData: {
                          title: "",
                          url: "",
                        },
                        errors: {},
                      });
                      this._toggleModal(1);
                    }}>
                    <i className='fa fa-plus mr-1'></i> Add New Link
                  </Button>
                </div>

                <Card className='userDetails mb-4'>
                  <CardBody>
                    {this.state.findPageNull ? (
                      <Fragment>NO LINKS AVAILABLE</Fragment>
                    ) : (
                      cardBodyData()
                    )}
                  </CardBody>
                </Card>
              </div>

              <div className='profilePreviewWrap'>
                <Button
                  className='shareProfileBtn btnMoon'
                  onClick={() => this._toggleModal(3)}>
                  Share
                </Button>
                <div
                  className={
                    `profilePreview` + ` ` + `preview${selectedTheme}`
                  }>
                  <div className='text-center'>
                    <Label className='btn uploadBtnProfile'>
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
                    <h5
                      className={
                        selectedTheme === "Dark" || selectedTheme === "Scooter"
                          ? "text-white"
                          : "text-black"
                      }>{`@${this.props.userData.userName}`}</h5>
                  </div>

                  <div className='mt-4'>{showButton()}</div>
                </div>
                {/* profilePreview */}
              </div>
            </Col>
          </Row>

          {/* Modal for showing "Create New Link" && "EDIT LINK"*/}
          <Modal
            isOpen={this.state.modals[1]}
            toggle={() => this._toggleModal(1)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => this._toggleModal(1)}>
              {addDelModal === "add" ? "Add New Link" : "Edit Link"}
            </ModalHeader>
            <ModalBody className='modalContent'>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type='text'
                  placeholder='Enter Title'
                  value={this.state.contentData.title}
                  onChange={(e) =>
                    this._handleOnChange("title", e.target.value)
                  }
                />
                {errors && (
                  <Fragment>
                    <small className='d-flex' style={{ color: "red" }}>
                      {errors.title}
                    </small>
                  </Fragment>
                )}
              </FormGroup>
              <FormGroup>
                <Label>URL</Label>
                <Input
                  type='text'
                  placeholder='Enter URL'
                  value={this.state.contentData.url}
                  onChange={(e) => this._handleOnChange("url", e.target.value)}
                />
                {errors && (
                  <Fragment>
                    <small className='d-flex' style={{ color: "red" }}>
                      {errors.url}
                    </small>
                  </Fragment>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                className='modalBtnCancel'
                toggle={() => this._toggleModal(1)}
                onClick={() => this._toggleModal(1)}>
                Cancel
              </Button>
              <Button
                className='modalBtnSave'
                toggle={() => this._toggleModal(1)}
                onClick={() => {
                  addDelModal === "add"
                    ? this._handleOnSubmitAddContent()
                    : this._handleOnSubmitEditModal();
                }}>
                {addDelModal === "add" ? "Create" : "Edit"}
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal for deleting an exisiting Link */}
          <Modal
            isOpen={this.state.modals[2]}
            toggle={() => this._toggleModal(2)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => this._toggleModal(2)}>
              Delete Link
            </ModalHeader>
            <ModalBody className='modalContent text-center'>
              <h5 className='mt-3 px-4' style={{ fontWeight: 400 }}>
                Are you sure you want to delete this Link? This cannot be
                undone.
              </h5>
            </ModalBody>
            <ModalFooter>
              <Button
                className='modalBtnCancel'
                toggle={() => this._toggleModal(2)}
                onClick={() => this._toggleModal(2)}>
                Cancel
              </Button>
              <Button
                className='modalBtnSave'
                toggle={() => this._toggleModal(2)}
                //onclick
                onClick={() => deleteModal()}>
                Delete
              </Button>
            </ModalFooter>
          </Modal>

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
    addContent: (pageContents) => dispatch(addContent(pageContents)),
    // removeContent: (_id) => dispatch(removeContent(_id)),
    // editContent: (content) => dispatch(editContent(content)),
    addId: (_id) => dispatch(addId(_id)),
    // addUser: (avatarLink) => dispatch(addUser(avatarLink))
    addUserAvatar: (avatarLink) => dispatch(addUserAvatar(avatarLink)),
    addTemplate: (theme) => dispatch(addTemplate(theme)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
// export default Links;
