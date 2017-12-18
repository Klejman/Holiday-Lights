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
    $(".add-submit btn").on("click", function (event) {
        event.preventDefault();
        const HolidayArticleId = $(this).attr("data-id");
        const commentByUser = $(".comment_section").$(this).attr("data-id");
        //turn into an array
        $.ajax({
            url: baseURL + '/holidayarticles/' + HolidayArticleId,
            type: 'POST',
            data:
        }).then(function (data) {
            console.log(data);
        });
    });
});