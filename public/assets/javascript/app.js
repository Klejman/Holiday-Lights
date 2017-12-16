$(function () {

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
    $(".add-button").on("click", function () {
        const HolidayArticleId = $(this).attr("data-id");
        // Get Form Data by Id
        const addInput = "form-add-" + HolidayArticleId;
        const display = $('#' + addInput);
        $.ajax({
            url: baseURL + '/add/comment/' + HolidayArticleId,
            type: 'POST',
            data: display.serialize()
        }).then(function (data) {
            console.log(data);
        });
        // $("#comment_section").val("");
    });


    $(document).on('click', '.remove-button', function () {
        // Get _id of comment to be deleted
        let thisId = $(this).attr("data-id");
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
})


// Export Router to Server.js
module.exports = router;