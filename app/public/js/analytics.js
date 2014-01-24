// Google Analytics
 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-38933484-1']);
 _gaq.push(['_trackPageview']);

 (function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
 })();

window.kissmetrics = window.kissmetrics || {};
window.kissmetrics.trackEvent = function(event_name) {
  $.post('/kmetrics.json', {
    km_event: {
      name: event_name
    }
  }, 'json');
};
