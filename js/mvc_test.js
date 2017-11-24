
$(document).ready(function () {

    var model = {
        userLanguage: 'en-EN',

        getData: function() {
            return new Promise(function(resolve, reject) {
                var jqXHR = $.ajax({
                    url: "clauses_array.json",
                    type: "GET",
                    dataType : "json", //"text"
                    timeout: 5000,
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(data) {
                        reject(data);
                    }
                });
            });
        }
    };

    var controller = {
        init: function() {
            view.showLanguage();
            $(".lang button").on("click", function() { view.showOptions($(this).text()); } );
            $("select").on("change", function() { view.showButtons($(this).val()); } );
            $("section button").on("click", function() { controller.insertClause($(this).attr("id")); } );
        },

        getLanguage: function() {
            return model.userLanguage;
        },

        insertClause: function(clause) {
            model.getData().then(function(response) { 
                   //var articles = JSON.parse(response);
                   var articles = response[clause];
                   articles.forEach(function(elem) {
                       console.log(elem);
                    });
                }, function(error) {
                	console.log(error.status + " " + error.statusText);
                });
        }
                       
    }; //End of controller

    var view = {
        showLanguage: function() {

            var language = controller.getLanguage();

            if (language === 'ro-RO') {
                $(".intro_ro").css("display", "block");
                $(".intro_en").css("display", "none");
            } else {
                $(".intro_en").css("display", "block");
                $(".intro_ro").css("display", "none");
            }
        },

        showOptions: function(btnText) {
            var target = btnText;
            if (target === "Romanian" || target === "Română") {
                $(".RO").css("display", "block");
                $(".options_ro").css("display", "block");
                $(".intro_ro").css("display", "block");
                $(".EN").css("display", "none");
                $(".intro_en").css("display", "none");
            } else if (target === "English" || target === "Engleză") {
                $(".EN").css("display", "block");
                $(".intro_en").css("display", "block");
                $(".options").css("display", "block");
                $(".RO").css("display", "none");
                $(".intro_ro").css("display", "none");
            }
        },

        showButtons: function(btnVal) {
            $(".buttons section").each(function() {
                if ( btnVal === $(this).attr("data-clause-type") ) {
                    $(this).css("display", "block");
                } else {
                    $(this).css("display", "none");
                }
            });
        }

    }; //End of view 

    controller.init();

}); //End of JQuery READY function


