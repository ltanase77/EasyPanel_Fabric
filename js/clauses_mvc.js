(function () {
        'use strict';

        // The initialize function is run each time the page is loaded.
        Office.initialize = function (reason) {
            $(document).ready(function () {

                var model = {
                    userLanguage: Office.context.document.displayLanguage,
                    //function used for retrieving the content of the clauses
                    getData: function() {
                        return $.ajax({
                            url: "../json/clauses_array.json",
                            type: "GET",
                            dataType : "text",
                            timeout: 5000
                        });
                    }
                };

                var controller = {
                    //initialization function that sets the initial view and the necessary event handlers
                    init: function() {
                        view.setDate();
                        view.showLanguage();
                        view.showAlert(controller.getLanguage());
                        $(".lang button").on("click", function() { view.showOptions($(this).text()); } );
                        $("select").on("change", function() { view.showButtons($(this).val()); } );
                        $("section button").on("click", function() { controller.insertClause($(this).attr("id")); } );
                    },

                    getLanguage: function() {
                        return model.userLanguage;
                    },
                    //main function that parse the json data received from getData function and inserts the text in the Word document
                    insertClause: function(clause) {
                        if (Office.context.requirements.isSetSupported('WordApi', 1.1)) {
                            Word.run(function(context) {

                                model.getData()
                                    .then(function(response) {
                                        var articles = JSON.parse(response);
                                        articles = articles[clause];
                                        var thisDocument = context.document;
                                        var range = thisDocument.getSelection();

                                        articles.forEach(function(elem) {
                                            range.insertParagraph(elem, Word.InsertLocation.before);
                                        });
                                        return context.sync().then(function () {
                                            $("#error").html("<p>Added clause</p>");
                                        });
                                    })
                                    .catch(function(error) {
                                        var dialog = document.querySelector(".ms-Dialog");
                                        var button = document.querySelector(".Dialog-button");
                                        $(".ms-Dialog-title").html("<p>An Error has ocurred</p>");
                                        $(".ms-Dialog-content").html("<p>We were unable to retrieve the clause!</p><p>We aplogize for any inconvenience!</p>");
                                        var dialogComponent = new fabric['Dialog'](dialog);
                                        dialogComponent.open();
                                        function closeDialog(dialog) {
                                            dialogComponent.close();
                                        }
                                        button.onclick = function() {
                                            closeDialog(dialog);
                                        };
                                    });

                                return context.sync();
                            })
                            .catch(function (error) {
                                $("#error").html("<p>Error:" + JSON.stringify(error) + "</p>");
                                    if (error instanceof OfficeExtension.Error) {
                                        $("#error").html("<p>Debug info: " + JSON.stringify(error.debugInfo) + "</p>");
                                    }
                            });
                        }
                        else {
                            model.getData().then(
                                function(response) {
                                    var articles = JSON.parse(response);
                                    articles = articles[clause];
                                    articles = articles.join(" ");
                                    //Using the setSelectedDataAsync method for injecting the content of the clause
                                    Office.context.document.setSelectedDataAsync(articles, function(asyncResult) {
                                         if(asyncResult.status === Office.AsyncResultStatus.Failed) {
                                              $("#error").html("<p>Debug info: " + asyncResult.error.message);
                                         }
                                    });
                                },
                                function(error) {
                                    $('#error').html("<p>" + error + "</p>");
                                }
                            );
                        }
                    } //End of insertClause function
                };  //End of controller

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
                    //function used for showing the dissmisable alert banner which inform the user about the word version needed for running the panel
                    showAlert: function(lang) {
                        if (lang === "en-EN" || lang === "English" || lang === "Engleză") {
                            $(".ms-MessageBanner-clipper").text('This panel use Word 2013 or greater');
                        } else {
                            $(".ms-MessageBanner-clipper").text('Acest panou foloseste Word 2013 sau o versiune mai recenta')
                        }

                    },
                    //function showing the options that the user has for choosing a category of clauses
                    //it is invoked when the user choose the language
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
                    //functions showing the button used for inserting the clauseș
                    // it is invoked based on the selection made by the user
                    showButtons: function(btnVal) {
                        $(".buttons section").each(function() {
                            if ( btnVal === $(this).attr("data-clause-type") ) {
                                $(this).css("display", "block");
                            } else {
                                $(this).css("display", "none");
                            }
                        });
                    },
                    //function for setting the year in the footer of the panel
                    setDate: function() {
                        var date = new Date();
                        var year = date.getFullYear();
                        $('.first span').text(year);
                    }
                }; //End of view

                // Use this to check whether the API is supported in the Word client.
                if (Office.context.requirements.isSetSupported('WordApi', 1.0)) {
                    controller.init();
                }
                else {
                    // Just letting you know that this code will not work with your version of Word.
                    $(".ms-MessageBanner-clipper").text('This panel use Word 2013 or greater / Acest panou necesita Word 2013 sau o versiune mai recenta');
                } //End of the if conditional

            }); //End of JQuery READY function

        }; //End of Office initialization function

})(); //End of anonymus IFFE functions

