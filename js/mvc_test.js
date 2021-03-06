
$(document).ready(function () {

    var model = {
        userLanguage: 'en-EN',

        getData: function() {
            return $.ajax({
                    url: "json/clauses_array.json",
                    type: "GET",
                    dataType : "json", //"text"
                    timeout: 5000
                });
        }
    };

    var controller = {
        init: function() {
            view.setDate();
            view.showLanguage();
            view.showAlert(controller.getLanguage());
            $(".lang button").on("click", function() { view.showOptions($(this).text()); } );
            $("select").on("change", function() { view.showButtons($(this).val()); } );
            $("section button").on("click", function() { controller.insertClause($(this).attr("data-clause")); } );
        },

        getLanguage: function() {
            return model.userLanguage;
        },

        insertClause: function(clause) {
            model.getData()
                .then(function(response) {
                   //var articles = JSON.parse(response);
                   var articles = response[clause];
                   //console.log(articles);
                   articles.forEach(function (elem) {
                       console.log(elem);
                   });
                })
                .catch(function(jqXHR, textStatus, errorThrown) {
                    var dialog = document.querySelector(".ms-Dialog");
                    var button = document.querySelector(".Dialog-button");
                    $(".ms-Dialog-title").html("<p>An Error has ocurred</p>");
                    $(".ms-Dialog-content").html("<p>We were unable to retrieve the clause!</p><p>We aplogize for any inconvenience!</p>" + textStatus + errorThrown);
                    var dialogComponent = new fabric['Dialog'](dialog);
                    dialogComponent.open();
                    function closeDialog(dialog) {
                        dialogComponent.close();
                    }
                    button.onclick = function() {
                        closeDialog(dialog);
                    };
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

        showAlert: function(lang) {
            if (lang === "en-EN" || lang === "English" || lang === "Engleză") {
                $(".ms-MessageBanner-clipper").text('This panel use Word 2013 or greater');
            } else {
                $(".ms-MessageBanner-clipper").text('Acest panou foloseste Word 2013 sau o versiune mai recenta')
            }
        },

        showOptions: function(btnText) {
            var target = btnText;
            var supportedVersion = $("#supportedVersion");
            if (target === "Romanian" || target === "Română") {
                $(".RO").css("display", "block");
                $(".options_ro").css("display", "block");
                $(".intro_ro").css("display", "block");
                $(".EN").css("display", "none");
                $(".intro_en").css("display", "none");
                if (supportedVersion) { view.showAlert(target);} 
            } else if (target === "English" || target === "Engleză") {
                $(".EN").css("display", "block");
                $(".intro_en").css("display", "block");
                $(".options").css("display", "block");
                $(".RO").css("display", "none");
                $(".intro_ro").css("display", "none");
                if (supportedVersion) { view.showAlert(target);} 
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
        },

        setDate: function() {
            var date = new Date();
            var year = date.getFullYear();
            $('.first span').text(year);
        }

    }; //End of view 

    controller.init();

}); //End of JQuery READY function


