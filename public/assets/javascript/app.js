$( document ).ready(function() {


    const baseURL = window.location.origin;

    //Add scraped content render on page
    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            console.log(data);
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
        console.log(`this worked too ${HolidayArticleId}`);
        //turn into an array
        console.log($(`#comment_section${HolidayArticleId}`).val());
        $.ajax({
            url: baseURL + '/holidayarticles/' + HolidayArticleId,
            type: 'POST',
            data: {
                comment: $(`#comment_section${HolidayArticleId}`).val(),
                _HolidayArticleId: HolidayArticleId
            }
        }).then(function (data) {
            console.log('this worked from server', data);
            $(`comment_section${HolidayArticleId}`).val()

        });
    });
    $('.viewComments').on("click",  function () {

        let commentId = $(this).attr("data-comments");
        // $(this).empty();
        console.log("this is commentId");
        console.log(commentId);
        // console.log(`/holidayarticles/${$(this).attr("data-id")}`);

        $.ajax({
            method: "GET",
            url: `/holidayarticles/${$(this).attr("data-id")}`
        }).then(function (data) {
            // console.log(data);
            console.log("Server: ", data);
            for (let i = 0; i < data.length; i++) {
                $(`#comment_container${data[i]._HolidayArticleId}`).append(`<div>${data[i].comment}</div>`);
            }
        })
    });
});

