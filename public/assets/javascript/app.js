
$("#scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        $.ajax({
            method: "GET",
            url: "/"
        }).then(function (data) {
            console.log("yay");
        })
    })
});


$(document).on("click", ".add-button", function (event) {
    event.preventDefault();
    const thisId = $(this).attr("data-id");

    $.ajax({
        url: '/add/comment/' + thisId,
        type: 'POST',
        data: {body: $("#comment_section").val("")}
        }).then(function (data) {
            console.log(data);
        });
    $("#comment_section").val("");
});


$(document).on('click', '.remove-button', function () {
    // Get _id of comment to be deleted
    let thisId = $(this).attr("data-id");

    let baseURL = window.location.origin;

    $.ajax({
        url: baseURL + '/remove/comment/' + thisId,
        type: 'POST'
    })
        .then(function (data) {
            console.log(data);
            // Refresh the Window after the call is done
            location.reload();
        });

    // Prevent Default
    return false;

});


// Export Router to Server.js
module.exports = router;