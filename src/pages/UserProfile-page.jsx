import React, { Component, Fragment } from "react";
import { Col, Container, Row, Button, Label, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { getUserProfile } from "../http/http-calls";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      contentData: [],
      avatarLink: "",
    };
  }
  componentDidMount() {
    let userName = this.props.match.params.userName;
    console.log(userName);
    getUserProfile(userName)
      .then((res) => {
        console.log(res);
        this.setState({
          username: res.page._user.userName,
          contentData: res.page.contents,
          avatarLink: res.page._user.avatarLink,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { contentData, avatarLink, username } = this.state;
    const showButton = () => {
      if (contentData === undefined || contentData === null) {
        console.log("page is empty while displaying");
      } else {
        return contentData.map((data) => {
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

    return (
      <div className='app flex-row animated fadeIn innerPagesBg'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='10' xl='8'>
              <div className='d-flex justify-content-start align-items-center my-3'>
                <h4 className='pg-title'>Profile</h4>
              </div>

              <Card className='userDetails mb-4'>
                <CardBody>
                  <div className='text-center'>
                    <Label className='btn uploadBtnProfile'>
                      <input type='file' style={{ display: "none" }} />
                      {avatarLink ? (
                        <img
                          src={avatarLink}
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
                    <h5>{`@${username}`}</h5>
                  </div>

                  <div className='mt-4'>{showButton()}</div>
                </CardBody>
              </Card>
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
export default connect(mapStateToProps)(UserProfile);
// export default ProfilePreview;
