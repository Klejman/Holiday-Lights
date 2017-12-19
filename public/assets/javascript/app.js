$( document ).ready(function() {


    const baseURL = window.location.origin;

    //Add scraped content render on page
    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            console.lgo(data);
            $.ajax({
                method: "GET",
                url: "/"
            }).then(function (data) {
                console.log(data);
            })
        })
    });

//Add Comment
    $(".add-submit").on("click", function (event) {
        event.preventDefault();
        const HolidayArticleId = $(this).attr("data-id");
        console.log(HolidayArticleId);
        //turn into an array
        $.ajax({
            url: baseURL + '/holidayarticles/' + HolidayArticleId,
            type: 'POST',
            data: {comment: $(`comment_section${HolidayArticleId}`).val()}
        }).then(function (data) {
            console.log(data);
            $(`comment_section${HolidayArticleId}`).val()

        });
    });
    $('#commentsHere').on("click",  function () {

        let commentId = $(this).attr("data-id");
        $("#" + commentId).empty();
        console.log("this is commentId");
        console.log(commentId);
        $.ajax({
            method: "GET",
            url: `/holidayarticles/${$(this).attr("data-id")}`
        }).then(function (data) {
            // console.log(data);
            console.log(data.comment.body);
            for (let i = 0; i < data.comment.length; i++) {
                $("#" + commentId).addClass("commentHolder").append(`<div>${data.comment[i].body}</div>`);
            }
        })
    });
});

