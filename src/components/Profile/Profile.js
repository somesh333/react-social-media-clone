import React, { useState, useEffect } from "react";
import { Card, Button, Tabs, Form, Input, Modal } from "antd";
import {
  EnvironmentOutlined,
  MonitorOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Posts from "../Posts/Posts";
import { connect } from "react-redux";
import { editUserDetails, getUserData } from "../../redux/actions/userActions";
import store from "../../redux/store";

import moment from "moment";
import Post from "../Post/Post";
import UploadImage from "../UploadImage/UploadImage";
import PostsSkeleton from "../../util/PostsSkeleton";
const { TabPane } = Tabs;

const Profile = ({ user, UI, editUserDetails, data }, history) => {
  const [visible, setVisible] = useState(false);
  // const [loading, setLoading] = useState(false);

  // //////
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const mapUserDetailsToState = (credentials) => {
    credentials.bio && setBio(credentials.bio);
    credentials.website && setWebsite(credentials.website);
    credentials.location && setLocation(credentials.location);
  };
  useEffect(() => {
    store.dispatch(getUserData());
    mapUserDetailsToState(user.credentials);
    // eslint-disable-next-line
  }, []);

  const showModal = () => {
    setVisible(true);
  };
  const handleOk = () => {
    console.log("Clicked Ok");
    const userDetails = {
      bio,
      location,
      website,
    };
    editUserDetails(userDetails);

    setTimeout(() => {
      setVisible(false);
    }, 1000);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const { credentials } = user;
  const renderProfile =
    credentials && user.posts.length !== 0 && user.likes ? (
      <div>
        {/* {user} */}
        <Modal
          style={{ top: 20 }}
          visible={visible}
          onOk={handleOk}
          confirmLoading={UI.loading}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={UI.loading}
              onClick={handleOk}
            >
              {UI.loading === true ? "Updating" : "Update"}
            </Button>,
          ]}
        >
          <Form>
            <Form.Item label="Bio" name="bio">
              <Input
                placeholder="Add bio"
                onChange={(e) => setBio(e.target.value)}
                defaultValue={credentials.bio}
              />
            </Form.Item>
            <Form.Item label="Website" name="website">
              <Input
                placeholder="Add website"
                onChange={(e) => setWebsite(e.target.value)}
                defaultValue={credentials.website}
              />
            </Form.Item>
            <Form.Item label="location" name="location">
              <Input
                placeholder="Add location"
                onChange={(e) => setLocation(e.target.value)}
                defaultValue={credentials.location}
              />
            </Form.Item>
          </Form>
          <div className="text-center">
            <UploadImage img={credentials.imageUrl} />
          </div>
        </Modal>
        <Card className="ml-4 tab__card" style={{ minHeight: "100vh" }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-3 ">
              <div>
                <img
                  src={credentials.imageUrl}
                  alt=""
                  className="img-fluid rounded-circle"
                />
                <small className="text-center my-2 d-block">
                  <CalendarOutlined /> Joined{" "}
                  {moment(user.credentials.createdAt).format("MMM Do YY")}
                </small>
              </div>
            </div>
            <div className="col-lg-7 ml-3">
              <div className="user__info">
                <div className="user__name d-flex justify-content-center">
                  <h4 className="mr-2">{credentials.handle}</h4>
                  <Button onClick={showModal} size="small">
                    Edit
                  </Button>
                </div>
                <div className="others__info d-flex justify-content-between mx-5 mx-md-4">
                  <p>
                    <span className="font-weight-bold">40</span> posts
                  </p>
                  <p>
                    <span className="font-weight-bold">154</span> followers
                  </p>
                  <p>
                    <span className="font-weight-bold">256</span> following
                  </p>
                </div>
                {credentials.bio && (
                  <div className="user__bio " style={{ marginTop: "-15px" }}>
                    {credentials.bio}
                  </div>
                )}

                {credentials.website && (
                  <div className="user__website d-flex align-items-center justify-content-center">
                    <MonitorOutlined />
                    <a className="ml-1" href="abdur-rakib.github.io/portfolio">
                      {credentials.website}
                    </a>
                  </div>
                )}
                {credentials.location && (
                  <div className="user__location d-flex align-items-center justify-content-center">
                    <EnvironmentOutlined />
                    <span className="ml-1">{credentials.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Your Posts" key="1">
                {user.posts.length === 0 ? (
                  <h5 className="text-center mt-5">You have no posts</h5>
                ) : (
                  user.posts.map((post) => (
                    <Post key={post.createdAt} post={post} />
                  ))
                )}
              </TabPane>
              <TabPane tab="Liked Posts" key="2">
                {user.likes.length === 0 ? (
                  <h5 className="text-center mt-5">You have no liked post</h5>
                ) : (
                  user.likes.map((likePost) => (
                    <Post
                      key={likePost.postId}
                      post={data.posts.find(
                        (post) => post.postId === likePost.postId
                      )}
                    />
                  ))
                )}
              </TabPane>
              <TabPane tab="Saved Posts" key="3">
                <Posts />
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </div>
    ) : (
      <PostsSkeleton />
    );
  return renderProfile;
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    UI: state.UI,
    data: state.data,
  };
};

const mapActionsToProps = {
  editUserDetails,
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
