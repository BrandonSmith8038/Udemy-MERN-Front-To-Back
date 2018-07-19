import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

class CommentFeed extends Component {
  render() {
    const { comments, postId } = this.props;
    console.log(comments);
    let commentFeedItem;
    if (comments && postId) {
      commentFeedItem = comments.map(comment => (
        <CommentItem key={comment._id} comment={comment} postId={postId} />
      ));
    } else {
      commentFeedItem = null;
    }
    return <div>{commentFeedItem}</div>;
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
};

export default CommentFeed;
