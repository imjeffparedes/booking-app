

// Dom7
var $$ = Dom7;


// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.redeeph.bookingapp', // App bundle ID
  name: 'Booking App', // App name
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

var uuid = "312b4fea3047a885";

if (typeof device !== 'undefined') {
    // the variable is defined
    uuid = device.uuid
}
// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-booking', {
  url: '/search-organization/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    StatusBar.show();
}



// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  var page =e.detail;
  console.log(page.name+' initialized' );
  var params = e.detail.route.params;
  var container = page.$el;

  if(page.name == 'organization'){
    console.log(params)

    container.find('#lnk-search-specialist').attr({href: '/booking/'+params.id});

    //get organization info
    app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/organization/'+params.id, function (data) {
     
      var obj = JSON.parse(data);

      console.log(obj)
      if(obj.data == null || Object.keys(obj.data)<=0){
        return;
      }
      localStorage.orgName = obj.data.name;
      container.find('#organization-name').html(obj.data.name);
      container.find('#organization-image').attr({src:obj.data.image});
      container.find('#organization-address').html(obj.data.address);
      container.find('#organization-contact').html(obj.data.contact);
      container.find('#organization-title').html(obj.data.name);
      container.find('#organization-email').html(obj.data.email);


      if(obj.data.contact==null || obj.data.contact.length<=0)
        container.find('#organization-contact-content').hide();

      if(obj.data.email==null || obj.data.email.length<=0)
        container.find('#organization-email-content').hide();
      if(obj.data.description!=null && obj.data.description.length>=10){
        container.find('#organization-description-small').html(obj.data.description.substring(0, 100)+'... ' +'<a href="#" id="desc-see-more" >see more</a>');
        container.find('#organization-description').html(obj.data.description+' <a href="#" id="desc-see-less">see less</a>');
      }
      function toggleDesc() {
         var short = document.getElementById("organization-description-small");
          var long = document.getElementById("organization-description");
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
    }) // end of ajax request

  }
  else if(page.name == 'search-organization'){

    app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/organization/all', function (data) {
     
      var obj = JSON.parse(data);
      console.log(obj)
      if(Object.keys(obj.data)<=0){
        $$('#org-search-result-content').html('<p class="text-align-center">Search not found</p>');
        return;
      }

      //set data on list
      var list='<ul>';

      //iterate data list
      obj.data.forEach(function(val, index) {
        if(val.image==null || val.image.length<=0)
          val.image="../img/avatar_1.png";
        if(val.description==null)
          val.description='';
         list+='<li><a href="/organization/'+val.id+'" class="item-link item-content" id="link-org-'+val.id+'">';
              list+='<div class="item-media"><img src="'+val.image+'" width="44"/></div>';
              list+='<div class="item-inner">';
                list+='<div class="item-title-row">';
                  list+='<div class="item-title">'+val.name+'</div>';
                list+='</div>';
                list+='<div class="item-subtitle">'+val.description+'</div>';
              list+='</div>';
            list+='</a></li>';

            $$(document).on('click','#link-org-'+val.id, function () {
              localStorage.orgId = val.id;
              
              
            });
      });

      list+='</ul>';

      $$('#org-search-result-content').html(list);

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


    }); // end of ajax request

  }
  else if(page.name == 'home'){
    container.find('#lnk-search').on('click',function(){
      console.log('clicked')
      app.tab.show('#view-booking',false);
    })

    app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/organization/6', function (data) {
     console.log(data)
      var obj = JSON.parse(data);
      if(Object.keys(obj.data)<0){
        return;
      }

      container.find('#app-title').html(obj.data.name);
      container.find('#org-name').html(obj.data.name);
      container.find('#org-description').html(obj.data.description);
      container.find('#org-image').attr({src:obj.data.image});
      container.find('#org-address').html(obj.data.address);
      container.find('#org-contact').html(obj.data.contact);
      container.find('#org-email').html(obj.data.email);

    }); // end of ajax request

  }else if(page.name == 'about'){
    app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/specialist/'+params.id, function (data) {
     
      var obj = JSON.parse(data);

      console.log(obj)
      if(Object.keys(obj.data)<=0){
        return;
      }
       if(obj.data.image==null || obj.data.image.length<=0)
          obj.data.image="../img/avatar_1.png";
        
      container.find('#specialist-name').html(obj.data.name);
      container.find('#specialist-image').attr({src:obj.data.image});
      container.find('#specialist-address').html(obj.data.address);
      container.find('#specialist-contact').html(obj.data.contact);
      container.find('#specialist-title').html(obj.data.name);
      if(obj.data.description!=null && obj.data.description.length>=10){
        container.find('#specialist-description-small').html(obj.data.description.substring(0, 100)+'... ' +'<a href="#" id="desc-see-more" >see more</a>');
        container.find('#specialist-description').html(obj.data.description+' <a href="#" id="desc-see-less">see less</a>');
      }
      var specializations = "";


      if(obj.data.specialization==null){
        container.find('#specialization-card').hide();
      }else
      obj.data.specialization.split(', ').forEach(function(val, index) {
        specializations+='<div class="chip"><div class="chip-label">'+val+'</div></div>';
      })
      container.find('#specialist-specialization').html(specializations);

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

      container.find('#desc-see-more').on('click',function(e){
        toggleDesc()
      })

      container.find('#desc-see-less').on('click',function(e){
        toggleDesc()
      })
      

    }); // end of ajax request

     app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/queue/', {specialistId:params.id}, function (data) { 
      var obj = JSON.parse(data);
      console.log(obj)
      if(Object.keys(obj.data)<=0){
        container.find('#schedule-content').html('<p class="text-align-center">No schedule found</p>');
        return;
      }

      container.find('#page-title').html(localStorage.specialistName);

      //set data on list
      var list='';

      //iterate data list
      obj.data.forEach(function(val, index) {
        list+='<li><a id="schedule-'+val.id+'" href="/line/'+val.id+'" id="#schedule-'+val.id+'">'+val.name+'</a></li>';
      });
      container.find('#schedule-content').html(list);
    }); //end of ajax request
     
  }else if(page.name == 'booking'){
  

    app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/specialist/', {organizationId:params.id}, function (data) { 
      var obj = JSON.parse(data);
      console.log(obj)
      if(Object.keys(obj.data)<=0){

        container.find('#specialist-content').html('<p class="text-align-center">No specialist found</p>');
        return;
      }

      container.find('#page-title').html(localStorage.orgName);

      //set data on list
      var list='<div class = "list"><ul>';

      //iterate data list
      obj.data.forEach(function(val, index) {
         if(val.image==null || val.image.length<=0)
          val.image="../img/avatar_1.png";
        if(val.description==null)
          val.description='';

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
              localStorage.specialistName = val.name;
            });
      });

      list+='</ul></div>';

      container.find('#specialist-content').html(list);

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


    });
  }
  else if(page.name == 'schedule'){
    app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/queue/', {specialistId:params.id}, function (data) { 
      var obj = JSON.parse(data);
      console.log(obj)
      if(Object.keys(obj.data)<=0){
        container.find('#schedule-content').html('<p class="text-align-center">No schedule found</p>');
        return;
      }

      container.find('#page-title').html(localStorage.specialistName);

      //set data on list
      var list='';

      //iterate data list
      obj.data.forEach(function(val, index) {
        list+='<li><a href="#" id="#schedule-'+val.id+'">'+val.name+'</a></li>';
           // Prompt


      });
      container.find('#schedule-content').html(list);


    });
  }
  else if(page.name == 'line'){


    container.find('#page-title').html(localStorage.specialistName);
    container.find('#specialist-name').html(localStorage.specialistName);

    app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/queue/'+params.id, function (data) { 
      var obj = JSON.parse(data);
      console.log(obj)
      if(Object.keys(obj.data)<=0){
        container.find('#schedule-content').html('<p class="text-align-center">No schedule found</p>');
        return;
      }
      container.find('#specialist-queue').html(localStorage.specialistQueueName);
    }); //end of ajax request
    

      container.find('#btn-book-ticket').on('click', function () {

         app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/myticket/', {
                                    queue_id:params.id,
                                    uuid:uuid
                                  }
            ,function (data) {
              console.log(data);

              var obj = JSON.parse(data);
              if(obj.data){
                app.dialog.alert('You already have ticket '+obj.data.name+', your ticket number is N0' + obj.data.id+'<br>We will notify you when you are next in line.','Ops');
                      
              }else{
                app.dialog.prompt('What is your full name?','Fill-up form', function (name) {
                  app.dialog.prompt('What is your mobile number ' + name + '?','Fill-up form', function (mobile) {

                    app.dialog.preloader();
                    app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/ticket/create', {
                                    queue_id:params.id,
                                    name:name,
                                    mobile:mobile,
                                    uuid:uuid,
                                    metadata:[]
                                  }
                      ,function (data) {
                     
                      var obj = JSON.parse(data);

                      app.dialog.alert('Thanks '+name+', your ticket number is N0' + obj.ticketId+'<br>We will notify you when you are next in line.','Complete');
                      refreshQueue(params.id);
                       app.dialog.close();
                    
                    });

                  });
                });

              }
            });

        
      });

    var refreshQueue = function(id){


      //get next inline tickets
      app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/ticket/'+id, {status:'PENDING'}, function (data) {
       
        var obj = JSON.parse(data);
        console.log(obj)

        if(Object.keys(obj.data)<0){

            $$('#inline-content').html('<p class="color-gray">--- Nothing in here ---</p>');
          return;
        }

        container.find('#noInLine').html(obj.data.length);
        //set data on list
        var items='';
        var yourNo = 0;

        //iterate data list
        obj.data.forEach(function(val, index) {
            //set data on list
          if(val.uuid!=null && val.uuid == uuid){
            yourNo = index+1;
            items+='<div class = "card">';
                items+='<div class = "card-content card-content-padding text-align-center">';
                if(yourNo ==1)
                  items+='<h2 style="font-weight: 900;">You\'re 1st!</h2>';
                else if(yourNo ==2)
                  items+='<h2 style="font-weight: 900;">You\'re 2nd!</h2>';
                else if(yourNo ==3)
                  items+='<h2 style="font-weight: 900;">You\'re 3rd!</h2>';
                else
                  items+='<h2 style="font-weight: 900;">You\'re '+yourNo+'th</h2>';

                   items+='<h3 style="font-weight: 300;">Ticket No: <b>N0'+val.id+'</b></h3>';
                  items+='<p style="font-weight: 300;">We will notify you when you are next in line.</p>';
                items+='</div>';
            items+='</div>';
            
          }    
        });

        if(items == ''){
          items+='<div class = "card">';
                items+='<div class = "card-content card-content-padding text-align-center">';
                  items+='<p style="font-weight: 300;">You are not in this line.</p>';
                items+='</div>';
            items+='</div>';
        }



        container.find('#myticket-content').html(items);



      });
    };


    refreshQueue(params.id);
  }

});


//- With callbacks on click
var ticket_option = app.actions.create({
  buttons: [
    {
      text: 'Hold',
      onClick: function () {
         app.dialog.confirm('Hold this ticket?', function () {
           
            app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/ticket/hold/1', function (data) {
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
            app.request.get('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/ticket/cancel/1', function (data) {
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
  

});



// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {



});

$$(document).on('click', '#tab-booking', function (e) {

  app.request.post('http://ec2-13-250-53-196.ap-southeast-1.compute.amazonaws.com:8084/v1/queue/', {organizationId:6}, function (data) {
   
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

        if(val.image==null || val.image.length<=0)
          val.image="../img/avatar_1.png";
        if(val.description==null)
          val.description='';

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