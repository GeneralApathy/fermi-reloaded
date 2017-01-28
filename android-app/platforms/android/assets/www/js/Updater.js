var getVersion = function(){

    var endpoint = 'https://api.emilianomaccaferri.com/appVersion';
    $.get(

        endpoint,
        function(res){

            return res.version;

        }

    );

}
