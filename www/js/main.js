// use when testing phone gap as will not get fired in browser
document.addEventListener("deviceready", setup, false);

function setup() {
/
navigator.notification.alert(
'You are the winner!', // message
alertDismissed, // callback
'Game Over', // title
'Done' // buttonName
);
};