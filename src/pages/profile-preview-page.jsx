import React, { Component, Fragment } from "react";
import { Col, Container, Row, Button, Label, Card, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { getUserData } from "../http/http-calls";

class ProfilePreview extends Component {
  state={
    selectedTheme:""
  }
  componentDidMount(){
    this.setState({selectedTheme:this.props.userData.template})
  }
  render() {
    const {selectedTheme}=this.state;
    const showButton = () => {
      if (
        this.props.contentData.contents === undefined ||
        this.props.contentData.contents === null
      ) {
        console.log("page is empty while displaying");
      } else {
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

    return (
      <div className='app flex-row animated fadeIn innerPagesBg'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='10' xl='8'>
              <div className='d-flex justify-content-start align-items-center my-3'>
                <h4 className='pg-title'>Profile</h4>
              </div>

              <Card className='userDetails mb-4'>
                <CardBody className={`preview${selectedTheme}`}>
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
                    <h5 className={
                        selectedTheme === "Dark" || selectedTheme === "Scooter"
                          ? "text-white"
                          : "text-black"
                      }>{`@${this.props.userData.userName}`}</h5>
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
export default connect(mapStateToProps)(ProfilePreview);
// export default ProfilePreview;
