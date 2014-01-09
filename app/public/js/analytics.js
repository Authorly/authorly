// Google Analytics
 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-38933484-1']);
 _gaq.push(['_trackPageview']);

 (function() {
   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
 })();


// KISS metrics
var _kmq = _kmq || [];
var _kmk = _kmk || 'eaa44bcbccb5653fdfe62261d025ec89ee4e6802';
function _kms(u){
  setTimeout(function(){
    var d = document, f = d.getElementsByTagName('script')[0],
    s = d.createElement('script');
    s.type = 'text/javascript'; s.async = true; s.src = u;
    f.parentNode.insertBefore(s, f);
  }, 1);
}
_kms('//authorly.com/js/i.js');
_kms('//authorly.com/js/eaa44bcbccb5653fdfe62261d025ec89ee4e6802.1.js');