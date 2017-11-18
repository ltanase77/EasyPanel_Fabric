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

                        getData: function(clause) {
                            $.ajax({
                                url: "clauses_array.json",
                                type: "GET",
                                dataType : "text",
                                success: function(data) {
                                    var content = JSON.parse(data);
                                    var articles = content[clause]
                                    return clause;
                                },
                                error: function() {
                                    return false;
                                },
                                timeout: 5000
                            });
                        }
                    };

                    var controller = {
                        init: function() {
                            showLanguage();
                            $(".lang button").on("click", view.showOptions($(this).text()));
                            $("select").on("change", view.showButtons($(this).val()));
                            $("button").on("click", controller.insertClause($(this).attr("id")));
                        },

                        getLanguage: function() {
                            return model.userLanguage;
                        },

                        insertClause: function(clause) {
                            //Getting the clause as an array of individual paragraphs
                            var articles = model.getData(clause);

                            if (Office.context.requirements.isSetSupported('WordApi', 1.1)) {
                                Word.run(function (context) {
                                // Create a proxy object for the document.

                                    var thisDocument = context.document;
                                    // Queue a command to get the current selection.
                                    // Create a proxy range object for the selection.

                                    var range = thisDocument.getSelection();
                                    
                                    // Queue a command to replace the selected text.
                                
                                    articles.forEach(function(elem) {
                                        range.insertParagraph(elem, Word.InsertLocation.before);
                                    });
                        
                                    // Synchronize the document state by executing the queued commands,
                                    // and return a promise to indicate task completion.
                                    return context.sync().then(function () {
                                        $("#error").html("<p>Added clause</p>");
                                    });
                                })
                                .catch(function (error) {
                                    $("#error").html("<p>Error:" + JSON.stringify(error) + "</p>");
                                    if (error instanceof OfficeExtension.Error) {
                                        $("#error").html("<p>Debug info: " + JSON.stringify(error.debugInfo) + "</p>");
                                    }
                                });
                            } 
                            else {

                                articles = articles.join(" ");

                                //Using the setSelectedDataAsync method for injecting the content of the clause
                                Office.context.document.setSelectedDataAsync(articles, function(asyncResult) {
                                    if(asyncResult.status == Office.AsyncResultStatus.Failed) {
                                    $("#error").html("<p>Debug info: " + asyncResult.error.message);
                                    }
                                });  
                            }
                        }
                       
                    }; //End of controller

                    var view = {
                        showLanguage: function() {
                            var language = getLanguage();
                            if (language === 'ro-RO') {
                                $(".intro_ro").css("display", "block");
                            } else {
                                $(".intro_en").css("display", "block");
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
                                if ( btnVal === $(this).attr("class") ) {
                                    $(this).css("display", "block");
                                } else {
                                    $(this).css("display", "none");
                                }
                            });
                        }

                    }; //End of view
                      
                    $('#supportedVersion').html('<p>This code is using Word 2013 or greater.</p>');

                }
                else {
                    // Just letting you know that this code will not work with your version of Word.
                    $('#supportedVersion').html('<p>This code requires Word 2013 or greater.</p>');

                } //End of the main IF conditional

            }); //End of JQuery READY function

        }; //End of initialization function

})(); //End of anonymus IFFE functions

