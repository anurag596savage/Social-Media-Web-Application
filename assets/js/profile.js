{
  const createToggleFriend = () => {
    let toggleLink = $(".toggle-friend-button");
    toggleFriend(toggleLink);
  };

  const toggleFriend = (link) => {
    $(link).click((event) => {
      event.preventDefault();
      $.ajax({
        type: "post",
        url: $(link).prop("href"),
        success: (data) => {
          let displayText;
          if (data.data.deleted) {
            displayText = "Add Friend";
          } else {
            displayText = "Remove Friend";
          }
          $(link).html(`${displayText}`);
        },
        error: (error) => {
          console.log("Error in completing the request: ", error.responseText);
        },
      });
    });
  };

  createToggleFriend();
}
