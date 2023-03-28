{
  // method to submit the form data for new post using AJAX
  let createPost = () => {
    let newPostForm = $(".new-post-form");
    newPostForm.submit((event) => {
      event.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(), // converts the post into JSON
        success: (data) => {
          console.log(data);
          let newPost = newPostDOM(data.data.post);
          $(".posts-list-container>ul").prepend(newPost);
          createComment(data.data.post._id);
          deletePost($(" .delete-post-button", newPost));
          new Noty({
            theme: "relax",
            text: "Post created successfully!",
            type: "success",
            layout: "topRight",
            timeout: 3000,
          }).show();
        },
        error: (error) => {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create the post in DOM
  let newPostDOM = (post) => {
    return $(`<li class="post-${post._id}">
  <small>
    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
  </small>
  <p>
     ${post.content}
    <br />
    ${post.user.name}
  </p>
  <div class="post-comments">
    <form action="/comments/create" class="post-${post._id}-comments-form" method="POST">
      <input
        type="text"
        name="content"
        placeholder="Type here to add comment required" />
      <input type="hidden" name="post" value="${post._id}" />
      <input type="submit" value="Add Comment" />
    </form>
    <div class="post-comments-list">
      <ul class="post-comment-${post._id}">
      </ul>
    </div>
  </div>
</li>
`);
  };

  let deletePost = (deleteLink) => {
    $(deleteLink).click((event) => {
      event.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: (data) => {
          $(`.post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post deleted successfully!",
            type: "success",
            layout: "topRight",
            timeout: 3000,
          }).show();
        },
        error: (error) => {
          console.log(error.responseText);
        },
      });
    });
  };

  let createComment = (postId) => {
    let commentForm = $(`.post-${postId}-comments-form`);
    commentForm.submit((event) => {
      event.preventDefault();
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: commentForm.serialize(),
        success: (data) => {
          console.log(data);
          let newComment = newCommentDOM(data.data.comment);
          $(`.post-comment-${data.data.comment.post}`).prepend(newComment);
          deleteComment($(" .delete-comment-button", newComment));
          new Noty({
            theme: "relax",
            text: "Comment created successfully!",
            type: "success",
            layout: "topRight",
            timeout: 3000,
          }).show();
        },
        error: (error) => {
          console.log(error.responseText);
        },
      });
    });
  };

  let newCommentDOM = (comment) => {
    return $(`<li class = "comment-${comment._id}">
  <p>
    <small>
      <a class ="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
    </small>
    ${comment.content}
    <br />
    ${comment.user.name}
  </p>
</li>`);
  };

  let deleteComment = (deleteLink) => {
    $(deleteLink).click((event) => {
      event.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: (data) => {
          $(`.comment-${data.data.comment_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Comment deleted successfully!",
            type: "success",
            layout: "topRight",
            timeout: 3000,
          }).show();
        },
        error: (error) => {
          console.log(error.responseText);
        },
      });
    });
  };

  let convertPostsToAjax = () => {
    let postsList = $(".posts-list-container>ul>li");
    for (let current of postsList) {
      deletePost($(" .delete-post-button", current));
      let postId = $(current).prop("class").split("-")[1];
      createComment(postId);
      convertCommentsToAjax(postId);
    }
  };

  let convertCommentsToAjax = (postId) => {
    console.log(postId);
    let commentsList = $(`.post-comment-${postId}>li`);
    for (let current of commentsList) {
      deleteComment($(" .delete-comment-button", current));
    }
  };

  createPost();
  convertPostsToAjax();
}
