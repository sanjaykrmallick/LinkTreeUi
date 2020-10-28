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
import { findPage, createPage, createContent } from "../http/http-calls";
import {
  addContent,
  editContent,
  removeContent,
  addId,
} from "../redux/actions/content_data";
import { connect } from "react-redux";
import { ToastsStore } from "react-toasts";

class Links extends Component {
  state = {
    modals: [false, false],
    contentData: {
      title: "",
      url: "",
    },
    findPageNull: false,
    pageContents: [],
    pageId: "",
  };

  componentDidMount() {
    findPage().then((res) => {
      if (res.page === null) {
        this.setState({ findPageNull: true });
      } else {
        this.setState({
          pageContents: res.page.contents,
          pageId: res.page._id,
        });
        console.log("some contents are there :", res);
      }
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
    // debugger
    const { contentData } = this.state;
    contentData[field] = value;
    this.setState({ contentData }, () => {
      console.log("on chnge value ", this.state);
    });
  };

  _addContentData = () => {
    const { contentData, pageContents, pageId } = this.state;
    if (this.state.findPageNull) {
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
          // this.props.addContent();
          // this.props.addId(res.page.id);
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
        console.log("createContent: ", res);
        const lastContent = res.page.contents[res.page.contents.length - 1];
        console.log("LastContent:", lastContent);
        // this.props.addContent(content);
        this.setState({ pageContents: res.page.contents });
        console.log("added data list: ", pageContents);
      });
    }
  };
  render() {
    const { pageContents, contentData } = this.state;
    const cardBodyData = () => {
      debugger
      if (pageContents === undefined || pageContents === null) {
         console.log("page is empty while displaying");
      } else {
         return pageContents.map((data) => (
          //  console.log("foreach:",data)
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
                    id='exampleCustomSwitch'
                    name='customSwitch'
                    label=''
                    checked
                    className='disableLink'
                  />

                  <Button className='delLinkBtn'>
                    <i className='fa fa-pencil'></i>
                  </Button>
                  <Button
                    className='delLinkBtn'
                    onClick={() => this._toggleModal(2)}>
                    <i className='fa fa-trash-o text-danger'></i>
                  </Button>
                </div>
              </div>
            </div>
          </Fragment>
        ));
      }
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
                    onClick={() => this._toggleModal(1)}>
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
                <Button className='shareProfileBtn'>Share</Button>
                <div className='profilePreview'>
                  <div className='text-center'>
                    <Label className='btn uploadBtnProfile'>
                      <input type='file' style={{ display: "none" }} />
                      <img
                        alt=''
                        className=''
                        src={"assets/img/user-img-default.png"}
                      />
                    </Label>
                    <h5>@johndoe</h5>
                  </div>

                  <div className='mt-4'>
                    <Button className='btnOrange'>LinkedIn</Button>
                    <Button className='btnOrange'>Facebook</Button>
                  </div>
                </div>{" "}
                {/* profilePreview */}
              </div>
            </Col>
          </Row>

          {/* Modal for showing "Create New Link" */}
          <Modal
            isOpen={this.state.modals[1]}
            toggle={() => this._toggleModal(1)}
            className='modal-dialog-centered'>
            <ModalHeader toggle={() => this._toggleModal(1)}>
              Add New Link
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
              </FormGroup>
              <FormGroup>
                <Label>URL</Label>
                <Input
                  type='text'
                  placeholder='Enter URL'
                  value={this.state.contentData.url}
                  onChange={(e) => this._handleOnChange("url", e.target.value)}
                />
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
                onClick={() => this._addContentData()}>
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
                toggle={() => this._toggleModal(2)}>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addContent: (content) => dispatch(addContent(content)),
    removeContent: (_id) => dispatch(removeContent(_id)),
    editContent: (content) => dispatch(editContent(content)),
    addId: (_id) => dispatch(addId(_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
// export default Links;