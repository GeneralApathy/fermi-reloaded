$(function(){

    $('#loading').append('<img src="img/loading.gif">');

    $("#refresh").click(function(){

        $("#grades .container").empty();
        $('#loading').append('<img src="img/loading.gif">');
        getTests();

    })

})

var getTests = function(){

    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    var key = localStorage.getItem('key');
    var tests = [];
    var sum = 0;
    var nGrades = 0;

    $.post(

        "https://api.emilianomaccaferri.com/tests",
        {'username': username, 'password': password, 'key': key},
        function(res){

            //console.log(JSON.stringify(res));
            for(obj in res){

                if(res[obj].status != " S " && res[obj].status)
                tests.push(res[obj]);

            }

            localStorage.setItem("tests", tests);

            console.log(JSON.stringify(tests));

            $("#loading").empty();

            for(obj in tests){

                $("#grades .container").append("<div class='grade' style='border-bottom: 2px solid #DADADA !important;'>"
                + "<div class='subject'>" + tests[obj].subject + "</div>"
                + "<div class='single'>" + tests[obj].topic + "<br><b>" + tests[obj].type + "</b></div>"
                + "<div class='single'>" + tests[obj].data);

            }

        }

    );

}
