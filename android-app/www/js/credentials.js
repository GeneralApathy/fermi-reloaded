var count = 0;

function setCredentials(){

        if(count == 1){

            return false;

        }

        count++;

        $('#loading').prepend('<img src="img/loading.gif">');

        var pieces = ["Rzeq", "879c", "xbK3", "sX99", "r1hq", "YRzb", "taM8", "Lqg8"];

        var key = '';

        for(var i = 0; i < pieces.length; i++){

            key += pieces[pieces.length - 1 - i];

        }

        localStorage.setItem("key", key);

        var username = $("#username").val().trim();
        var password = $("#password").val();

        if(!username || !password){

            alert("Riempi i campi mancanti");
            count = 0;
            $("#loading").empty();
            return false;

        }

        $.post(

            "https://api.emilianomaccaferri.com/login",
            {'username': username, 'password': password, 'key': key},
            function(res){

                console.log(res);

               if(res.success == false){

                   alert("Username/Password errati");
                   $("#loading").empty();
                   count = 0;

               }else{

                   localStorage.setItem('username', username);
                   localStorage.setItem('password', password);
                   localStorage.setItem('accepted', true);
                   window.location = './grades.html';
                   $("#loading").empty();
                   count = 0;

               }

            }

        );

}
