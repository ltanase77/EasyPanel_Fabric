(function () {
        'use strict';

        // The initialize function is run each time the page is loaded.
        Office.initialize = function (reason) {
            $(document).ready(function () {

                // Use this to check whether the API is supported in the Word client.
                if (Office.context.requirements.isSetSupported('WordApi', 1.0)) {
                    // Do something that is only available via the new APIs
                    //function for displaying the buttons based on which the actual clauses will be inserted Ă

                    var model = {
                        userLanguage: Office.context.document.displayLanguage,

                        getData: function() {
                            return $.ajax({
                                    url: "clauses_array.json",
                                    type: "GET",
                                    dataType : "text",
                                    timeout: 5000
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
                            if (Office.context.requirements.isSetSupported('WordApi', 1.1)) {
                                Word.run(function(context) {
                               
                                    model.getData().then(function(response) {
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
                                model.getData().then(function(response) {
                                        var articles = JSON.parse(response);
                                        articles = articles[clause];
                                        articles = articles.join(" ");
                                        //Using the setSelectedDataAsync method for injecting the content of the clause
                                        Office.context.document.setSelectedDataAsync(articles, function(asyncResult) {
                                            if(asyncResult.status == Office.AsyncResultStatus.Failed) {
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
                      
                    $('#supportedVersion').html('<p>This code is using Word 2013 or greater.</p>');

                }
                else {
                    // Just letting you know that this code will not work with your version of Word.
                    $('#supportedVersion').html('<p>This code requires Word 2013 or greater.</p>');

                } //End of the main IF conditional

            }); //End of JQuery READY function

        }; //End of initialization function

})(); //End of anonymus IFFE functions

