var getGrades = function(){

    $('#loading').prepend('<img src="img/loading.gif">');

    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    var key = localStorage.getItem('key');
    var grades = [];
    var sum = 0;
    var nGrades = 0;

    $.post(

        "https://api.emilianomaccaferri.com/grades",
        {'username': username, 'password': password, 'key': key},
        function(res){

            //console.log(JSON.stringify(res));
            for(obj in res){

                grades.push(res[obj]);

            }

            localStorage.setItem("grades", grades);

            for(obj in grades){

                sum += parseInt(grades[obj].grade);
                if(grades[obj].grade <= 5){

                    grades[obj].grade = '<b><u>' + grades[obj].grade + '</u></b>';

                }
                nGrades++;

                $("#grades").append("<div class='grade'>"
                + "<div class='subject'>" + grades[obj].subject + "</div>"
                + "<div class='single'>" + grades[obj].grade + "<br>" + grades[obj].type + "</div>"
                + "<div class='single'>" + grades[obj].date);

            }

            $("#yGrades").append('<div class="grade"><div class="subject">Media globale</div><div class="single">'+ (sum/nGrades).toFixed(2) +'</div>')

        }

    );

}
