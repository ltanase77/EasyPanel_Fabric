$(document).ready(function () {
					
    $(".lang button").on("click", function() {
        var target = $(this).text();
        if (target == "Romanian" || target == "Română") {
            $(".RO").css("display", "block");
            $(".intro_ro").css("display", "block");
            $(".options_ro").css("display", "block");
            $(".EN").css("display", "none");
            $(".intro_en").css("display", "none");
        } else if (target == "English" || target == "Engleză") {
            $(".EN").css("display", "block");
            $(".intro_en").css("display", "block");
            $(".options").css("display", "block");
            $(".RO").css("display", "none");
            $(".intro_ro").css("display", "none");
        }
    });
                    

    $("select").on("change", function() {
        var target = $(this).val();
        $(".buttons section").each(function() {
            if ( target == $(this).attr("data-clause-type") ) {
                $(this).css("display", "block");
            } else {
                $(this).css("display", "none");
            }
        });
    });        
});