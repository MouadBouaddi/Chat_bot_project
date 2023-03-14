$( document ).ready( function () {

  $( '.navbar-button' ).click( function () {
    $( 'ul.navbar' ).fadeIn( 300 );
  } );
  $( '.close-navbar' ).click( function () {
    $( 'ul.navbar' ).fadeOut( 300 );
  } );

} );
