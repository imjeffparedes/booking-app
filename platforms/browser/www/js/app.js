

// Dom7
var $$ = Dom7;


// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'About', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-booking', {
  url: '/booking/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});


// create searchbar
var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '.list',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      console.log(query, previousQuery);
    }
  }
});


//- With callbacks on click
var ticket_option = app.actions.create({
  buttons: [
    {
      text: 'Hold',
      onClick: function () {
         app.dialog.confirm('Hold this ticket?', function () {
           
            app.request.get('http://localhost:8084/v1/ticket/hold/1', function (data) {
              console.log(data);

              var obj = JSON.parse(data);
              if(obj>=1)
               app.dialog.alert('Ticket Holded!');
              else
               app.dialog.alert(obj.message);
            });
        });
      }
    },
    {
      text: 'Cancel',
      onClick: function () {
         app.dialog.confirm('Cancel this ticket?', function () {
            app.request.get('http://localhost:8084/v1/ticket/cancel/1', function (data) {
              console.log(data);
              if(obj>=1)
               app.dialog.alert('Ticket Canceled!');
              else
               app.dialog.alert(obj.message);
            });
          });
      }
    },
    {
      text: 'Back',
      color: 'red'
    }
  ]
});

    // Export app to global
    window.app = app;


$$(document).on('click', '.btn-ticket-option', function () {
    ticket_option.open();
});



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="home"]', function (e) {
  

  app.request.get('http://localhost:8084/v1/organization/6', function (data) {
   console.log(data)
    var obj = JSON.parse(data);
    if(Object.keys(obj.data)<0){
      return;
    }

    $$('.page[data-name="settings"]').find('#app-title').html(obj.data.name);
    $$('.page[data-name="home"]').find('#app-title').html(obj.data.name);
    $$('.page[data-name="home"]').find('#org-name').html(obj.data.name);
    $$('.page[data-name="home"]').find('#org-description').html(obj.data.description);
    $$('.page[data-name="home"]').find('#org-image').attr({src:obj.data.image});
    $$('.page[data-name="home"]').find('#org-address').html(obj.data.address);
    $$('.page[data-name="home"]').find('#org-contact').html(obj.data.contact);
    $$('.page[data-name="home"]').find('#org-email').html(obj.data.email);

  });

});



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {


  
  var params = e.detail.route.params;


  app.request.get('http://localhost:8084/v1/queue/'+params.id, function (data) {
   
    var obj = JSON.parse(data);

    console.log(obj)
    if(Object.keys(obj.data)<=0){
      return;
    }
     var page = $$('.page[data-name="about"]');
    page.find('#specialist-name').html(obj.data.name);
    page.find('#specialist-image').attr({src:obj.data.image});
    page.find('#specialist-address').html(obj.data.address);
    page.find('#specialist-contact').html(obj.data.contact);
    page.find('#specialist-title').html(obj.data.name);

    page.find('#specialist-description-small').html(obj.data.description.substring(0, 100)+'... ' +'<a href="#" id="desc-see-more" >see more</a>');
    page.find('#specialist-description').html(obj.data.description+' <a href="#" id="desc-see-less">see less</a>');
    
    function toggleDesc() {
       var short = document.getElementById("specialist-description-small");
        var long = document.getElementById("specialist-description");
        if (short.style.display === "none") {
          long.style.display = "none";
          short.style.display = "block";
        }else{
          short.style.display = "none";
          long.style.display = "block";
        }
    }

    $$('#desc-see-more').on('click',function(e){
      toggleDesc()
    })

    $$('#desc-see-less').on('click',function(e){
      toggleDesc()
    })
    

  });

  var container =  $$('.page[data-name="about"]');

  // Prompt
  container.find('.btn-book-ticket').on('click', function () {
    app.dialog.prompt('What is your name?', function (name) {
      app.dialog.confirm('Are you sure you want to book ' + name + '?', function () {

        app.dialog.preloader();
        app.request.post('http://localhost:8084/v1/ticket/create', {
                        queue_id:params.id,
                        metadata:[{
                            name:"name",
                            value:name
                          }]}
          ,function (data) {
         
          var obj = JSON.parse(data);

          app.dialog.alert('Ok '+name+', your ticket number is N0' + obj.ticketId);
          refreshQueue(params.id);
           app.dialog.close();
        
        });

      });
    });
  });


  
   refreshQueue(params.id);
   

});

$$(document).on('click', '#tab-booking', function (e) {

  app.request.post('http://localhost:8084/v1/queue/', {organizationId:6}, function (data) {
   
    var obj = JSON.parse(data);

  console.log(obj)
    if(Object.keys(obj.data)<=0){

      $$('#org-content').html('<p class="text-align-center">No specialist found</p>');
      return;
    }

    //set data on list
    var list='<div class = "list"><ul>';

    //iterate data list
    obj.data.forEach(function(val, index) {
       list+='<li><a href="/about/'+val.id+'" class="item-link item-content" id="link-specialist-'+val.id+'">';
            list+='<div class="item-media"><img src="'+val.image+'" width="44"/></div>';
            list+='<div class="item-inner">';
              list+='<div class="item-title-row">';
                list+='<div class="item-title">'+val.name+'</div>';
              list+='</div>';
              list+='<div class="item-subtitle">'+val.description+'</div>';
            list+='</div>';
          list+='</a></li>';

          $$(document).on('click','#link-specialist-'+val.id, function () {
            localStorage.specialistId = val.id;
          });
    });

    list+='</ul></div>';

    $$('#org-content').html(list);
  });
});


var refreshQueue = function(id){


    $$('#serving-content').html('<div class=" preloader"></div>');

  //get currently serving tickets
 app.request.post('http://localhost:8084/v1/ticket/'+id, {status:'SERVING'},function (data) {
   
    var obj = JSON.parse(data);
    if(Object.keys(obj.data)<0){
      $$('#serving-content').html('<p>----Nothing follows----</p>');
      return;
    }

    //set data on list
    var items='';

    //iterate data list
    obj.data.forEach(function(val, index) {
        //set data on list
      items+=' <div class = "card"><div class = "card-content card-content-padding"><div class = "row">';
      items+='<div class = "col-25"><b>N0'+val.id+'</b></div>';
      items+='<div class = "col-75">'+val.description+'</div>'; 
      items+='</div></div></div>';         
    });
    $$('#serving-content').html(items);
  });


    $$('#inline-content').html('<div class=" preloader"></div>');

  //get next inline tickets
  app.request.get('http://localhost:8084/v1/ticket/'+id, function (data) {
   
    var obj = JSON.parse(data);

    if(Object.keys(obj.data)<0){

      $$('#inline-content').html('<p>----Nothing follows----</p>');
      return;
    }

    //set data on list
    var items='';

    //iterate data list
    obj.data.forEach(function(val, index) {
        //set data on list
      items+=' <div class = "card"><div class = "card-content card-content-padding"><div class = "row">';
      items+='<div class = "col-25"><b>N0'+val.id+'</b></div>';
      items+='<div class = "col-75">'+val.created+'</div>'; 
      items+='</div></div></div>';         
    });


    $$('#inline-content').html(items);
  });
};



/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    console.log(href);
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};