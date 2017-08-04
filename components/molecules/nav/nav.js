import $ from 'jquery';

const nav = () => {
  $(function() {
    const toggleMenu = () => {
      $('.navbar-toggle').toggleClass('active');
      $('body').toggleClass('open');
    };

    // Handle click on menu toggle button
    $(
      '.navbar-container'
    ).on('click', '.navbar-toggle, .navbar-overlay', function() {
      toggleMenu();
    });

    // Close menu on Escape key
    $(document).keyup(function(e) {
      if (
        e.keyCode === 27 &&
        $('body').hasClass('open') &&
        $('body').hasClass('open')
      )
        toggleMenu();
    });
  });
};

export default nav;
