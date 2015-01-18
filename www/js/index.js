/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.onDeviceReady();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       // app.receivedEvent('deviceready');
        console.log('reached here');
        db = window.openDatabase("Database","1.0","My DB",2*1024*1024);
        db.transaction(createDB,errorDB,successDB);
        console.log('created db');
        db.transaction(insertDB,errorDB);
        db.transaction(selectDB,errorDB);

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        var pushPlugin = window.plugins.pushNotification;
        pushPlugin.register(app.successHandler, app.errorHandler,{"senderID":"324148190184","ecb":"app.onNotificationGCM"});
    },
    successHandler: function(result) {
        alert('Callback Success! Result = '+result);
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    }
};

function createDB(tx){
    tx.executeSql('DROP TABLE IF EXISTS EXERCISES');
    tx.executeSql('CREATE TABLE IF NOT EXISTS EXERCISES(id unique,exercise, exercise_item ,tag ,image )');
    // tx.executeSql("select * from EXERCISES",[],renderList,errorDB);
}

function insertDB(tx){
    var sql = 'INSERT INTO EXERCISES(exercise,exercise_item,tag) VALUES(?,?,?)';
    tx.executeSql(sql,["chest","chest press","tap"],successDB,errorDB);
    tx.executeSql(sql,["shoulder","shoulder press","tap"],successDB,errorDB);
    tx.executeSql(sql,["chest","inclined press","tap"],successDB,errorDB);
    tx.executeSql(sql,["shoulder","Barbell Upright Row","tap"],successDB,errorDB);
    tx.executeSql(sql,["shoulder","Arnold Dumbbell press","tap"],successDB,errorDB);
    tx.executeSql(sql,["shoulder","Side lateral Raise","tap"],successDB,errorDB);
    tx.executeSql(sql,["chest","Butterfly","tap"],successDB,errorDB);
    console.log('inserted into DB');
}


function selectDB(tx){
    tx.executeSql("select * from EXERCISES",[],renderList,errorDB);
}

function errorDB(err){
    console.log("error: "+ err.code);
}

function successDB(){
    console.log("success");
}


function renderExerciseList(){
    var len = results.rows.length;
    var div = '';
    for(var i=0; i<len;i++){
        console.log(results.rows.item(i).exercise_item);
        div += "<li><a href=''>"+
        "<img src=''>"+
        "<h2>"+results.rows.item(i).exercise+"</h2>"+
        "<p>Enter to see the list of exercises</p></a></li>";
    }
    $('#listView').html(div);
    $('#listView').listview('refresh');
}



function renderList(tx,results){
    console.log('render list');
    var len = results.rows.length;
    console.log('len: '+len);
    for(var i=0; i<len;i++){
        console.log(results.rows.item(i).exercise);
    }
}

function create_page(page_id,part) {

    $("#"+page_id).remove();
    $('#page_body').append('<div data-role="page" id="' + page_id + '"><div data-role="header" data-position="fixed" data-add-back-btn="true">' +
    '<h1>'+part+'</h1></div><div data-role="main" class="ui-content"></div>');

    //set whatever content you want to put into the new page
    var string = 'FOO BAR page...<br><br><a href="#page1">return to home screen</a>';
    var string1 = '';

    //append the new page onto the end of the body

    function buildList(tx){
        tx.executeSql("select * from EXERCISES",[],renderExerciseList,errorDB);

    }

    function renderExerciseList(tx,results){
        var len = results.rows.length;
        var div = '';
        for(var i=0; i<len;i++){
            console.log(results.rows.item(i).exercise_item);
            div += '<li><a href="javascript: create_page(\'chest_page\',\'chest\');">'+
            "<img src=''>"+
            "<h2>"+results.rows.item(i).exercise_item+"</h2>"+
            "<p>Enter to see the list of exercises</p></a></li>";
        }
        $('#listView'+page_id).html(div);
    }

    function errorDB(err){
        console.log("error: "+ err.code);
    }

    function successDB(){
        console.log("success");
    }


    //var db;
    //db = window.openDatabase("Database","1.0","My DB",2*1024*1024);
    //if(part.match('chest')) {
    //    db.transaction(function(tx){
    //        tx.executeSql("select * from EXERCISES where exercise = ?",[part],renderExerciseList,errorDB);
    //    });
    //    //db.transaction(buildList,errorDB,successDB);
    //}else if(part.match('shoulder')) {
    //    db.transaction(function(tx){
    //        tx.executeSql("select * from EXERCISES where exercise = ?",[part],renderExerciseList,errorDB);
    //    });
    //}else if(part.match('biceps')) {
    //    db.transaction(buildList,errorDB,successDB);
    //}else if(part.match('triceps')) {
    //    db.transaction(buildList,errorDB,successDB);
    //}else if(part.match('back')) {
    //    db.transaction(buildList,errorDB,successDB);
    //}else if(part.match('legs')) {
    //    db.transaction(buildList,errorDB,successDB);
    //}
    //
    ////initialize the new page
    //$.mobile.initializePage();
    //
    ////navigate to the new page
    //$.mobile.changePage("#" + page_id,{
    //    transition: "slide"
    //});
    //$('.listviewClass').listview('refresh');
    ////add a link on the home screen to navaigate to the new page (just so nav isn't broken if user goes from new page to home screen)
    //$('#page1 div[data-role="content"]').append('<br><br><a href="#' + page_id + '">go to ' + page_id + ' page</a>');
    //
    ////refresh the home screen so new link is given proper css
    //$('#page1 div[data-role="content"]').page();
}