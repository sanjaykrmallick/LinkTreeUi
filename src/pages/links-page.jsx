import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

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
import {
  addContent,
  editContent,
  removeContent,
  addId,
  addUserAvatar,
  // userContents
} from "../redux/actions/content_data";
// import{addUser} from "../redux/actions/user_data"
import { connect } from "react-redux";
import { ToastsStore } from "react-toasts";

class Links extends Component {
  state = {
    modals: [false, false],
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
    addLinkFlag: false,
    editLinkFlag: false,
    edtModalId: "",
    contentDatanull: false,
  };

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
                "(https?:\\//\\//(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\//\\//(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})"
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
        const lastContent = res.page.contents[res.page.contents.length - 1];
        console.log("newAddedContent:", lastContent);
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
    // this.props.addContent(pageContents); //
    this.props.addContent(pageContents);
    this.setState({ modals: [false, false] });
  };

  _handleToggle = (flag, _id) => {
    const { pageContents, pageId } = this.state;
    if (flag) {
      return pageContents.map((e) => {
        if (_id === e._id) {
          e.status = true;
        }
        //setstate and APi
        this.setState({ pageContents });
        const obj = {
          contents: pageContents,
        };
        createContent(obj, pageId).then((res) => {
          console.log("createContentLst: ", res);
          const lastContent = res.page.contents[res.page.contents.length - 1];
          console.log("newAddedContent:", lastContent);
          // this.props.addContent(content);
          this.setState({ pageContents: res.page.contents });
          console.log("added data list: ", pageContents);
        });
        window.location.reload(); //window
      });
    } else {
      pageContents.map((e) => {
        if (_id === e._id) {
          e.status = false;
        }
        //setstate and APi
        this.setState({ pageContents });
        const obj = {
          contents: pageContents,
        };
        createContent(obj, pageId).then((res) => {
          console.log("createContentLst: ", res);
          const lastContent = res.page.contents[res.page.contents.length - 1];
          console.log("newAddedContent:", lastContent);
          this.setState({ pageContents: res.page.contents });
          console.log("added data list: ", pageContents);
        });
      });
    }
    console.log(pageContents);
    // this.props.addContent(pageContents); //
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
        const lastContent = res.page.contents[res.page.contents.length - 1];
        console.log("newAddedContent:", lastContent);
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

  render() {
    const {
      pageContents,
      errors,
      dltModalId,
      pageId,
      addLinkFlag,
      editContentData,
    } = this.state;
    const cardBodyData = () => {
      if (pageContents === undefined || pageContents === null) {
        console.log("page is empty while displaying");
      } else {
        return pageContents.map((data) => {
          if (data.content.url === "" || data.content.title === "") {
            return false;
          } else {
            return (
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
                          this._handleToggle(e.target.checked, data._id)
                        }
                      />

                      <Button
                        className='delLinkBtn'
                        onClick={() => {
                          this.setState({
                            edtModalId: data._id,
                            contentData: {
                              title: data.content.title,
                              url: data.content.url,
                            },
                            editLinkFlag: true,
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
            );
          }
        });
      }
    };
    const showButton = () => {
      if (pageContents === undefined || pageContents === null) {
        console.log("page is empty while displaying");
      } else {
        // this.props.userContents(pageContents)
        return pageContents.map((data) => {
          if (data.status) {
            return (
              <Fragment>
                <Button
                  key={data.content._id}
                  className='btnOrange'
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
          const lastContent = res.page.contents[res.page.contents.length - 1];
          console.log("LastContent:", lastContent);
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
                      this.setState({ addLinkFlag: true });
                      this._toggleModal(1);
                    }}>
                    <i className='fa fa-plus mr-1'></i> Add New Link
                  </Button>
                </div>

                <Card className='userDetails mb-4'>
                  <CardBody>
                    {
                      this.state.findPageNull ? (
                        <Fragment>NO LINKS AVAILABLE</Fragment>
                      ) : (
                        cardBodyData()
                      )
                      // ( contentData.title==="" || contentData.url==="" ? <Fragment></Fragment> :cardBodyData())
                    }
                  </CardBody>
                </Card>
              </div>

              <div className='profilePreviewWrap'>
                <Button className='shareProfileBtn'>Share</Button>
                <div className='profilePreview'>
                  <div className='text-center'>
                    <Label className='btn uploadBtnProfile'>
                      {/* <input type='file' style={{ display: "none" }} />
                      <img
                        alt=''
                        className=''
                        src={"assets/img/user-img-default.png"}
                      /> */}
                      {this.props.contentData.avatarLink ? (
                        <img
                          src={this.props.contentData.avatarLink}
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
                    <h5>{`@${this.props.userData.userName}`}</h5>
                  </div>

                  <div className='mt-4'>{showButton()}</div>
                </div>{" "}
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
              {addLinkFlag ? "Add New Link" : "Edit Link"}
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
                  addLinkFlag
                    ? this._handleOnSubmitAddContent()
                    : this._handleOnSubmitEditModal();
                }}>
                Create
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
                toggle={() => this._toggleModal(2)}>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
// export default Links;
