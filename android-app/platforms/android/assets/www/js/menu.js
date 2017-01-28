$(document).ready(function(){

    var toggled = 0;
    var toggledTerm = 0;
    var endpoint = 'https://api.emilianomaccaferri.com/appVersion';

    $.get(

        endpoint,
        function(res){

            if(res.version != localStorage.getItem('version')){

                $("#normal").append("<li id='download'><p><i class='fa fa-plus-circle' aria-hidden='true'></i> Aggiorna </p> </li> ");
                $("#download").click(function(){

                    var fileTransfer = new FileTransfer();
                    var uri = encodeURI("https://cdn.emilianomaccaferri.com/main/Registro-Fermi.apk");

                    alert("Download iniziato, in caso non apparisse il popup di download terminato, recati su https://registro.emilianomaccaferri.com per il download manuale");

                    fileTransfer.download(
                        uri,
                        cordova.file.externalRootDirectory + "Registro-Fermi.apk",
                        function(entry) {
                            alert("Nuova versione scaricata (locazione del file: "+entry.toURL()+")")
                            console.log("download complete: " + entry.toURL());
                        },
                        function(error) {
                            alert("Errore nel download: " + error.source + "\n" + error.target + "\n" + error.code);
                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("download error code" + error.code);
                        },
                        false,
                        {
                            headers: {
                                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                            }
                        }
                    );

                })

            }

        }

    );


    $("#terms .inner").slideUp();

    $("#terms").click(function(){

        if(toggledTerm == 1){

            $("#terms .inner").slideUp();
            toggledTerm = 0;

        }else{

            $("#terms .inner").slideDown();
            toggledTerm = 1;

        }

    });

    $("#first").click(function(){

        window.location = './grades.html';

    })

    $("#second").click(function(){

        window.location = './grades_2.html';

    })

    $("#selection").click(function(){

        if(toggled == 0){

            $("#left").animate({width: 50 + '%'}, "fast");
            $(".opac").animate({opacity: 1}, "fast");
            $(".opac").css({"z-index": 99});
            $("body").addClass("no-overflow");
            $("#left ul").animate({opacity: 1}, "fast");
            $("#left ul").css({"pointer-events": "all"});
            toggled = 1;

        }else{

            $("#left").animate({width: 0}, "fast");
            $(".opac").animate({opacity: 0}, "fast");
            $(".opac").css({"z-index": 0});
            $("body").removeClass("no-overflow");
            $("#left ul").animate({opacity: 0}, "fast");
            $("#left ul").css({"pointer-events": "none"});
            toggled = 0;

        }

        $(".opac").click(function(){

            $("#left").animate({width: 0}, "fast");
            $(".opac").animate({opacity: 0}, "fast");
            $(".opac").css({"z-index": 0});
            $("body").removeClass("no-overflow");
            $("#left ul").animate({opacity: 0}, "fast");
            $("#left ul").css({"pointer-events": "none"});
            toggled = 0;

        })

    });

    $("#logout").click(function(){

        localStorage.clear();
        sessionStorage.clear();
        window.location = './index.html';
        localStorage.setItem('accepted', true);

    })

});
