$(function(){

    $('#loading').append('<img src="img/loading.gif">');

    $("#refresh").click(function(){

        $("#grades .container").empty();
        $("#yGrades .grade").empty();
        $('#loading').append('<img src="img/loading.gif">');
        getGrades();

    })

})

var getGrades = function(term){

    var counter = 0;
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    var key = localStorage.getItem('key');
    var grades = [];
    var sum = 0;
    var nGrades = 0;

    $.post(

        "https://api.emilianomaccaferri.com/grades",
        {'username': username, 'password': password, 'key': key, 'term': term},
        function(res){

            if(res.error){

                $("#grades .container").append("<div class='grade' style='font-size: 2em; text-align: center; margin-top: 50px; border-bottom: transparent;'>"+res.error+"</div>");
                $("#loading").empty();
                return false;

            }

            //console.log(JSON.stringify(res));
            for(obj in res){

                grades.push(res[obj]);

            }

            localStorage.setItem("grades", grades);

            $("#loading").empty();

            for(obj in grades){
                var bg = '#2ecc71';
                var insuff = '';

                sum += parseInt(grades[obj].grade);
                if(grades[obj].grade < 6){

                    bg = '#e74c3c';
                    grades[obj].grade = '<b><u>' + grades[obj].grade + '</u></b>';
                    insuff = 'insuff';

                }
                nGrades++;

                $("#grades .container").append("<div class='grade " + insuff + "'>"
                + "<div class='subject'>" + grades[obj].subject + "</div>"
                + "<div class='single sg' style='background: " + bg +"'>" + grades[obj].grade + "<br>" + grades[obj].type + "</div>"
                + "<div class='single'>" + grades[obj].date);

            }

            $("#yGrades").append('<div class="grade" style="border-bottom: transparent !important;"><div class="subject">Media globale</div><div class="single">'+ (sum/nGrades).toFixed(2) +'</div>')
            $("#hideInsuff").css('opacity', 1);
            $("#loading").empty();

        }

    );

}
