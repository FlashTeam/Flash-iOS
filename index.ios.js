'use strict';

var React = require('react-native');
var moment = require('moment');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var API_URL = 'http://the.student.rit.edu:8080/posts';
var REQUEST_URL = API_URL;

var Flash = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderPost}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.imgContainer}>
        <Image style={styles.thumbnail} source={{uri: 'http://lorempixel.com/200/400/sports/5/'}} />
      </View>
    );
  },

  renderPost: function(post) {
    return (
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={{uri: "http://flashimg.s3.amazonaws.com/"+post.image}}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.title}>{post.username}</Text>
            <Text style={styles.year}>{post.comment}</Text>
            <Text style={styles.year}>{"Posted: "+moment(post.time).calendar()}</Text>
            <Text style={styles.year}>{"Expires "+moment(post.timeout).from(moment())}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{post.vote}</Text>
          </View>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#428bca',
    flex: 1,
  },
  leftContainer: {
    flex: 3,
    flexDirection: 'column'
  },
  rightContainer: {
    flex: 3,
    flexDirection: 'column',
    right: 10,
    position: 'absolute'
  },
  imgContainer: {
    backgroundColor: '#428bca',
    flex: 2,
    alignItems: 'center',

  },
  textContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 25,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10, 
    flex: 3,
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    color: '#777777',
  },
  year: {
    color: '#777777',
  },
  thumbnail: {
    flex: 1,
    width: 500,
    height: 350
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('Flash', () => Flash);
